/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {html, LitElement, nothing, PropertyValues} from 'lit';
import {customElement, property, queryAsync} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

// Material Icons
import '@material/web/icon/icon.js';

// Controllers
import {UiStateController} from './internal/ui-state-controller';
import {EventsController} from './internal/events-controller.js';

// Types and Constants
import {DataColumn, SortDirection} from './types.js';
import {cssClasses, events} from './constants.js';

// Styles
import {headerCellStyles} from './lib/data-table-header-cell-styles.css.js';

/**
 * @summary A header cell component for the data table that displays column headers.
 *
 * @description
 * The header cell component handles column sorting, resizing, and other header-specific
 * functionality.
 *
 * @example
 * ```html
 * <md-data-table-header-cell sortable>Column Name</md-data-table-header-cell>
 * ```
 */
@customElement('md-data-table-header-cell')
export class MdDataTableHeaderCell extends LitElement {
	static override styles = [headerCellStyles];

	/**
	 * Whether the column is sortable.
	 */
	@property({type: Boolean})
	sortable = false;

	/**
	 * Current sort direction of the column.
	 */
	@property({type: String})
	sortDirection: SortDirection = null;

	/**
	 * Whether the column contains numeric data (right-aligned).
	 */
	@property({type: Boolean, reflect: true})
	numeric = false;

	/**
	 * Width of the column. Can be any valid CSS width value.
	 */
	@property({type: Number})
	width?: number;

	/**
	 * Whether the column is resizable.
	 */
	@property({type: Boolean})
	resizable = true;

	/**
	 * Whether the column is draggable for reordering.
	 */
	@property({type: Boolean})
	draggable = true;

	/**
	 * Column identifier
	 */
	@property({type: Object})
	column: DataColumn = null!;

	@queryAsync('.resize-handle')
	private readonly resizeHandle!: Promise<HTMLDivElement>;

	private readonly stateController = new UiStateController(this);
	private readonly eventsController = new EventsController(this);

	private resizeStartX = 0;
	private resizeStartWidth = 0;
	private isResizing = false;

	constructor() {
		super();
		this.setupResizeHandlers();
	}

	connectedCallback() {
		super.connectedCallback();
		requestAnimationFrame(() => {
			this.setupDragHandlers();
		});
	}

	protected updated(_changedProperties: PropertyValues) {
		super.updated(_changedProperties);
		if (_changedProperties.has('width')) {
			this.style.width = this.width ? `${this.width}px` : 'auto';
		}
	}

	private setupResizeHandlers() {
		if (!this.resizable) return;
		this.resizeHandle.then(handle => {
			handle.addEventListener('mousedown', this.handleResizeStart);
			window.addEventListener('mousemove', this.handleResizeMove);
			window.addEventListener('mouseup', this.handleResizeEnd);
		});
	}

	private setupDragHandlers() {
		if (!this.draggable) return;
		this.addEventListener('dragstart', this.handleDragStart);
		this.addEventListener('dragover', this.handleDragOver);
		this.addEventListener('drop', this.handleDrop);
		this.addEventListener('dragend', this.handleDragEnd);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		if (this.resizable) {
			window.removeEventListener('mousemove', this.handleResizeMove);
			window.removeEventListener('mouseup', this.handleResizeEnd);
		}
	}

	private handleDragStart = (event: DragEvent) => {
		if (!this.draggable || !event.dataTransfer) return;

		// Prevent drag if we're clicking the resize handle or sort icon
		const target = event.target as HTMLElement;
		if (target.closest('.resize-handle') || target.closest('md-icon')) {
			event.preventDefault();
			return;
		}

		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', this.column.path + '');

		// Add visual feedback
		this.classList.add('dragging');
	};

	private handleDragOver = (event: DragEvent) => {
		if (!this.draggable) return;
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'move';
	};

	private handleDrop = (event: DragEvent) => {
		if (!this.draggable) return;
		event.preventDefault();

		const sourceColumnId = event.dataTransfer!.getData('text/plain');
		const targetColumnId = this.column.path;

		if (sourceColumnId !== targetColumnId) {
			this.dispatchEvent(new CustomEvent('column-reorder', {
				bubbles: true,
				composed: true,
				detail: {
					sourceColumnId,
					targetColumnId
				}
			}));
		}
	};

	private handleDragEnd = () => {
		this.classList.remove('dragging');
	};

	private handleResizeStart = (event: MouseEvent) => {
		// Only start resize if clicking the resize handle
		const target = event.target as HTMLElement;

		this.isResizing = true;
		this.resizeStartX = event.clientX;
		this.resizeStartWidth = this.getBoundingClientRect().width;
		event.preventDefault();
	};

	private handleResizeMove = (event: MouseEvent) => {
		if (!this.isResizing) return;

		const delta = event.clientX - this.resizeStartX;
		const newWidth = Math.max(150, this.resizeStartWidth + delta);
		this.style.width = `${newWidth}px`;
		this.eventsController.dispatchColumnResize(
			this.column,
			newWidth
		);
	};

	private handleResizeEnd = () => {
		this.isResizing = false;
	};

	private handleClick(event: MouseEvent) {
		if (this.isResizing || !this.sortable) return;

		let direction: SortDirection = 'asc';
		if (this.sortDirection === 'asc') direction = 'desc';
		else if (this.sortDirection === 'desc') direction = null;

		this.eventsController.dispatchSortChanged(
			this.column,
			direction
		);
	}

	private getSortIcon(): string {
		if (!this.sortDirection) return 'unfold_more';
		return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
	}

	protected override render() {
		const headerClasses = this.stateController.getHeaderCellClasses({
			sortable: this.sortable,
			sorted: !!this.sortDirection,
			numeric: this.numeric,
			draggable: this.draggable
		});

		return html`
			<div class=${classMap(headerClasses)}
			     style="width: ${this.width ? `${this.width}px` : 'auto'}"
				 role="columnheader"
				 aria-sort=${this.sortDirection ?? 'none'}
				 draggable=${this.draggable}
			>
				<div class="md-data-table__header-cell__content">
					<slot></slot>
					${this.sortable ? html`
						<md-icon class="md-data-table__header-cell__sort-icon"
								 @click=${this.handleClick}>
							${this.getSortIcon()}
						</md-icon>
					` : nothing}
				</div>
				${this.resizable ? html`
					<div class="resize-handle"></div>
				` : nothing}
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'md-data-table-header-cell': MdDataTableHeaderCell;
	}
}