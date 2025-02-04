/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

// Styles
import {styles} from './lib/data-table-row-styles.css.js';
import {UiStateController} from './internal/ui-state-controller';
import {cssClasses} from './constants.js';

/**
 * @summary A row component for the data table that displays a single row of data.
 *
 * @description
 * The row component is used internally by the data table to render each row of data.
 * It handles selection state and hover interactions.
 *
 * @example
 * ```html
 * <md-data-table-row>
 *   <md-data-table-cell>Cell 1</md-data-table-cell>
 *   <md-data-table-cell>Cell 2</md-data-table-cell>
 * </md-data-table-row>
 * ```
 */
@customElement('md-data-table-row')
export class MdDataTableRow extends LitElement {
	static override styles = [styles];

	/**
	 * Whether the row is currently selected.
	 */
	@property({type: Boolean, reflect: true})
	selected = false;

	/**
	 * Whether the row shows hover effects.
	 */
	@property({type: Boolean, reflect: true})
	hoverable = false;

	/**
	 * Whether the row is interactive (can be clicked).
	 */
	@property({type: Boolean, reflect: true})
	interactive = false;

	/**
	 * Whether this is a header row.
	 */
	@property({type: Boolean, reflect: true})
	header = false;

	private readonly stateController = new UiStateController(this);

	override click() {
		if (this.interactive) {
			this.dispatchEvent(new CustomEvent('row-click', {
				bubbles: true,
				composed: true,
				detail: { selected: this.selected }
			}));
		}
	}

	protected override render() {
		const rowClasses = this.stateController.getRowClasses({
			selected: this.selected,
			hoverable: this.hoverable
		});

		return html`
            <div class=${classMap(rowClasses)}
                 role=${this.header ? 'row header' : 'row'}
                 aria-selected=${this.selected}
                 tabindex=${this.interactive ? '0' : '-1'}>
                <slot></slot>
            </div>
        `;
	}

	/**
	 * Focuses the row if it's interactive.
	 */
	focus() {
		if (this.interactive) {
			(this.shadowRoot?.querySelector(`.${cssClasses.ROW}`) as HTMLElement)?.focus();
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'md-data-table-row': MdDataTableRow;
	}
}