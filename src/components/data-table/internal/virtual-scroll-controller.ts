/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {ReactiveController, ReactiveElement} from 'lit';
import {DataColumn, DataItem, SortDirection} from '../types.js';
import {numbers} from '../constants.js';

export type LoadMoreCallback = (startIndex: number, count: number, sortColumn: DataColumn, sortDirection: SortDirection) => Promise<DataItem[]>;

export interface VirtualScrollConfig {
	pageSize?: number;
	totalItems?: number;
}

/**
 * Controller that manages virtual scrolling behavior.
 */
export class VirtualScrollController implements ReactiveController {
	private host: ReactiveElement;
	private pageSize: number = numbers.DEFAULT_PAGE_SIZE;
	private loadedData: DataItem[] = [];
	private totalItems = 0;
	private loadingMore = false;
	private lastVisibleIndex = 0;
	private loadMoreCallback?: LoadMoreCallback;
	private sortColumn: DataColumn | null = null;
	private sortDirection: SortDirection = null;

	constructor(host: ReactiveElement, loadMoreCallback?: LoadMoreCallback) {
		(this.host = host).addController(this);
		this.loadMoreCallback = loadMoreCallback;
	}

	hostConnected() {
	}

	hostDisconnected() {
	}

	setConfig(config: VirtualScrollConfig) {
		if (config.pageSize !== undefined) {
			this.pageSize = config.pageSize;
		}
		if (config.totalItems !== undefined) {
			this.totalItems = config.totalItems;
		}
	}

	setSorting(sortColumn: DataColumn, sortDirection: SortDirection) {
		this.sortColumn = sortColumn;
		this.sortDirection = sortDirection;
	}

	handleVisibilityChanged(first: number, last: number) {
		this.lastVisibleIndex = last;
		this.checkLoadMore();
	}

	private async checkLoadMore() {
		if (!this.loadMoreCallback ||
			this.loadingMore ||
			this.lastVisibleIndex + numbers.LOAD_MORE_THRESHOLD < this.loadedData.length ||
			this.loadedData.length >= this.totalItems) {
			return;
		}

		this.loadingMore = true;
		this.host.requestUpdate();

		try {
			const newData = await this.loadMoreCallback(
				this.loadedData.length,
				this.pageSize,
				this.sortColumn!,
				this.sortDirection
			);

			this.loadedData = [...this.loadedData, ...newData];
		} finally {
			this.loadingMore = false;
			this.host.requestUpdate();
		}
	}

	getData(): DataItem[] {
		return this.loadedData;
	}

	reset() {
		this.loadedData = [];
		this.lastVisibleIndex = 0;
		this.loadingMore = false;
		this.host.requestUpdate();
	}
}