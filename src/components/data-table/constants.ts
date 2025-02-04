/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

export const events = {
    SORT_CHANGED: 'sort-changed',
    SORT_UPDATED: 'sort-updated',
    SELECTION_CHANGED: 'selection-changed',
    VISIBILITY_CHANGED: 'visibility-changed',
    COLUMN_RESIZE: 'column-resize',
    COLUMN_REORDER: 'column-reorder'
} as const;

export const strings = {
    DEFAULT_SIZE: 'default',
    COMPACT_SIZE: 'compact',
    COMFORTABLE_SIZE: 'comfortable',
    ASC: 'asc',
    DESC: 'desc'
} as const;

export const cssClasses = {
    // Root classes
    TABLE: 'md-data-table',
    TABLE_COMPACT: 'md-data-table--compact',
    TABLE_COMFORTABLE: 'md-data-table--comfortable',
    TABLE_SORTABLE: 'md-data-table--sortable',
    TABLE_SELECTABLE: 'md-data-table--selectable',
    TABLE_LOADING: 'md-data-table--loading',

    // Structural classes
    HEADER: 'md-data-table__header',
    BODY: 'md-data-table__body',
    ROW: 'md-data-table__row',
    CELL: 'md-data-table__cell',
    HEADER_CELL: 'md-data-table__header-cell',
    LOADING_OVERLAY: 'md-data-table__loading',

    // State classes
    ROW_SELECTED: 'md-data-table__row--selected',
    ROW_HOVERABLE: 'md-data-table__row--hoverable',
    CELL_NUMERIC: 'md-data-table__cell--numeric',
    HEADER_CELL_SORTED: 'md-data-table__header-cell--sorted',
    HEADER_CELL_SORTABLE: 'md-data-table__header-cell--sortable',
    HEADER_CELL_DRAGGABLE: 'md-data-table__header-cell--draggable'
} as const;

export const numbers = {
    DEFAULT_PAGE_SIZE: 20,
    LOAD_MORE_THRESHOLD: 10,
    INITIAL_LOAD_SIZE: 50,
    DEFAULT_ROW_HEIGHT: 52,
    COMPACT_ROW_HEIGHT: 44,
    COMFORTABLE_ROW_HEIGHT: 60
};