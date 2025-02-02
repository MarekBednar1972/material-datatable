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
			margin-left: 4px;
		}

		.resize-handle {
			position: absolute;
			right: 0;
			top: 0;
			width: 5px;
			height: 100%;
			cursor: col-resize;
			user-select: none;
		}
	`;

	@property({type: String})
	column = '';

	@property({type: String})
	sortDirection: 'asc' | 'desc' | null = null;

	private _startX: number = 0;
	private _startWidth: number = 0;

	private _onMouseMove = (event: MouseEvent) => {
		const dx = event.clientX - this._startX;
		this.style.width = `${this._startWidth + dx}px`;
	};

	private _onMouseUp = () => {
		document.removeEventListener('mousemove', this._onMouseMove);
		document.removeEventListener('mouseup', this._onMouseUp);
	};

	private _onMouseDown = (event: MouseEvent) => {
		this._startX = event.clientX;
		this._startWidth = this.offsetWidth;
		document.addEventListener('mousemove', this._onMouseMove);
		document.addEventListener('mouseup', this._onMouseUp);
	};

	render() {
		return html`
			<slot></slot>
			<md-icon-button>
				${this.sortDirection === 'asc'
						? html`
							<md-icon>arrow_upward</md-icon>`
						: this.sortDirection === 'desc'
								? html`
									<md-icon>arrow_downward</md-icon>`
								: html`
									<md-icon>unfold_more</md-icon>`}
			</md-icon-button>
			<div class="resize-handle" @mousedown=${this._onMouseDown}></div>
		`;
	}
}
