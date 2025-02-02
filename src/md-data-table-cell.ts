import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('md-data-table-cell')
export class MdDataTableCell extends LitElement {
	static styles = css`
		:host {
			display: table-cell;
			padding: 8px;
			box-sizing: border-box;
		}
	`;

	@property({type: String})
	width: string = '';

	render() {
		return html`
            <div style="width: ${this.width};">
                <slot></slot>
            </div>
        `;
	}
}
