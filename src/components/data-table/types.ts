/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

export type DataTableSize = 'default' | 'compact' | 'comfortable';
export type SortDirection = 'asc' | 'desc' | null;

export interface DataItem {
	[key: string]: unknown;
}

export interface SortEvent extends CustomEvent {
	detail: {
		column: DataColumn;
		direction: SortDirection;
	};
}

export interface ResizeEvent extends CustomEvent {
	detail: {
		column: DataColumn;
		width: number;
	};
}

export interface SelectionEvent extends CustomEvent {
	detail: {
		selectedIndices: number[];
	};
}

export interface VisibilityEvent extends CustomEvent {
	detail: {
		first: number;
		last: number;
	};
}

export interface ColumnReorderEvent extends CustomEvent {
	detail: {
		sourceColumnId: string;
		targetColumnId: string;
	};
}

export interface DataTableState {
	sortColumn: DataColumn | null;
	sortDirection: SortDirection;
	selectedIndices: Set<number>;
	loading: boolean;
}

export interface DataColumn {
	id: string;
	label: string;
	order: number;
	numeric?: boolean;
	sortable?: boolean;
	draggable?: boolean;
}