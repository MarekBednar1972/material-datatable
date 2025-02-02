import { html, LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './md-data-table';

@customElement('my-app')
export class MyApp extends LitElement {

	static styles = css`
		:host {
			display: block;
			padding: 20px;
		}
	`
	myInitialData = Array.from({ length: 100 }, (_, index) => ({
		id: index,
		name: `Item ${index}`,
		value: Math.random() * 100
	}));
	render() {
		return html`
        <h1>MD Data Table</h1>
        <md-data-table .columns=${["id", "name", "value"]} .data=${this.myInitialData}></md-data-table>
    `;
	}
}