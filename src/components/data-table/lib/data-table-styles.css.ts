/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {css} from 'lit';
import {tokens} from './shared-styles.js';

export const tableStyles = css`
	${tokens}
	:host {
		display: inline-flex;
		vertical-align: top;
		min-width: 700px;
		min-height: 450px;
	}

	.md-data-table {
		background: var(--_surface-color);
		border-radius: var(--_table-border-radius);
		box-shadow: var(--_container-shadow);
		display: table;
		table-layout: auto;
		max-height: inherit;
		overflow: hidden;
		position: relative;
		width: 100%;
		height: auto;
	}

	.md-data-table__header {
		background: var(--_surface-container);
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.md-data-table__body {
		height: 100%;
		overflow: auto;
	}

	.md-data-table--compact .md-data-table__cell {
		height: var(--_compact-row-height);
	}

	.md-data-table--comfortable .md-data-table__cell {
		height: var(--_comfortable-row-height);
	}

	.md-data-table--loading {
		pointer-events: none;
	}

	.md-data-table__loading-overlay {
		background: color-mix(
				in srgb,
				var(--_surface-color) 70%,
				transparent
		);
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		inset: 0;
	}
`;
