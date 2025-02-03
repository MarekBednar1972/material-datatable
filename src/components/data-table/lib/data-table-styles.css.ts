/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {css} from 'lit';
import {tokens, sharedStyles} from './shared-styles.js';

export const styles = css`
  ${tokens}
  ${sharedStyles}

  :host {
    display: inline-flex;
    vertical-align: top;
    min-width: 700px;
    min-height: 450px;
  }

  .md-data-table {
    background-color: var(--_container-color);
    border-radius: var(--_container-shape);
    box-shadow: var(--_container-shadow);
    display: flex;
    flex-direction: column;
    max-height: inherit;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .md-data-table__header {
    background-color: var(--_header-container-color);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .md-data-table__body {
    flex: 1;
    overflow: auto;
  }

  /** Size variants */
  .md-data-table--compact .md-data-table__cell {
    height: 44px;
  }

  .md-data-table--comfortable .md-data-table__cell {
    height: 60px;
  }

  /** Loading state */
  .md-data-table--loading {
    pointer-events: none;
  }

  /** Virtualizer */
  lit-virtualizer {
    contain: strict;
    height: 100%;
    width: 100%;
  }
`;