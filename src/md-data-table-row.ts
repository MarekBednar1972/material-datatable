import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('md-data-table-row')
export class MdDataTableRow extends LitElement {
	static styles = css`
		:host {
			display: table-row;
			width: 100%;
			box-sizing: border-box;
		}
	`;

	render() {
		return html`
            <slot></slot>
        `;
	}
}