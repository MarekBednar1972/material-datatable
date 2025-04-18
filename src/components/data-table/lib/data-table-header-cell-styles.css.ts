/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {css} from 'lit';
import {tokens} from './shared-styles.js';
export const headerCellStyles = css`
	${tokens}
	:host {
		display: table-cell;
		vertical-align: inherit;
		box-sizing: border-box;
	}

	:host([draggable]) {
		cursor: grab;
	}

	:host(.dragging) {
		opacity: var(--_disabled-state-layer-opacity);
		cursor: grabbing;
	}

	.md-data-table__header-cell {
		background-color: var(--_table-background-color);
		display: flex;
		align-items: center;
		position: relative;
		height: var(--_header-row-height);
		padding: 0 20px;
		color: var(--_on-surface-variant);
		font-family: 'Roboto', Arial, sans-serif;
		font-size: var(--_title-small-size);
		font-weight: 700;
		line-height: var(--_title-small-line-height);
		box-sizing: border-box;
		text-align: left;
		letter-spacing: 0.1px;
		padding-right: 0;
		user-select: none;
	}
	.md-data-table-cell.title {
	background-color: var(--_table-background-color);
	}
	.md-data-table__header-cell--sortable {
		cursor: pointer;
	}

	.md-data-table__header-cell--sortable:hover {
		color: var(--_on-surface);
	}

	.md-data-table__header-cell--sorted {
		color: var(--_on-surface);
	}

	.md-data-table__header-cell--numeric {
		justify-content: flex-end;
		text-align: right;
	}

	.md-data-table__header-cell__content {
    display: flex;
    align-items: center;
    min-height: 48px;
    height: 56px;
    font-size: 1rem;
    padding: 0;
}
    padding: 0 0 0 0;
    min-height: 48px;
    align-items: center;
    font-size: 1rem;
}
		display: flex;
		align-items: center;
		width: 100%;
		//pointer-events: none;
	}

	.md-data-table__header-cell__sort-icon {
    margin-left: 8px;
    color: var(--_on-surface-variant);
    opacity: 1;
    font-size: 20px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
    margin-left: 8px;
    color: var(--_on-surface-variant);
    opacity: 1;
    font-size: 20px;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    float: right;
}
		margin-left: 4px;
		opacity: 0;
	}

	.md-data-table__header-cell--sortable:hover .md-data-table__header-cell__sort-icon,
	.md-data-table__header-cell--sorted .md-data-table__header-cell__sort-icon {
    margin-left: 8px;
    color: var(--_on-surface-variant);
    opacity: 1;
    font-size: 20px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
    margin-left: 8px;
    color: var(--_on-surface-variant);
    opacity: 1;
    font-size: 20px;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    float: right;
}
		opacity: 1;
	}

	:host(:first-of-type) .md-data-table__header-cell {
		padding-left: var(--_row-horizontal-padding);
	}

	:host(:last-of-type) .md-data-table__header-cell {
		padding-right: var(--_row-horizontal-padding);
	}

	md-checkbox {
		margin-right: var(--_checkbox-margin);
		margin-left: calc(-1 * var(--_checkbox-margin) / 1.5);
	}

	.resize-handle {
		width: 10px;
		height: 100%;
		cursor: col-resize;
		margin-left: var(--_cell-horizontal-padding);
	}

	:host(:not(.dragging)) .md-data-table__header-cell:hover {
		background: var(--_hover-color);
	}
`;