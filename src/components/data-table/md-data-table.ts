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
import {DataTableStateController, EventsController, UiStateController, VirtualScrollController} from './internal/index.js';

// Styles
import {styles} from './lib/data-table-styles.css.js';

// Types and Constants
import {
	DataItem,
	DataTableSize,
	ResizeEvent,
	SortDirection,
	SortEvent,
	ColumnReorderEvent,
	DataColumn
} from './types.js';
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

	/**
	 * Whether columns can be reordered by drag and drop.
	 */
	@property({type: Boolean})
	reorderable = true;

	/**
	 * Whether columns can be resized.
	 */
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
	columns: DataColumn[] = [];

	/**
	 * The data to display in the table.
	 */
	@state()
	data: DataItem[] = [];

	/**
	 * Total number of items (for virtual scrolling).
	 */
	@property({type: Number})
	totalItems = 0;

	@property({type: Function})
	dataProvider: (startIndex: number, pageSize: number, sortColumn: DataColumn, sortDirection: SortDirection) => Promise<DataItem[]> = async () => [];

	@state()
	private columnWidths: Record<string, number> = {};

	@state()
	private columnOrder: DataColumn[] = [];

	// Controllers
	private readonly dataController = new DataTableStateController(this);
	private virtualScrollController: VirtualScrollController = null as unknown as VirtualScrollController;
	private readonly eventsController = new EventsController(this);
	private readonly stateController = new UiStateController(this);

	constructor() {
		super();
		this.setupEventListeners();
	}

	private initDefaultColumnWidths() {
		this.columnWidths = this.columns.reduce((acc, column) => {
			acc[column.id] = 100;
			return acc;
		}, {} as Record<string, number>);
	}

	private initColumnOrder() {
		this.columnOrder = this.columns.map(column => column);
	}

	private setupEventListeners() {
		this.addEventListener(events.SORT_CHANGED, ((e: Event) => {
			const event = e as SortEvent;
			const {column, direction} = event.detail;
			this.virtualScrollController.setSorting(column, direction);
			this.dataController.setState({sortColumn: column, sortDirection: direction});
			this.virtualScrollController.reset();
		}) as EventListener);

		this.addEventListener(events.COLUMN_RESIZE, ((e: Event) => {
			const event = e as ResizeEvent;
			const {column, width} = event.detail;
			console.log('resize event', column, width);
			this.columnWidths[column.id] = width;
			this.columnWidths = structuredClone(this.columnWidths);

		}) as EventListener);

		this.addEventListener('column-reorder', ((e: Event) => {
			const event = e as ColumnReorderEvent;
			const {sourceColumnId, targetColumnId} = event.detail;
			this.handleColumnReorder(sourceColumnId, targetColumnId);
		}) as EventListener);
	}

	private handleColumnReorder(sourceColumnId: string, targetColumnId: string) {
		const srcCol = this.columnOrder.find((c => c.id === sourceColumnId));
		const sourceIndex = this.columnOrder.map(c => c.id).indexOf(sourceColumnId);
		const targetIndex = this.columnOrder.map(c => c.id).indexOf(targetColumnId);

		if (sourceIndex === -1 || targetIndex === -1) return;

		const newOrder = [...this.columnOrder];
		newOrder.splice(sourceIndex, 1);
		newOrder.splice(targetIndex, 0, srcCol as DataColumn);

		this.columnOrder = newOrder;
		this.requestUpdate();
	}

	override connectedCallback() {
		super.connectedCallback();
		this.virtualScrollController = new VirtualScrollController(this, this.dataProvider);
		this.initDefaultColumnWidths();
		this.initColumnOrder();
		this.virtualScrollController.setConfig({totalItems: this.totalItems});
	}

	override updated(changedProperties: Map<string, unknown>) {
		if (changedProperties.has('totalItems')) {
			this.virtualScrollController.setConfig({totalItems: this.totalItems});
		}
		if (changedProperties.has('columns') && !changedProperties.has('columnOrder')) {
			this.initColumnOrder();
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
                    ${this.columnOrder.map(this.renderHeaderCell.bind(this))}
                </md-data-table-row>
            </div>
        `;
	}

	private renderHeaderCell(column: DataColumn) {
		const state = this.dataController.getState();
		return html`
            <md-data-table-header-cell
					.column=${column}
					.sortable=${this.sortable}
                    .resizable=${this.resizable}
                    .draggable=${this.reorderable}
                    .sortDirection=${state.sortColumn?.id === column.id ?
			state.sortDirection : null}
                    .width=${this.columnWidths[column.id] + 'px'}>
                ${column.label}
            </md-data-table-header-cell>
        `;
	}

	private renderBody() {
		return html`
            <div class=${cssClasses.BODY} role="rowgroup">
                <lit-virtualizer
                        scroller
                        .items=${this.virtualScrollController.getData()}
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
                ${this.columnOrder.map(column => this.renderCell(column, item[column.id]))}
            </md-data-table-row>
        `;
	}

	private renderCell(column: DataColumn, value: unknown) {
		return html`
            <md-data-table-cell .width=${this.columnWidths[column.id]}>
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