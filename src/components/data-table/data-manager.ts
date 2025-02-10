// data-helpers.ts
import {DataColumn, DataItem, SortDirection} from './types';
import { faker } from '@faker-js/faker';

export class DataManager {
	private static _instance?: DataManager;

	private constructor() {
		if (DataManager._instance)
			throw new Error("Use Singleton.instance instead of new.");
		DataManager._instance = this;
	}

	static get instance() {
		return DataManager._instance ?? (DataManager._instance = new DataManager());
	}

	private _data: DataItem[] = [];
	private _totalItems: number = 0;

	generateItems(count: number): void {
		this._totalItems = count;
		this._data = Array.from({length: count}, (_, index) => (this.createRandomUser()));
	}

	createRandomUser() {
		return {
			userId: faker.string.uuid(),
			username: faker.internet.username(), // before version 9.1.0, use userName()
			email: faker.internet.email(),
			password: faker.internet.password(),
			birthdate: faker.date.birthdate(),
			registeredAt: faker.date.past(),
		};
	}

	getTotalItems(): number {
		return this._totalItems;
	}

	async loadData(
		startIndex: number,
		count: number,
		sortColumn: DataColumn,
		sortDirection: SortDirection
	): Promise<DataItem[]> {
		console.log('loadData', startIndex, count, sortColumn, sortDirection)
		// Simulate network delay
		await DataManager.instance.delay(500);
		const sortedData = DataManager.instance.sortData(DataManager.instance._data, sortColumn?.path, sortDirection);
		console.log(sortedData.length, sortedData.slice(startIndex, startIndex + count))
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

export const dataManager = DataManager.instance;