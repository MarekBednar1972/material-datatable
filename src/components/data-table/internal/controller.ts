/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {ReactiveController, ReactiveElement} from 'lit';
import {DataItem, SortDirection, DataTableState} from '../types.js';
import {strings} from '../constants.js';

/**
 * Controller that manages data table state and data operations.
 */
export class DataTableController implements ReactiveController {
	private host: ReactiveElement;
	private state: DataTableState = {
		sortColumn: null,
		sortDirection: null,
		selectedIndices: new Set<number>(),
		loading: false
	};

	private data: DataItem[] = [];
	private sortedData: DataItem[] = [];

	constructor(host: ReactiveElement) {
		(this.host = host).addController(this);
	}

	hostConnected() {}
	hostDisconnected() {}

	setState(state: Partial<DataTableState>) {
		this.state = {...this.state, ...state};
		this.host.requestUpdate();
	}

	getState(): DataTableState {
		return this.state;
	}

	setData(data: DataItem[]) {
		this.data = [...data];
		this.sortData();
	}

	getData(): DataItem[] {
		return this.sortedData;
	}

	setSorting(column: string | null, direction: SortDirection) {
		this.setState({
			sortColumn: column,
			sortDirection: direction
		});
		this.sortData();
	}

	toggleSelection(index: number) {
		const newIndices = new Set(this.state.selectedIndices);
		if (newIndices.has(index)) {
			newIndices.delete(index);
		} else {
			newIndices.add(index);
		}
		this.setState({ selectedIndices: newIndices });
	}

	setSelectionAll(selected: boolean, totalCount: number) {
		const newIndices = selected ?
			new Set(Array.from({ length: totalCount }, (_, i) => i)) :
			new Set<number>();
		this.setState({ selectedIndices: newIndices });
	}

	setLoading(loading: boolean) {
		this.setState({ loading });
	}

	private compareValues(a: unknown, b: unknown): number {
		// Handle null/undefined values
		if (a == null && b == null) return 0;
		if (a == null) return -1;
		if (b == null) return 1;

		// Handle numbers
		if (typeof a === 'number' && typeof b === 'number') {
			return a - b;
		}

		// Handle dates
		if (a instanceof Date && b instanceof Date) {
			return a.getTime() - b.getTime();
		}

		// Handle booleans
		if (typeof a === 'boolean' && typeof b === 'boolean') {
			return a === b ? 0 : a ? 1 : -1;
		}

		// Default to string comparison
		const aStr = String(a);
		const bStr = String(b);
		return aStr.localeCompare(bStr);
	}

	private sortData() {
		const {sortColumn, sortDirection} = this.state;

		if (!sortColumn || !sortDirection) {
			this.sortedData = [...this.data];
			return;
		}

		this.sortedData = [...this.data].sort((a, b) => {
			const aValue = a[sortColumn];
			const bValue = b[sortColumn];

			const compareResult = this.compareValues(aValue, bValue);
			return sortDirection === strings.ASC ? compareResult : -compareResult;
		});

		this.host.requestUpdate();
	}
}