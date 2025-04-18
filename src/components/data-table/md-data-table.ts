/**
 * @license MIT
 * Copyright 2024 Digital Works
 */
import {css, html, LitElement, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

// Material Web imports
import '@material/web/checkbox/checkbox.js';
import '@material/web/progress/circular-progress.js';
import '@lit-labs/virtualizer';
import {createRef, Ref, ref} from 'lit/directives/ref.js';

// Internal Controllers
import {
	DataTableStateController,
	EventsController,
	UiStateController,
	VirtualScrollController
} from './internal/index.js';

// Styles
import {tableStyles} from './lib/data-table-styles.css.js';

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
import {LitVirtualizer, RangeChangedEvent} from "@lit-labs/virtualizer";

@customElement('md-data-table')
export class MdDataTable extends LitElement {
	virtRef: Ref<LitVirtualizer> = createRef();

	static override styles = [css`
		:host {
			width: 100%;
		}
	`, tableStyles];

	@property({type: String})
	size: DataTableSize = strings.DEFAULT_SIZE;

	@property({type: Boolean})
	sortable = true;

	@property({type: Boolean})
	reorderable = true;

	@property({type: Boolean})
	resizable = true;

	@property({type: Boolean})
	selectable = true;

	@property({type: Array})
	columns: DataColumn[] = [];

	@property({type: Number})
	totalItems = 0;

	@property({type: Function})
	dataProvider: (
		startIndex: number,
		pageSize: number,
		sortColumn: DataColumn,
		sortDirection: SortDirection
	) => Promise<DataItem[]> = async () => [];

	@state()
	private columnWidths: Record<string, number> = {};

	@state()
	private columnOrder: DataColumn[] = [];

	private _prevDataLength = 0;

	private readonly dataController = new DataTableStateController(this);
	private virtualScrollController: VirtualScrollController = null as unknown as VirtualScrollController;
	private readonly eventsController = new EventsController(this);
	private readonly stateController = new UiStateController(this);

	constructor() {
		super();
		this.setupEventListeners();
	}

	private initDefaultColumnWidths() {
	// Use a canvas to measure text width
	function measureTextWidth(text: string, font: string = '16px Roboto'): number {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d')!;
		context.font = font;
		return context.measureText(text).width;
	}

	const sampleRows = this.virtualScrollController?.getData()?.slice(0, 20) ?? [];
	const font = '16px Roboto'; // Match your table cell font

	this.columnWidths = this.columns.reduce((acc, column) => {
		// Measure header label
		let maxWidth = measureTextWidth(column.label, font);

		// Measure each cell in sample rows
		for (const row of sampleRows) {
			const value = String(row[column.path] ?? '');
			const width = measureTextWidth(value, font);
			if (width > maxWidth) maxWidth = width;
		}

		// Add some padding (e.g., 32px)
		acc[column.path] = Math.ceil(maxWidth) + 32;
		return acc;
	}, {} as Record<string, number>);
}

	private initColumnOrder() {
		this.columnOrder = [...this.columns];
	}

	private setupEventListeners() {
		this.addEventListener(events.SORT_CHANGED, ((e: Event) => {
			const event = e as SortEvent;
			const {column, direction} = event.detail;
			this.virtualScrollController.setSorting(column, direction);
			this.dataController.setState({
				sortColumn: column,
				sortDirection: direction
			});
			this.virtualScrollController.reset();
		}) as EventListener);

		this.addEventListener(events.COLUMN_RESIZE, ((e: Event) => {
			const event = e as ResizeEvent;
			const {column, width} = event.detail;
			this.columnWidths[column.path] = width;
			this.columnWidths = {...this.columnWidths};
		}) as EventListener);

		this.addEventListener(events.COLUMN_REORDER, ((e: Event) => {
			const event = e as ColumnReorderEvent;
			const {sourceColumnId, targetColumnId} = event.detail;
			this.handleColumnReorder(sourceColumnId, targetColumnId);
		}) as EventListener);
	}

	private handleColumnReorder(sourceColumnId: string, targetColumnId: string) {
		const srcCol = this.columnOrder.find(c => c.path === sourceColumnId);
		const sourceIndex = this.columnOrder.findIndex(c => c.path === sourceColumnId);
		const targetIndex = this.columnOrder.findIndex(c => c.path === targetColumnId);

		if (sourceIndex === -1 || targetIndex === -1) return;

		const newOrder = [...this.columnOrder];
		newOrder.splice(sourceIndex, 1);
		newOrder.splice(targetIndex, 0, srcCol as DataColumn);

		this.columnOrder = newOrder;
		this.requestUpdate();
	}

	override connectedCallback() {
		super.connectedCallback();
		this.virtualScrollController = new VirtualScrollController(
			this,
			this.dataProvider
		);
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
		// Recalculate column widths when data first arrives
		const data = this.virtualScrollController.getData();
		if (this._prevDataLength === 0 && data.length > 0) {
			this.initDefaultColumnWidths();
		}
		this._prevDataLength = data.length;
	}

	doCalculateVirtualscrollHeight() {
		const hdrHeight = this.shadowRoot?.querySelector('.md-data-table__header');
		if (this.virtRef.value && hdrHeight) {
			const height = this.clientHeight - hdrHeight.clientHeight
			this.virtRef.value.style.height = height + 'px';
		}
	}

	override firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
		super.firstUpdated(changedProperties);
		this.doCalculateVirtualscrollHeight();
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
					.sortDirection=${state.sortColumn?.path === column.path ?
							state.sortDirection : null}
					.width=${this.columnWidths[column.path]}>
				${column.label}
			</md-data-table-header-cell>
		`;
	}

	private renderBody() {
		return html`
			<div class=${cssClasses.BODY} role="rowgroup">
				<lit-virtualizer
						${ref(this.virtRef)}
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
			<md-data-table-row
					.selected=${state.selectedIndices.has(index)}
					.hoverable=${true}
					.interactive=${this.selectable}>
				${this.selectable ? this.renderSelectCell(index) : nothing}
				${this.columnOrder.map(column => this.renderCell(column, item[column.path]))}
			</md-data-table-row>
		`;
	}

	private renderCell(column: DataColumn, value: unknown) {
		return html`
			<md-data-table-cell
					.width=${this.columnWidths[column.path]}
					.numeric=${column.numeric}>
				${value}
			</md-data-table-cell>
		`;
	}

	private renderSelectAllCell() {
		const state = this.dataController.getState();
		const allSelected = state.selectedIndices.size === this.totalItems;
		const someSelected = state.selectedIndices.size > 0 && !allSelected;

		return html`
			<md-data-table-header-cell>
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
		this.dataController.setSelectionAll(checkbox.checked, this.totalItems);
		this.eventsController.dispatchSelectionChanged(
			[...this.dataController.getState().selectedIndices]
		);
	}

	private handleRowSelect(e: Event, index: number) {
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