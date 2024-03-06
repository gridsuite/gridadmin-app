/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Divider, useForkRef } from '@mui/material';
import NoRowsOverlay from './NoRowsOverlay';
import {
    Dispatch,
    PropsWithChildren,
    ReactElement,
    RefObject,
    SetStateAction,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { AgColDef } from './AgGrid/AgGrid.type';
import { AgGridRef } from './AgGrid/AgGrid';
import Grid, { GridProps } from './Grid';
import {
    ComponentStateChangedEvent,
    GridReadyEvent,
    SelectionChangedEvent,
} from 'ag-grid-community/dist/lib/events';
import { GridButtonRefresh } from './buttons/ButtonRefresh';
import { GridButtonDelete } from './buttons/ButtonDelete';
import { GridButtonAdd } from './buttons/ButtonAdd';

type NoRowOverlay = typeof NoRowsOverlay;
type FullDataGridProps<TData, TContext extends {}> = GridProps<
    TData,
    TContext,
    NoRowOverlay
>;

type DataGridExposed = {
    actionThenRefresh: (action: () => Promise<unknown>) => void;
};

export interface DataGridProps<TData, TContext extends {}>
    extends Omit<FullDataGridProps<TData, TContext>, 'rowData'>,
        PropsWithChildren<{}> {
    //context: NonNullable<FullDataGridProps<TData, TContext>['context']>; //required
    accessRef: RefObject<DataGridRef<TData, TContext>>;
    dataLoader: () => Promise<TData[]>;
    removeElement?: (dataLine: TData) => Promise<never>;
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
 * When AgGridReact props change, maybe rowData after a refresh, show no-rows overlay in this case
 * because code call hideOverlay from api...
 */
function onComponentStateChanged<TData, TContext>(
    event: ComponentStateChangedEvent<TData, TContext>
): void {
    if (
        event.api.getInfiniteRowCount()! > 0 ||
        event.api.getDisplayedRowCount() > 0
    ) {
        event.api.showNoRowsOverlay();
    } else {
        event.api.hideOverlay();
    }
}

/*
 * Exposed to grid pre-configuration:
 *  * common columns config
 *  * configuration with formatter i18n for columns with timestamp
 * Add common buttons in toolbar (with management of states)
 * Manage also the progressbar animation:
 *   * "loading" have two states: performing action, and loading/refreshing data
 *   * full flow state with (action, loader) =
 *      - isAction = true                 <=== start here with actionWithRefresh
 *      - gridApi.showLoadingOverlay()
 *      - action()
 *      - gridApi.hideOverlay()
 *      - isAction = false
 *      - gridApi.showLoadingOverlay()    <=== start here with refresh
 *      - loadDataAndSave()
 *      - gridApi.hideOverlay()
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
    const gridRef = useRef<DataGridRef<TData, TContext>>(null);
    const handleGridRef = useForkRef(accessRef, gridRef);

    const [data, setData] = useState<TData[] | null>(null);
    const [rowsSelection, setRowsSelection] = useState<TData[]>([]);

    const [loadingAction, setLoadingAction] = useState<boolean>(false);

    function loadDataAndSave<TData>(
        loader: () => Promise<TData[]>,
        setData: Dispatch<SetStateAction<TData[] | null>>,
        snackError: (snackInputs: unknown) => void
    ): Promise<void> {
        return loader().then(setData, (error) => {
            snackError({
                messageTxt: error.message,
                headerId: 'table.error.retrieve',
            });
            //setData(null);
            //TODO what to do with "old" data?
        });
    }

    const actionWithLoadingState = useCallback(function actionWithState(
        action: () => Promise<unknown>,
        notHideOverlay?: true
    ) {
        console.debug(
            '[DEBUG]',
            'actionWithLoadingState()',
            action,
            notHideOverlay
        );
        //TODO how to block simultaneous calls?
        //gridRef.current?.api?.showLoadingOverlay();
        setLoadingAction(true);
        return action().finally(() => {
            console.debug('[DEBUG]', 'actionWithLoadingState() -> finally');
            if (!notHideOverlay) {
                setLoadingAction(false);
            }
        });
    },
    []);
    const refreshWithLoadingState = useCallback(
        function actionWithState(notManageOverlay?: true) {
            console.debug(
                '[DEBUG]',
                'refreshWithLoadingState()',
                notManageOverlay
            );
            //TODO how to block simultaneous calls?
            //gridRef.current?.api?.showLoadingOverlay();
            if (!notManageOverlay) {
                gridRef.current?.api?.showLoadingOverlay();
            }
            return loadDataAndSave(dataLoader, setData, snackError).finally(
                () => {
                    console.debug(
                        '[DEBUG]',
                        'refreshWithLoadingState() -> finally'
                    );
                    if (!notManageOverlay) {
                        setLoadingAction(false);
                    }
                }
            );
        },
        [dataLoader, snackError]
    );
    const actionThenRefresh = useCallback(
        function actionThenRefresh(action: () => Promise<unknown>) {
            console.debug('[DEBUG]', 'actionThenRefresh()', action);
            actionWithLoadingState(action).then(() =>
                refreshWithLoadingState()
            );
        },
        [actionWithLoadingState, refreshWithLoadingState]
    );

    return (
        <Grid<TData, TContext & DataGridExposed, NoRowOverlay>
            {...(gridProps as GridProps<
                TData,
                TContext & DataGridExposed,
                NoRowOverlay
            >)}
            ref={handleGridRef}
            rowData={data}
            defaultColDef={defaultColDef as AgColDef<TData>}
            alwaysShowVerticalScroll={true}
            onGridReady={useCallback(
                (event: GridReadyEvent<TData, TContext>) => {
                    console.debug('[DEBUG]', 'gridReady()', event);
                    loadDataAndSave(dataLoader, setData, snackError);
                    //event.api.addEventListener('componentStateChanged', onComponentStateChanged);
                },
                [dataLoader, snackError]
            )}
            rowSelection="single" //TODO multiple with delete action
            onSelectionChanged={useCallback(
                (event: SelectionChangedEvent<TData, TContext>) =>
                    setRowsSelection(event.api.getSelectedRows() ?? []),
                []
            )}
            //immutableData={true}
            context={
                useMemo(
                    () => ({
                        ...(context ?? {}),
                        actionThenRefresh,
                    }),
                    [context, actionThenRefresh]
                ) as TContext & DataGridExposed
            }
            //TODO progress={loadingAction ? 'query' : 'indeterminate'}
            noRowsOverlayComponent={
                (!gridProps.overlayNoRowsTemplate &&
                    !gridProps.noRowsOverlayComponent &&
                    NoRowsOverlay) ||
                undefined
            }
            noRowsOverlayComponentParams={undefined}
        >
            <GridButtonRefresh refresh={refreshWithLoadingState} />
            <GridButtonDelete
                onClick={useCallback(() => {
                    actionThenRefresh(() =>
                        Promise.all(rowsSelection.map(removeElement!))
                    );
                }, [actionThenRefresh, removeElement, rowsSelection])}
                disabled={useMemo(
                    () => !removeElement && rowsSelection.length <= 0,
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
            {/*<Box sx={{ flex: 1 }} />*/}
        </Grid>
    );
}
