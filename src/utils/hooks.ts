/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SelectionChangedEvent } from "ag-grid-community";
import { useCallback, useState } from "react";

export function useDebugRender(label: string) {
    // uncomment when you want the output in the console
    /*if (import.meta.env.DEV) {
        label = `${label} render`;
        console.count?.(label);
        console.timeStamp?.(label);
    }*/
}

/**
 * Custom hook to handle table row selection with proper filtering support
 * @returns Selection state and handler for AG Grid's onSelectionChanged
 */
export function useTableSelection<T>() {
    const [rowsSelection, setRowsSelection] = useState<T[]>([]);

    const onSelectionChanged = useCallback((event: SelectionChangedEvent<T, {}>) => {
        // Get only selected rows that are currently visible (after filtering)
        const visibleSelectedRows: T[] = [];
        event.api.forEachNodeAfterFilterAndSort((node) => {
            if (node.isSelected() && node.data) {
                visibleSelectedRows.push(node.data);
            }
        });
        setRowsSelection(visibleSelectedRows);
    }, []);

    return { rowsSelection, setRowsSelection, onSelectionChanged };
}
