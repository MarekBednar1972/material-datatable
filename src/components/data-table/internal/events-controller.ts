/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {ReactiveController, ReactiveElement} from 'lit';
import {events} from '../constants.js';
import {DataColumn, SortDirection} from '../types.js';

/**
 * Controller that manages event dispatching for the data table.
 */
export class EventsController implements ReactiveController {
	private host: ReactiveElement;

	constructor(host: ReactiveElement) {
		(this.host = host).addController(this);
	}

	hostConnected() {
	}

	hostDisconnected() {
	}

	dispatchSortChanged(column: DataColumn, direction: SortDirection) {
		this.dispatch(events.SORT_CHANGED, {column, direction});
	}

	dispatchSortUpdated(column: string | null, direction: SortDirection) {
		this.dispatch(events.SORT_UPDATED, {column, direction});
	}

	dispatchSelectionChanged(selectedIndices: number[]) {
		this.dispatch(events.SELECTION_CHANGED, {selectedIndices});
	}

	dispatchVisibilityChanged(first: number, last: number) {
		this.dispatch(events.VISIBILITY_CHANGED, {first, last});
	}

	dispatchColumnResize(column: DataColumn, width: number) {
		this.dispatch(events.COLUMN_RESIZE, {column, width});
	}

	private dispatch(eventName: string, detail: unknown) {
		this.host.dispatchEvent(new CustomEvent(eventName, {
			detail,
			bubbles: true,
			composed: true
		}));
	}
}