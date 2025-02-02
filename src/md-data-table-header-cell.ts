import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/icon/icon.js';

@customElement('md-data-table-header-cell')
export class MdDataTableHeaderCell extends LitElement {
	static styles = css`
		:host {
			display: table-cell;
			padding: 8px;
			box-sizing: border-box;
			font-weight: bold;
			cursor: pointer;
			position: relative;
		}

		md-icon-button {
			vertical-align: middle;
		}
	`;

	@property({type: String})
	column = '';

	@property({type: String})
	sortDirection: 'asc' | 'desc' | null = null;

	render() {
		return html`
            <slot></slot>
            <md-icon-button>
                ${this.sortDirection === 'asc'
			? html`<md-icon>arrow_upward</md-icon>`
			: this.sortDirection === 'desc'
				? html`<md-icon>arrow_downward</md-icon>`
				: html`<md-icon>unfold_more</md-icon>`}
            </md-icon-button>
        `;
	}
}