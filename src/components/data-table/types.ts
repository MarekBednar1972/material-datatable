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
		column: string;
		direction: SortDirection;
	};
}

export interface ResizeEvent extends CustomEvent {
	detail: {
		column: string;
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

export interface DataTableState {
	sortColumn: string | null;
	sortDirection: SortDirection;
	selectedIndices: Set<number>;
	loading: boolean;
}