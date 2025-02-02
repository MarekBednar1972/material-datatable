import {LitElement, html, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {LitVirtualizer, VisibilityChangedEvent} from '@lit-labs/virtualizer';
import '@lit-labs/virtualizer';

import './md-data-table-row';
import './md-data-table-cell';
import './md-data-table-header-cell';
import {generateDataItems, loadMoreData} from './data-helpers';

export interface DataItem {
	id: number;
	name: string;
	value: number;
	[key: string]: any;
}

@customElement('md-data-table')
export class MdDataTable extends LitElement {
	static styles = css`
		:host {
			display: block;
		}
		.container {
			height: 400px;
			position: relative;
			overflow: hidden;
		}
		.table {
			width: 100%;
			border-spacing: 0;
			border-collapse: collapse;
		}
		.header-row {
			display: table-header-group;
		}
		.loading-indicator {
			text-align: center;
			padding: 10px;
		}
		lit-virtualizer {
			display: block;
			height: 100%;
		}
	`;

	@property({type: Array})
	data: DataItem[] = [];

	@property({type: Array})
	columns: string[] = [];

	@state()
	private _isFetchingData = false;

	@state()
	private _sortColumn: string | null = null;

	@state()
	private _sortDirection: 'asc' | 'desc' | null = null;

	private _virtualizer?: LitVirtualizer<DataItem>;

	private _firstVisibleIndex: number = 0;
	private _lastVisibleIndex: number = 0;

	private _allData: DataItem[] = []; // Array to hold all 1000 items

	firstUpdated() {
		this._virtualizer = this.renderRoot.querySelector(
			'lit-virtualizer'
		) as LitVirtualizer<DataItem>;
		this._allData = generateDataItems(1000);
		this._loadMoreData(0, 50, this._sortColumn, this._sortDirection);
	}

	async _loadMoreData(startIndex: number, count: number, sortColumn: string | null, sortDirection: 'asc' | 'desc' | null) {
		if (this._isFetchingData) {
			return;
		}

		this._isFetchingData = true;

		const newData = await loadMoreData(startIndex, count, sortColumn, sortDirection);

		// 3. Update the data array based on the scroll direction.
		if (startIndex === 0) {
			// Prepend data if loading at the beginning
			this.data = [...newData, ...this.data];
		} else {
			// Append data if loading at the end
			this.data = [...this.data, ...newData];
		}

		this._isFetchingData = false;
	}

	private _handleVisibilityChanged(event: VisibilityChangedEvent) {
		this._firstVisibleIndex = event.first;
		this._lastVisibleIndex = event.last;

		const threshold = 10;
		if (this._lastVisibleIndex + threshold >= this.data.length && !this._isFetchingData) {
			this._loadMoreData(this.data.length, 20, this._sortColumn, this._sortDirection);
		}
		if (this._firstVisibleIndex < threshold && this.data.length > 0 && !this._isFetchingData) {
			const newStartIndex = Math.max(0, this.data[0].id - 20);
			this._loadMoreData(newStartIndex, 20, this._sortColumn, this._sortDirection);
		}
	}

	private _handleSort(column: string) {
		let sortDirection: 'asc' | 'desc' | null = 'asc';
		if (this._sortColumn === column) {
			// Toggle sort direction
			sortDirection =
				this._sortDirection === 'asc' ? 'desc' :
					this._sortDirection === 'desc' ? null : 'asc';
		} else {
			// Sort by the new column
			sortDirection = 'asc';
		}

		this._sortColumn = column;
		this._sortDirection = sortDirection;

		// Clear the existing data and fetch from the beginning with sorting
		this.data = [];
		this._loadMoreData(0, 50, this._sortColumn, this._sortDirection);
	}

	render() {
		return html`
      <div class="container">
        <div class="table">
          <div class="header-row" slot="header-row">
            ${this.columns.map((column) => html`
              <md-data-table-header-cell
                @click=${() => this._handleSort(column)}
                .sortDirection=${this._sortColumn === column ? this._sortDirection : null}
              >
                ${column}
              </md-data-table-header-cell>
            `)}
          </div>
          <lit-virtualizer
            scroller
            .items=${this.data}
            .renderItem=${(item: DataItem) => html`
              <md-data-table-row>
                ${this.columns.map(column => html`<md-data-table-cell>${item[column]}</md-data-table-cell>`)}
              </md-data-table-row>
            `}
            @visibilityChanged=${this._handleVisibilityChanged}
          ></lit-virtualizer>
        </div>
      </div>
      ${this._isFetchingData
			? html`<div class="loading-indicator">Loading...</div>`
			: ''}
    `;
	}
}