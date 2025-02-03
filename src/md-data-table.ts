// md-data-table.ts
import {html, LitElement, nothing} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { VisibilityChangedEvent } from '@lit-labs/virtualizer';
import '@lit-labs/virtualizer';

import './md-data-table-row';
import './md-data-table-cell';
import './md-data-table-header-cell';
import { dataManager } from './data-helpers';
import { tableStyles } from './table-styles';
import {
	DataItem,
	SortDirection,
	ColumnReorderEvent,
	ColumnResizeEvent,
	SortColumnEvent
} from './types';

const INITIAL_PAGE_SIZE = 50;
const LOAD_MORE_THRESHOLD = 10;
const LOAD_MORE_COUNT = 20;

@customElement('md-data-table')
export class MdDataTable extends LitElement {
	static styles = tableStyles;

	// Public properties
	@property({ type: Array }) data: DataItem[] = [];
	@property({ type: Array }) columns: string[] = [];

	// Private state
	@state() private _visibleColumns: string[] = [];
	@state() private _isFetchingData = false;
	@state() private _sortColumn: string | null = null;
	@state() private _sortDirection: SortDirection = null;
	@state() private _totalItems: number = 0;
	@state() private _placeholderItems: null[] = [];

	private _lastVisibleIndex: number = 0;

	constructor() {
		super();
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		this.addEventListener('sort-column', ((e: SortColumnEvent) => {
			this.handleSort(e.detail.column);
		}) as EventListener);
	}

	firstUpdated(): void {
		this.initializeTable();
	}

	private async initializeTable(): Promise<void> {
		this._visibleColumns = [...this.columns];
		dataManager.generateItems(1000);
		this._totalItems = dataManager.getTotalItems();
		this._placeholderItems = new Array(this._totalItems).fill(null);
		await this.loadMoreData(0, INITIAL_PAGE_SIZE, true);
	}

	private async loadMoreData(
		startIndex: number,
		count: number,
		initialLoad = false
	): Promise<void> {
		if (this._isFetchingData) return;

		this._isFetchingData = true;

		try {
			const newData = await dataManager.loadData(
				startIndex,
				count,
				this._sortColumn,
				this._sortDirection
			);

			this.updateData(newData, startIndex, initialLoad);
		} finally {
			this._isFetchingData = false;
		}
	}

	private updateData(newData: DataItem[], startIndex: number, initialLoad: boolean): void {
		if (initialLoad) {
			this.data = newData;
		} else if (startIndex === 0) {
			this.data = [...newData, ...this.data];
		} else {
			this.data = [...this.data, ...newData];
		}
	}

	private handleVisibilityChanged(event: VisibilityChangedEvent): void {
		this._lastVisibleIndex = event.last;

		if (this.shouldLoadMore()) {
			this.loadMoreData(this.data.length, LOAD_MORE_COUNT);
		}
	}

	private shouldLoadMore(): boolean {
		return (
			this._lastVisibleIndex + LOAD_MORE_THRESHOLD >= this.data.length &&
			!this._isFetchingData
		);
	}

	private handleSort(column: string): void {
		this._sortDirection = this.getNextSortDirection(column);
		this._sortColumn = this._sortDirection ? column : null;

		this.data = [];
		this.loadMoreData(0, INITIAL_PAGE_SIZE);
	}

	private getNextSortDirection(column: string): SortDirection {
		if (this._sortColumn !== column) return 'asc';

		const directions: SortDirection[] = ['asc', 'desc', null];
		const currentIndex = directions.indexOf(this._sortDirection);
		return directions[(currentIndex + 1) % directions.length];
	}

	private handleResize(event: ColumnResizeEvent): void {
		const { column, width } = event.detail;
		const columnIndex = this._visibleColumns.indexOf(column);

		if (columnIndex === -1) return;

		this.updateColumnWidths(columnIndex, width);
	}

	private updateColumnWidths(columnIndex: number, width: number): void {
		const widthPx = `${width}px`;
		const headerCell = this.getHeaderCell(columnIndex);
		if (headerCell) headerCell.style.width = widthPx;

		this.getDataCells(columnIndex).forEach(cell => {
			cell.style.width = widthPx;
			(cell as any).width = widthPx;
		});
	}

	private getHeaderCell(index: number): HTMLElement | null {
		return this.shadowRoot?.querySelector(
			`.header-row md-data-table-header-cell:nth-child(${index + 1})`
		) as HTMLElement;
	}

	private getDataCells(columnIndex: number): HTMLElement[] {
		return Array.from(this.shadowRoot?.querySelectorAll('.table md-data-table-cell') || [])
			.filter((_, index) => index % this._visibleColumns.length === columnIndex) as HTMLElement[];
	}

	private handleColumnReorder(event: ColumnReorderEvent): void {
		const { sourceColumn, targetColumn } = event.detail;
		const sourceIndex = this._visibleColumns.indexOf(sourceColumn);
		const targetIndex = this._visibleColumns.indexOf(targetColumn);

		if (sourceIndex === -1 || targetIndex === -1) return;

		const newColumns = [...this._visibleColumns];
		newColumns.splice(sourceIndex, 1);
		newColumns.splice(targetIndex, 0, sourceColumn);
		this._visibleColumns = newColumns;

		this.dispatchEvent(new CustomEvent('columns-reordered', {
			detail: { columns: this._visibleColumns },
			bubbles: true,
			composed: true
		}));
	}

	private renderHeaderRow() {
		return html`
            <div class="header-row" 
                 slot="header-row" 
                 @column-reorder=${this.handleColumnReorder}>
                ${this._visibleColumns.map(column => html`
                    <md-data-table-header-cell
                        .column=${column}
                        .sortDirection=${this._sortColumn === column ? this._sortDirection : null}
                        @column-resize=${this.handleResize}
                    >
                        ${column}
                    </md-data-table-header-cell>
                `)}
            </div>
        `;
	}

	private renderRow(item: null, index: number) {
		const dataItem = this.data.find(d => d.id === index);
		return dataItem
			? this.renderDataRow(dataItem)
			: this.renderPlaceholderRow();
	}

	private renderDataRow(dataItem: DataItem) {
		return html`
            <md-data-table-row>
                ${this._visibleColumns.map(column => html`
                    <md-data-table-cell>
                        ${dataItem[column]}
                    </md-data-table-cell>
                `)}
            </md-data-table-row>
        `;
	}

	private renderPlaceholderRow() {
		return html`
            <md-data-table-row>
                ${this._visibleColumns.map(() => html`
                    <md-data-table-cell class="placeholder-cell">
                        Loading...
                    </md-data-table-cell>
                `)}
            </md-data-table-row>
        `;
	}

	render() {
		return html`
            <div class="container">
                <div class="table">
                    ${this.renderHeaderRow()}
                    <lit-virtualizer
                        scroller
                        .items=${this._placeholderItems}
                        .renderItem=${this.renderRow.bind(this)}
                        @visibilityChanged=${this.handleVisibilityChanged}
                    ></lit-virtualizer>
                </div>
                ${this._isFetchingData
			? html`<div class="loading-indicator">Loading...</div>`
			: nothing}
            </div>
        `;
	}
}