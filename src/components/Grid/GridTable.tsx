/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    ForwardedRef,
    forwardRef,
    FunctionComponent,
    PropsWithChildren,
    PropsWithoutRef,
    ReactNode,
    RefAttributes,
    useCallback,
    useId,
    useMemo,
    useState,
} from 'react';
import {
    AppBar,
    Box,
    Button as MuiButton,
    ButtonProps,
    ButtonTypeMap,
    ExtendButtonBaseTypeMap,
    Grid,
    Toolbar,
} from '@mui/material';
import {
    OverridableComponent,
    OverridableTypeMap,
    OverrideProps,
} from '@mui/material/OverridableComponent';
import { Delete } from '@mui/icons-material';
import { AgGrid, AgGridRef } from './AgGrid';
import { GridOptions } from 'ag-grid-community';
import { useIntl } from 'react-intl';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { useStateWithLabel } from '../../utils/hooks';

type FnAction<R> = () => Promise<R>;
type CatchError<R, E = any> = (reason: E) => R | PromiseLike<R>;
type GridTableExposed = {
    refresh: () => Promise<void>;
    runningAction: (
        action: FnAction<void>,
        onerror?: CatchError<void>
    ) => Promise<void>;
};

export type GridTableRef<TData, TContext extends {} = {}> = AgGridRef<
    TData,
    TContext & GridTableExposed
>;

export interface GridTableProps<TData>
    extends Omit<GridOptions<TData>, 'rowData'>,
        PropsWithChildren<{}> {
    //accessRef: RefObject<GridTableRef<TData, TContext>>;
    dataLoader: () => Promise<TData[]>;
}

/*
 * Restore lost generics from `forwardRef()`<br/>
 * https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
 */
type ForwardRef<Props, Ref> = typeof forwardRef<Props, Ref>;
type ForwardRefComponent<Props, Ref> = ReturnType<ForwardRef<Props, Ref>>;
interface GridTableWithRef
    extends FunctionComponent<PropsWithChildren<GridTableProps<unknown>>> {
    <TData, TContext extends {}>(
        props: PropsWithoutRef<PropsWithChildren<GridTableProps<TData>>> &
            RefAttributes<GridTableRef<TData, TContext>>
    ): ReturnType<
        ForwardRefComponent<
            GridTableProps<TData>,
            GridTableRef<TData, TContext>
        >
    >;
}

/**
 * Common part for a Grid with toolbar
 * @param props
 */
export const GridTable: GridTableWithRef = forwardRef(function AgGridToolbar<
    TData,
    TContext extends {} = {}
>(
    props: PropsWithChildren<GridTableProps<TData>>,
    gridRef: ForwardedRef<GridTableRef<TData, TContext>>
): ReactNode {
    const {
        children: toolbarContent,
        context,
        dataLoader,
        ...agGridProps
    } = props;
    const { snackError } = useSnackMessage();

    //TODO refresh on notification change from user-admin-server (add, delete, ...)
    const [data, setData] = useState<TData[] | null>(null);
    const [doingAction, setDoingAction] = useStateWithLabel<boolean>(
        'doing action',
        false
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

    const runningAction = useCallback(
        (action: FnAction<void>, onerror?: CatchError<void>): Promise<void> =>
            new Promise<void>((resolve, reject) => {
                try {
                    setDoingAction(true);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
                .then(action, onerror)
                .catch(onerror)
                .finally(() => setDoingAction(false)),
        [setDoingAction]
    );
    const refresh = useCallback(
        () => runningAction(loadDataAndSave),
        [loadDataAndSave, runningAction]
    );

    return (
        <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            sx={
                doingAction
                    ? {
                          '& *': { cursor: 'wait' },
                      }
                    : undefined
            }
        >
            <Grid item xs="auto">
                <AppBar position="static" color="default">
                    <Toolbar
                        variant="dense"
                        disableGutters
                        sx={{
                            marginLeft: 1,
                            '& > *': {
                                marginRight: 1,
                                '&:last-child': {
                                    marginRight: 0,
                                },
                            },
                        }}
                    >
                        {toolbarContent}
                        <Box sx={{ flexGrow: 1 }} />
                    </Toolbar>
                </AppBar>
            </Grid>
            <Grid item xs>
                <AgGrid<TData, TContext & GridTableExposed>
                    {...agGridProps}
                    ref={gridRef}
                    rowData={data}
                    alwaysShowVerticalScroll={true}
                    onGridReady={refresh}
                    context={useMemo(
                        () =>
                            ({
                                ...((context ?? {}) as TContext),
                                refresh: refresh,
                                runningAction: runningAction,
                            } as TContext & GridTableExposed),
                        [context, runningAction, refresh]
                    )}
                />
            </Grid>
        </Grid>
    );
});
export default GridTable;

export type GridButtonProps = Omit<
    ButtonProps,
    'children' | 'aria-label' | 'aria-disabled' | 'variant' | 'id' | 'size'
> & {
    textId: string;
    labelId: string;
};

/* Taken from MUI/materials-ui codebase
 * Mui expose button's defaultComponent as "button" and button component as "a"... but generate in reality a <button/>
 * Redefine type to cast it.
 */
type ExtendButtonBaseOverride<M extends OverridableTypeMap> = ((
    props: OverrideProps<ExtendButtonBaseTypeMap<M>, 'button'>
) => JSX.Element) &
    OverridableComponent<ExtendButtonBaseTypeMap<M>>;
const Button = MuiButton as ExtendButtonBaseOverride<ButtonTypeMap>;

export const GridButton = forwardRef<HTMLButtonElement, GridButtonProps>(
    function GridButton(props, ref) {
        const intl = useIntl();
        const buttonId = useId();
        const { textId, labelId, ...buttonProps } = props;
        return (
            <Button
                variant="outlined"
                {...(buttonProps ?? {})}
                aria-label={intl.formatMessage({ id: props.labelId })}
                aria-disabled={props.disabled}
                id={buttonId}
                ref={ref}
                size="small"
            >
                {intl.formatMessage({ id: props.textId })}
            </Button>
        );
    }
);

function noClickProps() {
    console.error('GridButtonDelete.onClick not defined');
}

export const GridButtonDelete = forwardRef<
    HTMLButtonElement,
    Partial<Omit<GridButtonProps, 'color'>>
>(function GridButtonDelete(props, ref) {
    return (
        <GridButton
            textId="table.toolbar.delete"
            labelId="table.toolbar.delete.label"
            onClick={noClickProps}
            startIcon={<Delete fontSize="small" />}
            {...props}
            ref={ref}
            color="error"
        />
    );
});
