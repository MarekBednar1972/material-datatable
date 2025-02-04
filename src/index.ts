import { html, LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './components/data-table/md-data-table';
import {dataManager} from "./components/data-table/data-helpers";

@customElement('my-app')
export class MyApp extends LitElement {

	static styles = css`
		:host {
			display: block;
			padding: 20px;
			height: 500px;
		}
	`;
	private manager = dataManager;

	connectedCallback() {
		this.manager.generateItems(1000);
		super.connectedCallback();
	}

	render() {
		return html`
        <h1>MD Data Table</h1>
        <md-data-table .columns=${["id", "name", "value"]} .totalItems=${dataManager.getTotalItems()} .dataProvider="${this.manager.loadData}"></md-data-table>
    `;
	}
}