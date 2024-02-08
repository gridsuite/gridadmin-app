import { DataGrid, DataGridProps, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { GridValidRowModel } from '@mui/x-data-grid/models/gridRows';
import { ReactElement } from 'react';
import { deepmerge } from '@mui/utils';

export default function CommonDataGrid<R extends GridValidRowModel>(
    props: DataGridProps<R>
): ReactElement {
    return (
        <DataGrid
            {...props}
            density="compact"
            //TODO loading={false}
            slots={{
                toolbar: GridToolbar, //TODO (des)active as app parameter
                loadingOverlay: LinearProgress,
                noRowsOverlay: CustomNoRowsOverlay,
                //TODO noResultsOverlay: ...
                ...props.slots,
            }}
            slotProps={deepmerge(
                {
                    toolbar: {
                        csvOptions: {
                            //https://mui.com/x/api/data-grid/grid-print-export-options/
                            //TODO fileName: `customerDataBase-${new Date()}`,
                            delimiter: ';',
                            utf8WithBom: true,
                            allColumns: true,
                            includeHeaders: true,
                        },
                        printOptions: {
                            //https://mui.com/x/api/data-grid/grid-print-export-options/
                        },
                    },
                },
                props.slotProps
            )}
            experimentalFeatures={{ ariaV7: true }}
            /*TODO https://mui.com/x/react-data-grid/style/#striped-rows
            sx={{
                '& .even': {
                    backgroundColor: 'grey',
                },
                '& .odd': {
                    //backgroundColor: 'grey',
                },
            }}
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }*/
        />
    );
}
