/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Divider } from '@mui/material';
import NoRowsOverlay from './NoRowsOverlay';
import {
    PropsWithChildren,
    ReactElement,
    RefObject,
    useCallback,
    useMemo,
    useState,
} from 'react';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { AgGridRef } from './AgGrid';
import { GridTable, GridTableProps } from './GridTable';
import { SelectionChangedEvent } from 'ag-grid-community/dist/lib/events';
import { GridButtonDelete } from './buttons/ButtonDelete';
import { ColDef } from 'ag-grid-community';
import { useStateWithLabel } from '../../utils/hooks';

type FnAction<R> = () => Promise<R>;
type CatchError<R, E = any> = (reason: E) => R | PromiseLike<R>;
type DataGridExposed = {
    refresh: () => Promise<void>;
    queryAction: (
        action: FnAction<void>,
        onerror?: CatchError<void>
    ) => Promise<void>;
};

export interface DataGridProps<TData, TContext extends {}>
    extends Omit<GridTableProps<TData>, 'rowData'>,
        PropsWithChildren<{}> {
    //context: NonNullable<FullDataGridProps<TData, TContext>['context']>; //required
    accessRef: RefObject<DataGridRef<TData, TContext>>;
    dataLoader: () => Promise<TData[]>;
    removeElements?: (dataLines: TData[]) => Promise<void>;
    addBtn?: () => ReactElement;
}

export type DataGridRef<TData, TContext extends {} = {}> = AgGridRef<
    TData,
    TContext & DataGridExposed
>;

const defaultColDef: ColDef<unknown> = {
    editable: false,
    resizable: true,
    minWidth: 50,
    cellRenderer: 'agAnimateSlideCellRenderer', //'agAnimateShowChangeCellRenderer'
    showDisabledCheckboxes: true,
    rowDrag: false,
    sortable: true,
    enableCellChangeFlash: process.env.REACT_APP_DEBUG_AGGRID === 'true',
};

/**
 * Generic near CRUD (no update part) Grid
 */
/*
 * Exposed to grid pre-configuration:
 *  * common columns config
 *  * configuration with formatter i18n for columns with timestamp
 * Add common buttons in toolbar (with management of states)
 * Manage also the progressbar animation:
 */
//IDEA: optionally save grid state to just show/hide in tabs without losing grid state
export default function DataGrid<TData, TContext extends {} = {}>(
    props: Readonly<DataGridProps<TData, TContext>>
): ReactElement {
    const {
        context,
        accessRef,
        dataLoader,
        removeElements,
        addBtn,
        children,
        ...gridProps
    } = props;

    const { snackError } = useSnackMessage();

    //TODO refresh on notification change from user-admin-server (add, delete, ...)
    const [data, setData] = useState<TData[] | null>(null);
    const [rowsSelection, setRowsSelection] = useState<TData[]>([]);
    const [progress, setProgress] = useStateWithLabel<number | null>(
        'progress',
        null
    );

    const loadDataAndSave = useCallback(
        function loadDataAndSave(): Promise<void> {
            return dataLoader().then(setData, (error) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'table.error.retrieve',
                });
                //setData(null);
                //TODO what to do with "old" data?
            });
        },
        [dataLoader, snackError]
    );

    const setProgressDisable = useCallback(
        () => setProgress(null),
        [setProgress]
    );
    const setProgressQuery = useCallback(
        () => setProgress(Number.NaN),
        [setProgress]
    );
    const setProgressLoading = useCallback(
        () => setProgress(-1),
        [setProgress]
    );

    const loadingAction = useCallback(
        (action: FnAction<void>, onerror?: CatchError<void>): Promise<void> =>
            new Promise<void>((resolve, reject) => {
                try {
                    setProgressLoading();
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
                .then(action, onerror)
                .catch(onerror)
                .finally(setProgressDisable),
        [setProgressDisable, setProgressLoading]
    );
    const queryAction: DataGridExposed['queryAction'] = useCallback(
        (action, onerror?) =>
            new Promise<void>((resolve, reject) => {
                try {
                    setProgressQuery();
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
                .then(action, onerror)
                .catch(onerror)
                .finally(setProgressDisable),
        [setProgressDisable, setProgressQuery]
    );
    const refresh = useCallback(
        () => loadingAction(loadDataAndSave),
        [loadDataAndSave, loadingAction]
    );

    const btnDelete = useMemo(
        () =>
            removeElements ? (
                <GridButtonDelete
                    onClick={() =>
                        queryAction(() => removeElements(rowsSelection))
                            //TODO replace manual refresh by notifications
                            .then(() => loadingAction(loadDataAndSave))
                    }
                    disabled={!removeElements || rowsSelection.length <= 0}
                />
            ) : undefined,
        [
            loadDataAndSave,
            loadingAction,
            queryAction,
            removeElements,
            rowsSelection,
        ]
    );

    return (
        <GridTable<TData, TContext & DataGridExposed>
            {...gridProps}
            ref={props.accessRef}
            rowData={data}
            defaultColDef={defaultColDef as ColDef<TData>}
            alwaysShowVerticalScroll={true}
            onGridReady={refresh}
            rowSelection="multiple"
            onSelectionChanged={useCallback(
                (event: SelectionChangedEvent<TData, TContext>) =>
                    setRowsSelection(event.api.getSelectedRows() ?? []),
                []
            )}
            context={
                useMemo(
                    () => ({
                        ...(context ?? {}),
                        refresh: refresh,
                        queryAction: queryAction,
                    }),
                    [context, queryAction, refresh]
                ) as TContext & DataGridExposed
            }
            progress={progress}
            noRowsOverlayComponent={
                (!gridProps.overlayNoRowsTemplate &&
                    !gridProps.noRowsOverlayComponent &&
                    NoRowsOverlay) ||
                undefined
            }
            noRowsOverlayComponentParams={undefined}
        >
            {btnDelete}
            {addBtn?.()}
            {children && (
                <>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    {children}
                </>
            )}
        </GridTable>
    );
}
