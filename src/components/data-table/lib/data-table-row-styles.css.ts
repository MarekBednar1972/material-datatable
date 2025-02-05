/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {css} from 'lit';
import {tokens} from './shared-styles.js';

export const rowStyles = css`
	${tokens}
	:host {
		display: table-row;
		vertical-align: inherit;
		outline: none;
	}

	.md-data-table__row {
		display: flex;
		border-bottom: 1px solid var(--_outline-variant);
		background: var(--_surface-color);
		transition: background-color var(--_motion-duration-short) var(--_motion-easing-normal);
		min-height: var(--_data-row-height);
	}

	.md-data-table__row--hoverable:hover {
		background: var(--_hover-color);
	}

	.md-data-table__row--selected {
		background: var(--_selected-color);
	}

	:host(:last-child) .md-data-table__row {
		border-bottom: none;
	}

	:host(:focus-visible) .md-data-table__row {
		outline: 2px solid var(--_focus-outline-color);
		outline-offset: -2px;
	}
`;
