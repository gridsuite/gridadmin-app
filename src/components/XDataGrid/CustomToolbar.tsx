import { forwardRef, FunctionComponent, PropsWithChildren } from 'react';
import { Box, Divider } from '@mui/material';
import {
    GridCsvExportMenuItem,
    GridPrintExportMenuItem,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExportContainer,
    GridToolbarFilterButton,
    GridToolbarProps,
    GridToolbarQuickFilter,
    useGridRootProps,
} from '@mui/x-data-grid';
import GridToolbarRefresh, {
    GridToolbarRefreshProps,
} from './GridToolbarButtonRefresh';
import GridJsonExportMenuItem from './GridJsonExportMenuItem';

export interface CustomGridToolbarProps extends GridToolbarProps {
    onRefresh?: GridToolbarRefreshProps['refresh'];
    //TODO remove multi selection
}

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
                <GridToolbarExportContainer>
                    <GridCsvExportMenuItem options={props.csvOptions} />
                    <GridPrintExportMenuItem options={props.printOptions} />
                    {/*<GridExcelExportMenuItem options={props.excelOptions} />*/}
                    <GridJsonExportMenuItem options={undefined} />
                    {/*TODO add to props definition*/}
                </GridToolbarExportContainer>
                {(props.children || props.onRefresh) && (
                    <>
                        <Divider orientation="vertical" />
                        {props.onRefresh && (
                            <GridToolbarRefresh refresh={props.onRefresh} />
                        )}
                        {props.children}
                    </>
                )}
                {props.showQuickFilter && (
                    <>
                        <Box sx={{ flex: 1 }} />
                        {props.showQuickFilter && (
                            <GridToolbarQuickFilter
                                {...props.quickFilterProps}
                            />
                        )}
                    </>
                )}
            </GridToolbarContainer>
        );
    }
});
export default CustomToolbar;
