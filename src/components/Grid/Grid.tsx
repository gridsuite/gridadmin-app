import {
    ForwardedRef,
    forwardRef,
    FunctionComponent,
    JSXElementConstructor,
    PropsWithChildren,
    PropsWithoutRef,
    ReactNode,
    RefAttributes,
} from 'react';
import { AppBar, Box, LinearProgress, Toolbar } from '@mui/material';
import { AgGridProps } from './AgGrid/AgGrid.type';
import AgGrid, { AgGridRef } from './AgGrid/AgGrid';
import { useColumnTypes } from './GridFormat';

export interface GridProgressProps {
    /**
     * intended to be a percent number in range [0;1] or null or NaN
     */
    progress: null | number;
}

export interface GridProps<
    TData,
    TContext extends {},
    NoCmpnt extends JSXElementConstructor<any>
> extends Omit<
            AgGridProps<TData, TContext, any, NoCmpnt>,
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
    extends FunctionComponent<PropsWithChildren<GridProps<unknown, any, any>>> {
    <TData, TContext extends {}, NoCmpnt extends JSXElementConstructor<any>>(
        props: PropsWithoutRef<
            PropsWithChildren<GridProps<TData, TContext, NoCmpnt>>
        > &
            RefAttributes<AgGridRef<TData, TContext>>
    ): ReturnType<
        ForwardRefComponent<
            GridProps<TData, TContext, NoCmpnt>,
            AgGridRef<TData, TContext>
        >
    >;
}

/**
 * Common part for a Grid with toolbar
 * @param props
 */
export const Grid: GridWithRef = forwardRef(function AgGridToolbar<
    TData,
    TContext extends {} = {},
    NoCmpnt extends JSXElementConstructor<any> = any
>(
    props: PropsWithChildren<GridProps<TData, TContext, NoCmpnt>>,
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
            <AgGrid<TData, TContext, any, NoCmpnt>
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
