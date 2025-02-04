/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {html, LitElement, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

// Controllers
import {UiStateController} from './internal/ui-state-controller';

// Styles
import {styles} from './lib/data-table-cell-styles.css.js';

/**
 * @summary A cell component for the data table that displays a single cell of data.
 *
 * @description
 * The cell component is used internally by the data table to render each cell of data.
 * It handles alignment, overflow, and numeric formatting.
 *
 * @example
 * ```html
 * <md-data-table-cell>Content</md-data-table-cell>
 * <md-data-table-cell numeric>123.45</md-data-table-cell>
 * ```
 */
@customElement('md-data-table-cell')
export class MdDataTableCell extends LitElement {
	static override styles = [styles];

	/**
	 * Width of the cell. Can be any valid CSS width value.
	 */
	@property({type: String})
	width?: string;

	/**
	 * Whether the cell contains numeric data (right-aligned).
	 */
	@property({type: Boolean, reflect: true})
	numeric = false;

	/**
	 * Whether the cell content should wrap.
	 */
	@property({type: Boolean, reflect: true})
	wrap = false;

	/**
	 * Optional tooltip for the cell content.
	 */
	@property({type: String})
	tooltip = '';

	private readonly stateController = new UiStateController(this);

	constructor() {
		super();
		this.addEventListener('mouseover', this.handleMouseOver);
	}

	private handleMouseOver() {
		// Only show tooltip if content is truncated
		const content = this.shadowRoot?.querySelector('.md-data-table__cell');
		if (content && content.scrollWidth > content.clientWidth) {
			this.title = this.tooltip || this.textContent || '';
		} else {
			this.title = '';
		}
	}

	protected updated(_changedProperties: PropertyValues) {
		super.updated(_changedProperties);
		if (_changedProperties.has('width')) {
			this.setContentWidth(this.width ? parseInt(this.width) : 0);
		}
	}

	protected override render() {
		const cellClasses = this.stateController.getCellClasses({
			numeric: this.numeric
		});

		const styles = {
			width: this.width || 'auto',
			whiteSpace: this.wrap ? 'normal' : 'nowrap'
		};

		return html`
			<div class=${classMap(cellClasses)}
				 style=${styleMap(styles)}
				 role="cell">
				<slot></slot>
			</div>
		`;
	}

	/**
	 * Gets the current content width of the cell.
	 */
	getContentWidth(): number {
		const content = this.shadowRoot?.querySelector('.md-data-table__cell');
		return content?.scrollWidth || 0;
	}

	setContentWidth(width: number) {
		(this.shadowRoot?.querySelector('.md-data-table__cell') as HTMLElement).style.width = `${width}px`;
	}

	/**
	 * Sets focus to the cell.
	 */
	focus() {
		(this.shadowRoot?.querySelector('.md-data-table__cell') as HTMLElement)?.focus();
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'md-data-table-cell': MdDataTableCell;
	}
}