import {html, LitElement, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import './components/data-table/md-data-table';
import {DataColumn} from "./components/data-table/types";
import {dataManager} from "./components/data-table/data-manager";

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
	private columns: DataColumn[] = [{
		label: 'ID',
		id: 'id',
		order: 1
	}, {
		label: 'Name',
		id: 'name',
		order: 2
	}, {
		label: 'Value',
		id: 'value',
		order: 3
	}]

	connectedCallback() {
		this.manager.generateItems(1000);
		super.connectedCallback();
	}

	render() {
		return html`
			<h1>MD Data Table</h1>
			<md-data-table .columns=${this.columns} .totalItems=${this.manager.getTotalItems()}
						   .dataProvider="${this.manager.loadData}"></md-data-table>
		`;
	}
}