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
import { AgColDef } from './AgGrid/AgGrid.type';
import { AgGridRef } from './AgGrid/AgGrid';
import Grid, { GridProps } from './Grid';
import { SelectionChangedEvent } from 'ag-grid-community/dist/lib/events';
import { GridButtonRefresh } from './buttons/ButtonRefresh';
import { GridButtonDelete } from './buttons/ButtonDelete';
import { GridButtonAdd } from './buttons/ButtonAdd';

type NoRowOverlay = typeof NoRowsOverlay;
type FullDataGridProps<TData, TContext extends {}> = GridProps<
    TData,
    TContext,
    NoRowOverlay
>;

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
    extends Omit<FullDataGridProps<TData, TContext>, 'rowData'>,
        PropsWithChildren<{}> {
    //context: NonNullable<FullDataGridProps<TData, TContext>['context']>; //required
    accessRef: RefObject<DataGridRef<TData, TContext>>;
    dataLoader: () => Promise<TData[]>;
    removeElement?: (dataLine: TData) => Promise<void>;
    addBtn?: () => ReactElement;
}

export type DataGridRef<TData, TContext extends {} = {}> = AgGridRef<
    TData,
    TContext & DataGridExposed
>;

const defaultColDef: AgColDef<unknown> = {
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
//TODO optionally save grid state to just show/hide in tabs without losing grid state
export default function DataGrid<TData, TContext extends {} = {}>(
    props: Readonly<DataGridProps<TData, TContext>>
): ReactElement {
    const {
        context,
        accessRef,
        dataLoader,
        removeElement,
        addBtn,
        children,
        ...gridProps
    } = props;

    const { snackError } = useSnackMessage();

    const [data, setData] = useState<TData[] | null>(null);
    const [rowsSelection, setRowsSelection] = useState<TData[]>([]);
    const [progress, setProgress] = useState<number | null>(null);

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

    const setProgressDisable = useCallback(() => setProgress(null), []);
    const setProgressQuery = useCallback(() => setProgress(Number.NaN), []);
    const setProgressLoading = useCallback(() => setProgress(-1), []);

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

    return (
        <Grid<TData, TContext & DataGridExposed, NoRowOverlay>
            {...(gridProps as GridProps<
                TData,
                TContext & DataGridExposed,
                NoRowOverlay
            >)}
            ref={props.accessRef}
            rowData={data}
            defaultColDef={defaultColDef as AgColDef<TData>}
            alwaysShowVerticalScroll={true}
            onGridReady={refresh}
            rowSelection="single" //TODO multiple with delete action
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
            <GridButtonRefresh refresh={refresh} />
            <GridButtonDelete
                onClick={useCallback(
                    () =>
                        queryAction(() =>
                            Promise.all(rowsSelection.map(removeElement!)).then(
                                (values) => {}
                            )
                        ).then(() => loadingAction(loadDataAndSave)),
                    [
                        loadDataAndSave,
                        loadingAction,
                        queryAction,
                        removeElement,
                        rowsSelection,
                    ]
                )}
                disabled={useMemo(
                    () => !removeElement || rowsSelection.length <= 0,
                    [removeElement, rowsSelection.length]
                )}
            />
            {addBtn?.() ?? <GridButtonAdd />}
            {children && (
                <>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    {children}
                </>
            )}
        </Grid>
    );
}