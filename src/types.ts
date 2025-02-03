// types.ts
export interface DataItem {
	id: number;
	name: string;
	value: number;
	[key: string]: any;
}

export interface SortColumnEvent extends CustomEvent {
	detail: {
		column: string;
	};
}

export interface ColumnReorderEvent extends CustomEvent {
	detail: {
		sourceColumn: string;
		targetColumn: string;
	};
}

export interface ColumnResizeEvent extends CustomEvent {
	detail: {
		column: string;
		width: number;
	};
}

export type SortDirection = 'asc' | 'desc' | null;

export interface TableState {
	sortColumn: string | null;
	sortDirection: SortDirection;
	visibleColumns: string[];
	totalItems: number;
}