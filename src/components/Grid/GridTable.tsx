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
} from 'react';
import { AppBar, Box, Grid, LinearProgress, Toolbar } from '@mui/material';
import { AgGrid, AgGridRef } from './AgGrid';
import { useColumnTypes } from './GridFormat';
import { GridOptions } from 'ag-grid-community';
import { Theme } from '@mui/material/styles';

export interface GridProgressProps {
    /**
     * intended to be a percent number in range [0;1] or null or NaN
     */
    progress: null | number;
}

export interface GridTableProps<TData>
    extends Omit<
            GridOptions<TData>,
            | 'overlayLoadingTemplate'
            | 'loadingOverlayComponent'
            | 'loadingOverlayComponentParams'
        >,
        Partial<GridProgressProps> {}

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
            RefAttributes<AgGridRef<TData, TContext>>
    ): ReturnType<
        ForwardRefComponent<GridTableProps<TData>, AgGridRef<TData, TContext>>
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
    gridRef: ForwardedRef<AgGridRef<TData, TContext>>
): ReactNode {
    const { children: toolbarContent, progress, ...agGridProps } = props;
    const columnTypes = useColumnTypes<TData>();
    return (
        <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
        >
            <Grid xs="auto">
                <AppBar position="static" color="default">
                    <Toolbar
                        variant="dense"
                        sx={{
                            '& > *': {
                                marginRight: '0.2em',
                                '&:last-child': {
                                    marginRight: 0,
                                },
                            },
                        }}
                    >
                        {/*TODO button reset grid filter/sort/column-hide/rows-selection ...*/}
                        {/*<Divider orientation="vertical" variant="middle" flexItem />*/}
                        {toolbarContent}
                        <Box sx={{ flexGrow: 1 }} />
                    </Toolbar>
                </AppBar>
            </Grid>
            <Grid item xs="auto">
                <GridProgress progress={progress ?? null} />
            </Grid>
            <Grid item xs>
                <AgGrid<TData, TContext>
                    columnTypes={columnTypes}
                    {...agGridProps}
                    ref={gridRef}
                />
            </Grid>
        </Grid>
    );
});
export default GridTable;

function GridProgressStyle(theme: Theme) {
    // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/AppBar/AppBar.js#L39-L40
    const backgroundColorDefault =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900];
    return {
        backgroundColor: backgroundColorDefault,
        color: theme.palette.getContrastText(backgroundColorDefault),
    };
}

const GridProgress: FunctionComponent<GridProgressProps> = (props, context) => {
    if (props.progress === null || props.progress === undefined) {
        // simulate a disabled state
        //TODO css to match color with AppBar background (.MuiLinearProgress-root, .MuiLinearProgress-determinate)
        return (
            <LinearProgress
                variant="determinate"
                value={0}
                sx={GridProgressStyle}
            />
        );
    } else if (Number.isNaN(props.progress)) {
        // animation from right to left
        return <LinearProgress variant="query" sx={GridProgressStyle} />;
    } else if (props.progress < 0) {
        // animation from left to right
        return (
            <LinearProgress variant="indeterminate" sx={GridProgressStyle} />
        );
    } /*if (props.progress >= 0)*/ else {
        // animation dashed
        return (
            <LinearProgress
                variant="buffer"
                valueBuffer={props.progress * 100.0}
                sx={GridProgressStyle}
            />
        );
    }
};
