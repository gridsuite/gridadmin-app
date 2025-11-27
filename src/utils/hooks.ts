/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FilterChangedEvent, GridApi, IRowNode, SelectionChangedEvent } from 'ag-grid-community';
import { useCallback, useState } from 'react';

export function useDebugRender(_label: string) {
    // uncomment when you want the output in the console
    /*if (import.meta.env.DEV) {
        label = `${label} render`;
        console.count?.(label);
        console.timeStamp?.(label);
    }*/
}

/**
 * Custom hook to handle table row selection with proper filtering support
 * @returns Selection state and handlers for AG Grid's selection and filter changes
 */
export function useTableSelection<T>() {
    const [rowsSelection, setRowsSelection] = useState<T[]>([]);

    // update visible selections based on current filter state
    const updateVisibleSelection = useCallback((api: GridApi) => {
        const visibleSelectedRows: T[] = [];
        api.forEachNodeAfterFilterAndSort((node: IRowNode) => {
            if (node.isSelected() && node.data) {
                visibleSelectedRows.push(node.data);
            }
        });
        setRowsSelection(visibleSelectedRows);
    }, []);

    const onSelectionChanged = useCallback(
        (event: SelectionChangedEvent) => {
            updateVisibleSelection(event.api);
        },
        [updateVisibleSelection]
    );

    const onFilterChanged = useCallback(
        (event: FilterChangedEvent) => {
            updateVisibleSelection(event.api);
        },
        [updateVisibleSelection]
    );

    return { rowsSelection, onSelectionChanged, onFilterChanged };
}
