/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {css} from 'lit';
import {tokens} from './shared-styles.js';

export const styles = css`
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
    opacity: 0.5;
    cursor: grabbing;
  }

  .md-data-table__header-cell {
    display: flex;
    align-items: center;
    position: relative;
    height: var(--_header-container-height);
    padding: 0 var(--_cell-container-padding);
    color: var(--_header-headline-color);
    font-family: var(--_header-headline-font);
    font-size: var(--_header-headline-size);
    font-weight: var(--_header-headline-weight);
    line-height: var(--_header-headline-line-height);
    box-sizing: border-box;
    text-align: left;
    letter-spacing: 0.1px;
    padding-right: 0;
    user-select: none;
  }

  .md-data-table__header-cell--sortable {
    cursor: pointer;
  }

  .md-data-table__header-cell--sortable:hover {
    color: var(--md-sys-color-on-surface);
  }

  .md-data-table__header-cell--sorted {
    color: var(--md-sys-color-on-surface);
  }

  .md-data-table__header-cell--numeric {
    justify-content: flex-end;
    text-align: right;
  }

  .md-data-table__header-cell__content {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .md-data-table__header-cell__sort-icon {
    margin-left: 4px;
    opacity: 0;
    transition: opacity var(--_transition-duration) var(--_transition-timing-function);
    font-size: 18px;
    width: 18px;
    height: 18px;
  }

  .md-data-table__header-cell--sortable:hover .md-data-table__header-cell__sort-icon,
  .md-data-table__header-cell--sorted .md-data-table__header-cell__sort-icon {
    opacity: 1;
  }

  /* Checkbox alignment - same as cells */
  :host(:first-of-type) .md-data-table__header-cell {
    padding-left: 24px;
  }

  :host(:last-of-type) .md-data-table__header-cell {
    padding-right: 24px;
  }

  md-checkbox {
    margin-right: 12px;
    margin-left: -8px;
  }

  .resize-handle {
    width: 10px;
    height: 100%;
    cursor: col-resize;
    margin-left: var(--_cell-container-padding);
  }

  /* Drag and drop visual feedback */
  :host(:not(.dragging)) .md-data-table__header-cell:hover {
    background-color: color-mix(
        in srgb,
        var(--_row-hover-state-layer-color) var(--_row-hover-state-layer-opacity),
        var(--_header-container-color)
    );
  }
`;