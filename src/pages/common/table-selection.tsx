/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CustomAGGrid } from '@gridsuite/commons-ui';
import { Grid, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GetRowIdParams, GridReadyEvent } from 'ag-grid-community';
import { defaultColDef, defaultRowSelection } from './table-config';

/**
 * Generic props for TableSelection component.
 * @template TData - The type of data items in the table
 */
export interface TableSelectionProps<TData> {
    /** Translation key for the table title */
    titleId: string;
    /** Array of data items to display */
    items: TData[];
    /** Function to extract the unique ID from each item (used for selection tracking) */
    getItemId: (item: TData) => string;
    /** Column definitions for the AG Grid */
    columnDefs: ColDef<TData>[];
    /** Array of selected item IDs */
    selectedIds?: string[];
    /** Callback when selection changes, receives array of selected IDs */
    onSelectionChanged: (selectedIds: string[]) => void;
}

const rowSelection = {
    ...defaultRowSelection,
    headerCheckbox: false,
};

/**
 * A generic table component with row selection support.
 * Displays data in an AG Grid with checkboxes for selection.
 */
function TableSelection<TData>({
    titleId,
    items,
    getItemId,
    columnDefs,
    selectedIds,
    onSelectionChanged,
}: Readonly<TableSelectionProps<TData>>) {
    const [selectedCount, setSelectedCount] = useState(0);
    const gridRef = useRef<AgGridReact<TData>>(null);

    const getRowId = useCallback(
        (params: GetRowIdParams<TData>): string => {
            return getItemId(params.data);
        },
        [getItemId]
    );

    const handleSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current?.api.getSelectedRows();
        if (selectedRows == null) {
            setSelectedCount(0);
            onSelectionChanged([]);
        } else {
            setSelectedCount(selectedRows.length);
            onSelectionChanged(selectedRows.map(getItemId));
        }
    }, [onSelectionChanged, getItemId]);

    const handleGridReady = useCallback(
        ({ api }: GridReadyEvent<TData>) => {
            if (!selectedIds?.length) {
                return;
            }
            api.forEachNode((node) => {
                const nodeId = node.id;
                if (nodeId && selectedIds.includes(nodeId)) {
                    node.setSelected(true);
                }
            });
        },
        [selectedIds]
    );

    const mergedColumnDefs = useMemo((): ColDef<TData>[] => {
        return columnDefs.map((col, index) => ({
            filter: true,
            flex: 1,
            ...col,
            // First column gets initial sort if not specified elsewhere
            ...(index === 0 && !columnDefs.some((c) => c.initialSort) ? { initialSort: 'asc' as const } : {}),
        }));
    }, [columnDefs]);

    return (
        <Grid item container direction="column" style={{ height: '100%' }}>
            <Grid item>
                <Typography variant="subtitle1">
                    <FormattedMessage id={titleId} />
                    {` (${selectedCount} / ${items.length})`}
                </Typography>
            </Grid>
            <Grid item xs>
                <CustomAGGrid
                    gridId="table-selection"
                    ref={gridRef}
                    rowData={items}
                    columnDefs={mergedColumnDefs}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                    getRowId={getRowId}
                    onSelectionChanged={handleSelectionChanged}
                    onGridReady={handleGridReady}
                    accentedSort
                />
            </Grid>
        </Grid>
    );
}

export default TableSelection;
