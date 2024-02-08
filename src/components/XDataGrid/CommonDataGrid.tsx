import { DataGrid, DataGridProps, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { GridValidRowModel } from '@mui/x-data-grid/models/gridRows';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { deepmerge } from '@mui/utils';
import { useSnackMessage } from '@gridsuite/commons-ui';

export default function CommonDataGrid<R extends GridValidRowModel>(
    props: Omit<DataGridProps<R>, 'rows' | 'loading'> & {
        //rows: Partial<DataGridProps<R>['rows']>;
        loader: () => Promise<R[]>;
    }
): ReactElement {
    const { snackError } = useSnackMessage();
    const [data, setData] = useState<R[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { loader } = props; //for eslint who don't understand with usememo
    const loadData = useMemo(
        () =>
            function loadData() {
                setLoading(true);
                loader()
                    .then(setData, (error) => {
                        snackError({
                            messageTxt: error.message,
                            headerId: 'table.error.retrieve',
                        });
                        //TODO what to do with "old" data?
                    })
                    .finally(() => setLoading(false));
            },
        [loader, snackError]
    );

    useEffect(() => {
        //Load data one time at initial render
        loadData();
    }, [loadData]);

    return (
        <DataGrid
            {...props}
            rows={data ?? []}
            loading={loading}
            density="compact"
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
