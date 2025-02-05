/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {css} from 'lit';
import {tokens} from './shared-styles.js';

export const cellStyles = css`
	${tokens}
	:host {
		display: table-cell;
		vertical-align: inherit;
		box-sizing: border-box;
	}

	.md-data-table__cell {
		display: flex;
		align-items: center;
		position: relative;
		height: 100%;
		padding: 0 var(--_cell-horizontal-padding);
		color: var(--_on-surface);
		font-family: var(--_body-medium-font);
		font-size: var(--_body-medium-size);
		font-weight: var(--_body-medium-weight);
		line-height: var(--_body-medium-line-height);
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.md-data-table__cell--numeric {
		justify-content: flex-end;
		text-align: right;
	}

	:host(:first-of-type) .md-data-table__cell {
		padding-left: var(--_row-horizontal-padding);
	}

	:host(:last-of-type) .md-data-table__cell {
		padding-right: var(--_row-horizontal-padding);
	}

	md-checkbox {
		margin-right: var(--_checkbox-margin);
		margin-left: calc(-1 * var(--_checkbox-margin) / 1.5);
	}
`;