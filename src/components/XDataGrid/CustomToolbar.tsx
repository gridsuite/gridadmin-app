import { forwardRef, FunctionComponent, PropsWithChildren } from 'react';
import { Box, Divider } from '@mui/material';
import {
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarProps,
    GridToolbarQuickFilter,
    useGridRootProps,
} from '@mui/x-data-grid';
import GridToolbarRefresh, {
    GridToolbarRefreshProps,
} from './GridToolbarRefresh';

export type CustomGridToolbarProps = GridToolbarProps & {
    refresh?: GridToolbarRefreshProps['refresh'];
};

export const CustomToolbar: FunctionComponent<
    PropsWithChildren<CustomGridToolbarProps>
> = forwardRef<HTMLDivElement, CustomGridToolbarProps>((props, ref) => {
    const rootProps = useGridRootProps();
    //const apiRef = useGridApiContext();

    //const handleExport = (options: GridCsvExportOptions) => apiRef.current.exportDataAsCsv(options);

    if (
        rootProps.disableColumnFilter &&
        rootProps.disableColumnSelector &&
        rootProps.disableDensitySelector &&
        !props.showQuickFilter
    ) {
        return null;
    } else {
        return (
            <GridToolbarContainer ref={ref} {...props.other}>
                {/*<GridToolbarColumnsButton />*/}
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={props.csvOptions}
                    printOptions={props.printOptions}
                    //excelOptions={props.excelOptions}
                />
                {(props.showQuickFilter || props.refresh || props.children) && (
                    <>
                        <Divider orientation="vertical" />
                        {props.refresh && (
                            <GridToolbarRefresh refresh={props.refresh} />
                        )}
                        <Box sx={{ flex: 1 }} />
                        {props.showQuickFilter && (
                            <GridToolbarQuickFilter
                                {...props.quickFilterProps}
                            />
                        )}
                        {props.children}
                    </>
                )}
            </GridToolbarContainer>
        );
    }
});
export default CustomToolbar;
