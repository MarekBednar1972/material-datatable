/**
 * @license MIT
 * Copyright 2024 Digital Works Slovakia / M. Bednar
 */

import {ReactiveController, ReactiveElement} from 'lit';
import {DataTableSize} from '../types.js';
import {cssClasses, strings} from '../constants.js';

/**
 * Controller that manages UI state and class generation.
 */
export class UiStateController implements ReactiveController {
	private host: ReactiveElement;

	constructor(host: ReactiveElement) {
		(this.host = host).addController(this);
	}

	hostConnected() {
	}

	hostDisconnected() {
	}

	getTableClasses(config: {
		size: DataTableSize;
		sortable: boolean;
		selectable: boolean;
		loading: boolean;
	}): Record<string, boolean> {
		const {size, sortable, selectable, loading} = config;

		return {
			[cssClasses.TABLE]: true,
			[cssClasses.TABLE_COMPACT]: size === strings.COMPACT_SIZE,
			[cssClasses.TABLE_COMFORTABLE]: size === strings.COMFORTABLE_SIZE,
			[cssClasses.TABLE_SORTABLE]: sortable,
			[cssClasses.TABLE_SELECTABLE]: selectable,
			[cssClasses.TABLE_LOADING]: loading,
		};
	}

	getRowClasses(config: {
		selected: boolean;
		hoverable: boolean;
	}): Record<string, boolean> {
		const {selected, hoverable} = config;

		return {
			[cssClasses.ROW]: true,
			[cssClasses.ROW_SELECTED]: selected,
			[cssClasses.ROW_HOVERABLE]: hoverable,
		};
	}

	getHeaderCellClasses(config: {
		sortable: boolean;
		sorted: boolean;
		numeric: boolean;
		draggable: boolean;
	}): Record<string, boolean> {
		const {sortable, sorted, numeric, draggable} = config;

		return {
			[cssClasses.HEADER_CELL]: true,
			[cssClasses.HEADER_CELL_SORTABLE]: sortable,
			[cssClasses.HEADER_CELL_SORTED]: sorted,
			[cssClasses.CELL_NUMERIC]: numeric,
			[cssClasses.HEADER_CELL_DRAGGABLE]: draggable,
		};
	}

	getCellClasses(config: {
		numeric: boolean;
	}): Record<string, boolean> {
		const {numeric} = config;

		return {
			[cssClasses.CELL]: true,
			[cssClasses.CELL_NUMERIC]: numeric,
		};
	}
}