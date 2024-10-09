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
import { AppBar, Box, Button, ButtonProps, Grid, Toolbar } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { AgGrid, AgGridRef } from './AgGrid';
import { GridOptions } from 'ag-grid-community';
import { useIntl } from 'react-intl';
import { useSnackMessage } from '@gridsuite/commons-ui';

type GridTableExposed = {
    refresh: () => Promise<void>;
};

export type GridTableRef<TData, TContext extends {} = {}> = AgGridRef<TData, TContext & GridTableExposed>;

export interface GridTableProps<TData> extends Omit<GridOptions<TData>, 'rowData'>, PropsWithChildren<{}> {
    //accessRef: RefObject<GridTableRef<TData, TContext>>;
    dataLoader: () => Promise<TData[]>;
}

/*
 * Restore lost generics from `forwardRef()`<br/>
 * https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
 */
type ForwardRef<Props, Ref> = typeof forwardRef<Props, Ref>;
type ForwardRefComponent<Props, Ref> = ReturnType<ForwardRef<Props, Ref>>;

interface GridTableWithRef extends FunctionComponent<PropsWithChildren<GridTableProps<unknown>>> {
    <TData, TContext extends {}>(
        props: PropsWithoutRef<PropsWithChildren<GridTableProps<TData>>> & RefAttributes<GridTableRef<TData, TContext>>
    ): ReturnType<ForwardRefComponent<GridTableProps<TData>, GridTableRef<TData, TContext>>>;
}

/**
 * Common part for a Grid with toolbar
 * @param props
 */
export const GridTable: GridTableWithRef = forwardRef(function AgGridToolbar<TData, TContext extends {} = {}>(
    props: PropsWithChildren<GridTableProps<TData>>,
    gridRef: ForwardedRef<GridTableRef<TData, TContext>>
): ReactNode {
    const { children: toolbarContent, context, dataLoader, ...agGridProps } = props;
    const { snackError } = useSnackMessage();

    const [data, setData] = useState<TData[] | null>(null);

    const loadDataAndSave = useCallback(
        function loadDataAndSave(): Promise<void> {
            return dataLoader().then(setData, (error) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'table.error.retrieve',
                });
            });
        },
        [dataLoader, snackError]
    );

    return (
        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch">
            <Grid item xs="auto">
                <AppBar position="static" color="default">
                    <Toolbar
                        variant="dense"
                        disableGutters
                        sx={(theme) => ({
                            marginLeft: 1,
                            '& > *': {
                                // mui's button set it own margin on itself...
                                marginRight: `${theme.spacing(1)} !important`,
                                '&:last-child': {
                                    marginRight: '0 !important',
                                },
                            },
                        })}
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
                    onGridReady={loadDataAndSave}
                    context={useMemo(
                        () =>
                            ({
                                ...((context ?? {}) as TContext),
                                refresh: loadDataAndSave,
                            } as TContext & GridTableExposed),
                        [context, loadDataAndSave]
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

export const GridButton = forwardRef<HTMLButtonElement, GridButtonProps>(function GridButton(props, ref) {
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
});

function noClickProps() {
    console.error('GridButtonDelete.onClick not defined');
}

export const GridButtonDelete = forwardRef<HTMLButtonElement, Partial<Omit<GridButtonProps, 'color'>>>(
    function GridButtonDelete(props, ref) {
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
    }
);
