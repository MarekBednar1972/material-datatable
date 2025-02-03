// data-helpers.ts
import { DataItem, SortDirection } from './types';

class DataManager {
	private _data: DataItem[] = [];
	private _totalItems: number = 0;

	generateItems(count: number): void {
		this._totalItems = count;
		this._data = Array.from({ length: count }, (_, index) => ({
			id: index,
			name: `Item ${index}`,
			value: Math.random() * 100,
		}));
	}

	getTotalItems(): number {
		return this._totalItems;
	}

	async loadData(
		startIndex: number,
		count: number,
		sortColumn: string | null,
		sortDirection: SortDirection
	): Promise<DataItem[]> {
		// Simulate network delay
		await this.delay(500);

		const sortedData = this.sortData(this._data, sortColumn, sortDirection);
		return sortedData.slice(startIndex, startIndex + count);
	}

	private sortData(
		data: DataItem[],
		column: string | null,
		direction: SortDirection
	): DataItem[] {
		if (!column || !direction) {
			return data;
		}

		return [...data].sort((a, b) => {
			const aValue = a[column];
			const bValue = b[column];

			if (aValue === bValue) return 0;
			const modifier = direction === 'asc' ? 1 : -1;
			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return aValue.localeCompare(bValue) * modifier;
			}
			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return (aValue - bValue) * modifier;
			}
			return 1;
		});
	}

	private delay(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

export const dataManager = new DataManager();