/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {css} from 'lit';
import {tokens} from './shared-styles.js';

export const styles = css`
  ${tokens}

  :host {
    display: table-row;
    vertical-align: inherit;
    outline: none;
  }

  .md-data-table__row {
    display: flex;
    border-bottom: 1px solid var(--_row-outline-color);
    background-color: var(--_row-container-color);
    transition: background-color var(--_transition-duration) var(--_transition-timing-function);
  }

  .md-data-table__row--hoverable:hover {
    background-color: color-mix(
      in srgb,
      var(--_row-hover-state-layer-color) var(--_row-hover-state-layer-opacity),
      var(--_row-container-color)
    );
  }

  .md-data-table__row--selected {
    background-color: var(--_row-selected-container-color);
  }

  :host(:last-child) .md-data-table__row {
    border-bottom: none;
  }

  :host(:focus-visible) .md-data-table__row {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: -2px;
  }
`;