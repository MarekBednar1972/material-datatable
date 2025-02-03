/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {css} from 'lit';

export const tokens = css`
  :host {
    /* Table theme tokens */
    --_container-color: var(--md-data-table-container-color, var(--md-sys-color-surface));
    --_container-shape: var(--md-data-table-container-shape, 0px);
    --_container-shadow: var(--md-data-table-container-shadow, var(--md-sys-shadow-0));
    
    /* Header tokens */
    --_header-container-color: var(--md-data-table-header-container-color, var(--md-sys-color-surface-container));
    --_header-container-height: var(--md-data-table-header-container-height, 56px);
    --_header-headline-color: var(--md-data-table-header-headline-color, var(--md-sys-color-on-surface-variant));
    --_header-headline-font: var(--md-data-table-header-headline-font, var(--md-sys-typescale-title-small-font));
    --_header-headline-line-height: var(--md-data-table-header-headline-line-height, var(--md-sys-typescale-title-small-line-height));
    --_header-headline-size: var(--md-data-table-header-headline-size, var(--md-sys-typescale-title-small-size));
    --_header-headline-weight: var(--md-data-table-header-headline-weight, var(--md-sys-typescale-title-small-weight));
    
    /* Row tokens */
    --_row-container-color: var(--md-data-table-row-container-color, var(--md-sys-color-surface));
    --_row-hover-state-layer-color: var(--md-data-table-row-hover-state-layer-color, var(--md-sys-color-on-surface));
    --_row-hover-state-layer-opacity: var(--md-data-table-row-hover-state-layer-opacity, 0.08);
    --_row-selected-container-color: var(--md-data-table-row-selected-container-color, var(--md-sys-color-surface-container-highest));
    --_row-outline-color: var(--md-data-table-row-outline-color, var(--md-sys-color-outline-variant));
    
    /* Cell tokens */
    --_cell-container-height: var(--md-data-table-cell-container-height, 52px);
    --_cell-container-padding: var(--md-data-table-cell-container-padding, 16px);
    --_cell-content-color: var(--md-data-table-cell-content-color, var(--md-sys-color-on-surface));
    --_cell-content-font: var(--md-data-table-cell-content-font, var(--md-sys-typescale-body-medium-font));
    --_cell-content-line-height: var(--md-data-table-cell-content-line-height, var(--md-sys-typescale-body-medium-line-height));
    --_cell-content-size: var(--md-data-table-cell-content-size, var(--md-sys-typescale-body-medium-size));
    --_cell-content-weight: var(--md-data-table-cell-content-weight, var(--md-sys-typescale-body-medium-weight));

    /* Animation tokens */
    --_transition-duration: var(--md-data-table-transition-duration, 200ms);
    --_transition-timing-function: var(--md-data-table-transition-timing-function, cubic-bezier(0.2, 0, 0, 1));
  }
`;

export const sharedStyles = css`
  .md-data-table__loading-overlay {
    align-items: center;
    background: rgba(var(--md-sys-color-surface-rgb), 0.7);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
`;