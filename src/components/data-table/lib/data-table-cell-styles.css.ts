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

  .md-data-table__cell {
    display: flex;
    align-items: center;
    position: relative;
    height: var(--_cell-container-height);
    padding: 0 var(--_cell-container-padding);
    color: var(--_cell-content-color);
    font-family: var(--_cell-content-font);
    font-size: var(--_cell-content-size);
    font-weight: var(--_cell-content-weight);
    line-height: var(--_cell-content-line-height);
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .md-data-table__cell--numeric {
    justify-content: flex-end;
    text-align: right;
  }

  /* Checkbox alignment */
  :host(:first-of-type) .md-data-table__cell {
    padding-left: 24px;
  }

  :host(:last-of-type) .md-data-table__cell {
    padding-right: 24px;
  }

  md-checkbox {
    margin-right: 12px;
    margin-left: -8px;
  }
`;