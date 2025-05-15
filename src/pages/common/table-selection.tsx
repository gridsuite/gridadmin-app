/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { CustomAGGrid } from '@gridsuite/commons-ui';
import { Grid, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GetRowIdParams, GridReadyEvent } from 'ag-grid-community';
import { defaultColDef, defaultRowSelection } from './table-config';

export interface TableSelectionProps {
    itemName: string;
    tableItems: string[];
    tableSelectedItems?: string[];
    onSelectionChanged: (selectedItems: string[]) => void;
}

const rowSelection = {
    ...defaultRowSelection,
    headerCheckbox: false,
};

const TableSelection: FunctionComponent<TableSelectionProps> = (props) => {
    const [selectedRowsLength, setSelectedRowsLength] = useState(0);
    const gridRef = useRef<AgGridReact>(null);

    const handleEquipmentSelectionChanged = useCallback(() => {
        const selectedRows = gridRef.current?.api.getSelectedRows();
        if (selectedRows == null) {
            setSelectedRowsLength(0);
            props.onSelectionChanged([]);
        } else {
            setSelectedRowsLength(selectedRows.length);
            props.onSelectionChanged(selectedRows.map((r) => r.id));
        }
    }, [props]);

    const rowData = useMemo(() => {
        return props.tableItems.map((str) => ({ id: str }));
    }, [props.tableItems]);

    const columnDefs = useMemo(
        (): ColDef[] => [
            {
                field: 'id',
                filter: true,
                initialSort: 'asc',
                tooltipField: 'id',
                flex: 1,
            },
        ],
        []
    );

    function getRowId(params: GetRowIdParams): string {
        return params.data.id;
    }

    const onGridReady = useCallback(
        ({ api }: GridReadyEvent) => {
            api?.forEachNode((n) => {
                if (props.tableSelectedItems !== undefined && n.id && props.tableSelectedItems.includes(n.id)) {
                    n.setSelected(true);
                }
            });
        },
        [props.tableSelectedItems]
    );

    return (
        <Grid item container direction={'column'} style={{ height: '100%' }}>
            <Grid item>
                <Typography variant="subtitle1">
                    <FormattedMessage id={props.itemName}></FormattedMessage>
                    {` (${selectedRowsLength} / ${rowData?.length ?? 0})`}
                </Typography>
            </Grid>
            <Grid item xs>
                <CustomAGGrid
                    gridId="table-selection"
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowSelection={rowSelection}
                    getRowId={getRowId}
                    onSelectionChanged={handleEquipmentSelectionChanged}
                    onGridReady={onGridReady}
                    accentedSort={true}
                />
            </Grid>
        </Grid>
    );
};
export default TableSelection;
