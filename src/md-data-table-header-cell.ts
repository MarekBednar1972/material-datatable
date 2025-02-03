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
			cursor: move;
			position: relative;
			user-select: none;
		}

		:host(.dragging) {
			opacity: 0.5;
			background: var(--md-sys-color-surface-variant);
		}

		:host(.drag-over) {
			border-left: 2px solid var(--md-sys-color-primary);
		}

		.header-content {
			display: flex;
			align-items: center;
			gap: 4px;
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
	private _isResizing: boolean = false;

	firstUpdated() {
		this.setAttribute('draggable', 'true');
	}

	private _onMouseMove = (event: MouseEvent) => {
		if (!this._isResizing) return;
		const dx = event.clientX - this._startX;
		const newWidth = this._startWidth + dx;
		this.style.width = `${newWidth}px`;
		this.dispatchEvent(new CustomEvent('column-resize', {
			detail: { column: this.column, width: newWidth },
			bubbles: true,
			composed: true
		}));
	};

	private _onMouseUp = () => {
		this._isResizing = false;
		document.removeEventListener('mousemove', this._onMouseMove);
		document.removeEventListener('mouseup', this._onMouseUp);
	};

	private _onMouseDown = (event: MouseEvent) => {
		// Only start resize if clicking the resize handle
		if ((event.target as HTMLElement).classList.contains('resize-handle')) {
			this._isResizing = true;
			this._startX = event.clientX;
			this._startWidth = this.offsetWidth;
			document.addEventListener('mousemove', this._onMouseMove);
			document.addEventListener('mouseup', this._onMouseUp);
			event.preventDefault(); // Prevent drag start
		}
	};

	private _onDragStart(event: DragEvent) {
		if (this._isResizing) {
			event.preventDefault();
			return;
		}
		this.classList.add('dragging');
		event.dataTransfer?.setData('text/plain', this.column);
	}

	private _onDragEnd() {
		this.classList.remove('dragging');
	}

	private _onDragOver(event: DragEvent) {
		event.preventDefault();
		this.classList.add('drag-over');
	}

	private _onDragLeave() {
		this.classList.remove('drag-over');
	}

	private _onDrop(event: DragEvent) {
		event.preventDefault();
		this.classList.remove('drag-over');
		const sourceColumn = event.dataTransfer?.getData('text/plain');
		if (sourceColumn && sourceColumn !== this.column) {
			this.dispatchEvent(new CustomEvent('column-reorder', {
				detail: {
					sourceColumn,
					targetColumn: this.column
				},
				bubbles: true,
				composed: true
			}));
		}
	}

	render() {
		return html`
            <div class="header-content"
                @dragstart=${this._onDragStart}
                @dragend=${this._onDragEnd}
                @dragover=${this._onDragOver}
                @dragleave=${this._onDragLeave}
                @drop=${this._onDrop}
            >
                <slot></slot>
                <md-icon-button @click=${(e: Event) => {
			e.stopPropagation();
			this.dispatchEvent(new CustomEvent('sort-column', {
				detail: { column: this.column },
				bubbles: true,
				composed: true
			}));
		}}>
                    ${this.sortDirection === 'asc'
			? html`<md-icon>arrow_upward</md-icon>`
			: this.sortDirection === 'desc'
				? html`<md-icon>arrow_downward</md-icon>`
				: html`<md-icon>unfold_more</md-icon>`}
                </md-icon-button>
            </div>
            <div class="resize-handle" @mousedown=${this._onMouseDown}></div>
        `;
	}
}