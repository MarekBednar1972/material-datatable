/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {html, LitElement, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

// Material Web imports
import '@material/web/checkbox/checkbox.js';
import '@material/web/progress/circular-progress.js';
import '@lit-labs/virtualizer';

// Internal Controllers
import {DataTableController, EventsController, StateController, VirtualScrollController} from './internal/index.js';

// Styles
import {styles} from './lib/data-table-styles.css.js';

// Types and Constants
import {DataItem, DataTableSize, ResizeEvent, SortEvent,} from './types.js';
import {cssClasses, events, strings} from './constants.js';

// Subcomponents
import './md-data-table-row.js';
import './md-data-table-cell.js';
import './md-data-table-header-cell.js';
import {RangeChangedEvent} from "@lit-labs/virtualizer";

/**
 * @summary Data tables display sets of data across rows and columns.
 *
 * @description
 * Data tables display information in a grid-like format of rows and columns. They
 * organize information in a way that's easy to scan, so that users can look for
 * patterns and insights.
 *
 * @example
 * ```html
 * <md-data-table>
 *   <md-data-table-header-cell>Column 1</md-data-table-header-cell>
 *   <md-data-table-header-cell>Column 2</md-data-table-header-cell>
 *   <!-- ... -->
 * </md-data-table>
 * ```
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-data-table')
export class MdDataTable extends LitElement {
	static override styles = [styles];

	/**
	 * Size variant of the data table.
	 */
	@property({type: String})
	size: DataTableSize = strings.DEFAULT_SIZE;

	/**
	 * Whether the table supports sorting.
	 */
	@property({type: Boolean})
	sortable = true;

	@property({type: Boolean})
	resizable = true;

	/**
	 * Whether the table supports row selection.
	 */
	@property({type: Boolean})
	selectable = true;

	/**
	 * Array of column definitions.
	 */
	@property({type: Array})
	columns: string[] = [];

	/**
	 * The data to display in the table.
	 */
	@property({type: Array})
	data: DataItem[] = [];

	/**
	 * Total number of items (for virtual scrolling).
	 */
	@property({type: Number})
	totalItems = 0;

	@state()
	private columnWidths: Record<string, number> = {};

	// Controllers
	private readonly dataController = new DataTableController(this);
	private readonly virtualScrollController = new VirtualScrollController(this);
	private readonly eventsController = new EventsController(this);
	private readonly stateController = new StateController(this);

	constructor() {
		super();
		this.setupEventListeners();
	}

	private initDefaultColumnWidths() {
		this.columnWidths = this.columns.reduce((acc, column) => {
			acc[column] = 100;
			return acc;
		}, {} as Record<string, number>);
	}
	private setupEventListeners() {
		this.addEventListener(events.SORT_CHANGED, ((e: Event) => {
			const event = e as SortEvent;
			const {column, direction} = event.detail;
			this.dataController.setSorting(column, direction);
			this.eventsController.dispatchSortUpdated(column, direction);
		}) as EventListener);
		this.addEventListener(events.COLUMN_RESIZE, ((e: Event) => {
			const event = e as ResizeEvent;
			const {column, width} = event.detail;
			this.columnWidths = {...this.columnWidths, [column]: width};
		}) as EventListener);
	}

	override connectedCallback() {
		super.connectedCallback();
		this.initDefaultColumnWidths();
		this.dataController.setData(this.data);
		this.virtualScrollController.setConfig({totalItems: this.totalItems});
	}

	override updated(changedProperties: Map<string, unknown>) {
		if (changedProperties.has('data')) {
			this.dataController.setData(this.data);
		}
		if (changedProperties.has('totalItems')) {
			this.virtualScrollController.setConfig({totalItems: this.totalItems});
		}
	}

	protected override render() {
		const state = this.dataController.getState();
		const tableClasses = this.stateController.getTableClasses({
			size: this.size,
			sortable: this.sortable,
			selectable: this.selectable,
			loading: state.loading
		});

		return html`
			<div class=${classMap(tableClasses)}
				 role="table"
				 aria-label="Data table">
				${this.renderHeader()}
				${this.renderBody()}
				${state.loading ? this.renderLoading() : nothing}
			</div>
		`;
	}

	private renderHeader() {
		return html`
			<div class=${cssClasses.HEADER} role="rowgroup">
				<md-data-table-row>
					${this.selectable ? this.renderSelectAllCell() : nothing}
					${this.columns.map(this.renderHeaderCell.bind(this))}
				</md-data-table-row>
			</div>
		`;
	}

	private renderHeaderCell(column: string) {
		const state = this.dataController.getState();
		return html`
			<md-data-table-header-cell
					.sortable=${this.sortable}
					.resizable=${this.resizable}
					.sortDirection=${state.sortColumn === column ?
							state.sortDirection : null}>
				${column}
			</md-data-table-header-cell>
		`;
	}

	private renderBody() {
		return html`
			<div class=${cssClasses.BODY} role="rowgroup">
				<lit-virtualizer
						scroller
						.items=${this.dataController.getData()}
						.renderItem=${this.renderRow.bind(this)}
						@rangeChanged=${this.handleRangeChanged.bind(this)}>
				</lit-virtualizer>
			</div>
		`;
	}

	private renderRow(item: DataItem, index: number) {
		const state = this.dataController.getState();
		return html`
			<md-data-table-row .selected=${state.selectedIndices.has(index)}>
				${this.selectable ? this.renderSelectCell(index) : nothing}
				${this.columns.map(column => this.renderCell(column, item[column]))}
			</md-data-table-row>
		`;
	}

	private renderCell(column: string, value: unknown) {
		return html`
			<md-data-table-cell .width=${this.columnWidths[column]}>
				${value}
			</md-data-table-cell>
		`;
	}

	private renderSelectAllCell() {
		const state = this.dataController.getState();
		const allSelected = state.selectedIndices.size === this.data.length;
		const someSelected = state.selectedIndices.size > 0 && !allSelected;

		return html`
			<md-data-table-cell>
				<md-checkbox
						.checked=${allSelected}
						.indeterminate=${someSelected}
						@change=${this.handleSelectAll}>
				</md-checkbox>
			</md-data-table-cell>
		`;
	}

	private renderSelectCell(index: number) {
		const state = this.dataController.getState();
		return html`
			<md-data-table-cell>
				<md-checkbox
						.checked=${state.selectedIndices.has(index)}
						@change=${(e: Event) => this.handleRowSelect(e, index)}>
				</md-checkbox>
			</md-data-table-cell>
		`;
	}

	private renderLoading() {
		return html`
			<div class=${cssClasses.LOADING_OVERLAY}>
				<md-circular-progress indeterminate></md-circular-progress>
			</div>
		`;
	}

	private handleSelectAll(e: Event) {
		const checkbox = e.target as HTMLInputElement;
		this.dataController.setSelectionAll(checkbox.checked, this.data.length);
		this.eventsController.dispatchSelectionChanged(
			[...this.dataController.getState().selectedIndices]
		);
	}

	private handleRowSelect(e: Event, index: number) {
		const checkbox = e.target as HTMLInputElement;
		this.dataController.toggleSelection(index);
		this.eventsController.dispatchSelectionChanged(
			[...this.dataController.getState().selectedIndices]
		);
	}

	private handleRangeChanged(event: RangeChangedEvent) {
		const {first, last} = event;
		this.eventsController.dispatchVisibilityChanged(first, last);
		this.virtualScrollController.handleVisibilityChanged(first, last);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'md-data-table': MdDataTable;
	}
}