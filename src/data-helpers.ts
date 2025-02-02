import { DataItem } from './md-data-table'; // Import DataItem

let _allData: DataItem[] = [];

/**
 * Generates a specified number of mock data items.
 * @param count The number of data items to generate.
 * @returns An array of DataItem objects.
 */
export function generateDataItems(count: number): DataItem[] {
	_allData = Array.from({ length: count }, (_, index) => ({
		id: index,
		name: `Item ${index}`,
		value: Math.random() * 100,
	}));
	return _allData;
}

/**
 * Simulates fetching a "page" of data from a sorted dataset.
 * @param startIndex The starting index of the page.
 * @param count The number of items to fetch.
 * @param sortColumn The column to sort by.
 * @param sortDirection The sort direction.
 * @returns A Promise that resolves to the "page" of data.
 */
export async function loadMoreData(
	startIndex: number,
	count: number,
	sortColumn: string | null,
	sortDirection: 'asc' | 'desc' | null
): Promise<DataItem[]> {
	// Simulate fetching data from an API (delay)
	await new Promise((resolve) => setTimeout(resolve, 500));

	// 1. Sort the entire _allData array.
	const sortedData = sortData(_allData, sortColumn, sortDirection);

	// 2. Get the subset of data based on startIndex and count.
	const newData = sortedData.slice(startIndex, startIndex + count);

	return newData;
}

function sortData(data: DataItem[], column: string | null, direction: "asc" | "desc" | null = 'asc'): DataItem[] {
	if (!column || !direction) {
		return data; // Nothing to sort
	}

	return [...data].sort((a, b) => {
		const aValue = a[column];
		const bValue = b[column];

		if (aValue === bValue) {
			return 0;
		}

		if (direction === 'asc') {
			return aValue > bValue ? 1 : -1;
		} else {
			return aValue < bValue ? 1 : -1;
		}
	});
}