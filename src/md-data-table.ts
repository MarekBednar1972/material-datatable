import {css, html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {VisibilityChangedEvent} from '@lit-labs/virtualizer';
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

	private _lastVisibleIndex: number = 0;

	firstUpdated() {
		generateDataItems(1000);
		this._loadMoreData(0, 50, this._sortColumn, this._sortDirection, true);
	}

	async _loadMoreData(startIndex: number, count: number, sortColumn: string | null, sortDirection: 'asc' | 'desc' | null, initialLoad = false) {
		if (this._isFetchingData) {
			return;
		}

		this._isFetchingData = true;

		const newData = await loadMoreData(startIndex, count, sortColumn, sortDirection);

		if (initialLoad) {
			this.data = [...newData];
		} else if (startIndex === 0) {
			this.data = [...newData, ...this.data];
		} else {
			// Append data if loading at the end
			this.data = [...this.data, ...newData];
		}

		this._isFetchingData = false;
	}

	private _handleVisibilityChanged(event: VisibilityChangedEvent) {
		this._lastVisibleIndex = event.last;
		const threshold = 10;

		if (
			this._lastVisibleIndex + threshold >= this.data.length &&
			!this._isFetchingData
		) {
			this._loadMoreData(
				this.data.length,
				20,
				this._sortColumn,
				this._sortDirection
			);
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

	private _handleResize(event: CustomEvent) {
		const { column, width } = event.detail;
		const columnIndex = this.columns.indexOf(column);

		if (columnIndex !== -1) {
			(this.shadowRoot!.querySelectorAll('.header-row md-data-table-header-cell')[columnIndex] as HTMLElement).style.width = `${width}px`;
			this.shadowRoot!.querySelectorAll('.table md-data-table-cell').forEach((cell, index) => {
				if (index % this.columns.length === columnIndex) {
					(cell as HTMLElement).style.width = `${width}px`;
					(cell as any).width = `${width}px`; // P1e14
				}
			});
		}
	}

	render() {
		return html`
			<div class="container">
				<div class="table">
					<div class="header-row" slot="header-row">
						${this.columns.map((column, index) => html`
							<md-data-table-header-cell
									@click=${() => this._handleSort(column)}
									@column-resize=${this._handleResize}
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
									${this.columns.map(column => html`
										<md-data-table-cell>${item[column]}</md-data-table-cell>`)}
								</md-data-table-row>
							`}
							@visibilityChanged=${this._handleVisibilityChanged}
					></lit-virtualizer>
				</div>
			</div>
			${this._isFetchingData
					? html`
						<div class="loading-indicator">Loading...</div>`
					: ''}
		`;
	}
}
