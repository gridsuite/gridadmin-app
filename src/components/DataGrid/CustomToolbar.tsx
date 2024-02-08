import { forwardRef, FunctionComponent, PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import {
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarProps,
    GridToolbarQuickFilter, useGridApiContext,
    useGridRootProps
} from '@mui/x-data-grid';

export const CustomToolbar: FunctionComponent<PropsWithChildren<GridToolbarProps>> = forwardRef<
    HTMLDivElement,
    GridToolbarProps
>((props, ref) => {
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    /*const handleExport = (options: GridCsvExportOptions) =>
        apiRef.current.exportDataAsCsv(options);*/

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
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport
                    csvOptions={props.csvOptions}
                    printOptions={props.printOptions}
                    //excelOptions={props.excelOptions}
                />
                <Box sx={{ flex: 1 }} />
                {props.showQuickFilter && (
                    <GridToolbarQuickFilter {...props.quickFilterProps} />
                )}
                {props.children} //TODO refresh-data
            </GridToolbarContainer>
        );
    }
});
export default CustomToolbar;
