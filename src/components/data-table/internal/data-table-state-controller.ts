/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {ReactiveController, ReactiveElement} from 'lit';
import {DataItem, SortDirection, DataTableState} from '../types.js';
import {strings} from '../constants.js';

export class DataTableStateController implements ReactiveController {
	private host: ReactiveElement;
	private state: DataTableState = {
		sortColumn: null,
		sortDirection: null,
		selectedIndices: new Set<number>(),
		loading: false
	};

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

}