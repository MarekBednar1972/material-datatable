import {html, LitElement, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import './components/data-table/md-data-table';
import {DataColumn} from "./components/data-table/types";
import {dataManager} from "./data-manager";

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
		order: 1,
		path: 'userId',
		sortable: true
	}, {
		label: 'Name',
		order: 2,
		path: 'username',
		sortable: true
	}, {
		label: 'Email',
		order: 3,
		path: 'email',
		sortable: false
	}, {
		label: 'Password',
		order: 5,
		path: 'password',
		sortable: false
	}, {
		label: 'Birthdate',
		order: 6,
		path: 'birthdate',
		sortable: true
	}, {
		label: 'Registered at',
		order: 7,
		path: 'registeredAt',
		sortable: true
	}
	]

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