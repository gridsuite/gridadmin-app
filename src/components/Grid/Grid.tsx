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
import { AppBar, Box, LinearProgress, Toolbar } from '@mui/material';
import { AgGrid, AgGridRef } from './AgGrid';
import { useColumnTypes } from './GridFormat';
import { GridOptions } from 'ag-grid-community';

export interface GridProgressProps {
    /**
     * intended to be a percent number in range [0;1] or null or NaN
     */
    progress: null | number;
}

export interface GridProps<TData>
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
interface GridWithRef
    extends FunctionComponent<PropsWithChildren<GridProps<unknown>>> {
    <TData, TContext extends {}>(
        props: PropsWithoutRef<PropsWithChildren<GridProps<TData>>> &
            RefAttributes<AgGridRef<TData, TContext>>
    ): ReturnType<
        ForwardRefComponent<GridProps<TData>, AgGridRef<TData, TContext>>
    >;
}

/**
 * Common part for a Grid with toolbar
 * @param props
 */
export const Grid: GridWithRef = forwardRef(function AgGridToolbar<
    TData,
    TContext extends {} = {}
>(
    props: PropsWithChildren<GridProps<TData>>,
    gridRef: ForwardedRef<AgGridRef<TData, TContext>>
): ReactNode {
    const { children: toolbarContent, progress, ...agGridProps } = props;
    const columnTypes = useColumnTypes<TData>();
    return (
        <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
            <AppBar position="static">
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
            <GridProgress progress={progress ?? null} />
            <AgGrid<TData, TContext>
                columnTypes={columnTypes}
                {...agGridProps}
                ref={gridRef}
            />
        </Box>
    );
});
export default Grid;

const GridProgress: FunctionComponent<GridProgressProps> = (props, context) => {
    if (props.progress === null || props.progress === undefined) {
        // simulate a disabled state
        //TODO css to match color with AppBar background (.MuiLinearProgress-root, .MuiLinearProgress-determinate)
        return (
            <LinearProgress color="inherit" variant="determinate" value={0} />
        );
    } else if (Number.isNaN(props.progress)) {
        // animation from right to left
        return <LinearProgress variant="query" />;
    } else if (props.progress < 0) {
        // animation from left to right
        return <LinearProgress variant="indeterminate" />;
    } /*if (props.progress >= 0)*/ else {
        // animation dashed
        return (
            <LinearProgress
                variant="buffer"
                valueBuffer={props.progress * 100.0}
            />
        );
    }
};
