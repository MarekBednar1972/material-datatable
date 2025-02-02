import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LitVirtualizer, VisibilityChangedEvent } from '@lit-labs/virtualizer';
import '@lit-labs/virtualizer';

interface DataItem {
	id: number;
	name: string;
	value: number;
	[key: string]: any;  // Add index signature
}

@customElement('md-data-table')
export class MdDataTable extends LitElement {
	static styles = css`
		:host {
			display: block;
			height: 400px; /* Set an explicit height for the virtualizer */
		}

		lit-virtualizer {
			height: 100%; /* Make the virtualizer fill the container */
			width: 100%;
		}

		.item {
			display: flex;
			align-items: center;
			width: 100%;
			height: 40px; /* All items have the same height */
			box-sizing: border-box;
			border-bottom: 1px solid #ccc;
		}

		.cell {
			padding: 8px;
		}

		.loading-indicator {
			text-align: center;
			padding: 10px;
		}
	`;

	@property({ type: Array })
	data: DataItem[] = [];

	@property({ type: Array })
	columns: string[] = [];

	@state()
	private _isFetchingData = false;

	private _virtualizer?: LitVirtualizer<DataItem>;

	firstUpdated() {
		this._virtualizer = this.renderRoot.querySelector('lit-virtualizer') as LitVirtualizer<DataItem>;
		this.data = this._generateDataItems(50);
	}

	private _generateDataItems(count: number): DataItem[] {
		return Array.from({ length: count }, (_, index) => ({
			id: index,
			name: `Item ${index}`,
			value: Math.random() * 100
		}));
	}

	async loadMoreData() {
		if (this._isFetchingData) {
			return;
		}

		this._isFetchingData = true;

		// Simulate fetching data from an API
		await new Promise((resolve) => setTimeout(resolve, 500));

		const newData = Array.from({ length: 20 }, (_, index) => ({
			id: this.data.length + index,
			name: `Item ${this.data.length + index}`,
			value: Math.random() * 100
		}));

		this.data = [...this.data, ...newData];
		this._isFetchingData = false;
	}

	private _handleVisibilityChanged(event: VisibilityChangedEvent) {
		const { last } = event;
		if (last === this.data.length - 1 && !this._isFetchingData) {
			this.loadMoreData();
		}
	}

	render() {
		return html`
            <div class="container">
                <lit-virtualizer
                    scroller
                    .items=${this.data}
                    .renderItem=${(item: DataItem) => html`
                        <div class="item">
                            ${this.columns.map((column) => html`<span class="cell">${item[column]}</span>`)}
                        </div>
                    `}
                    @visibilityChanged=${this._handleVisibilityChanged}
                ></lit-virtualizer>
                ${this._isFetchingData ? html`<div class="loading-indicator">Loading...</div>` : ''}
            </div>
        `;
	}
}