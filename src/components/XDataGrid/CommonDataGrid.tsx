import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { GridValidRowModel } from '@mui/x-data-grid/models/gridRows';
import {
    FunctionComponent,
    ReactElement,
    Ref,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { deepmerge } from '@mui/utils';
import { useSnackMessage } from '@gridsuite/commons-ui';
import CustomToolbar, { CustomGridToolbarProps } from './CustomToolbar';

export type CommonDataGridExposed = {
    actionThenRefresh: (action: () => Promise<unknown>) => void;
};
interface CommonDataGridProps<R extends GridValidRowModel>
    extends Omit<DataGridProps<R>, 'rows' | 'loading'> {
    //rows: Partial<DataGridProps<R>['rows']>;
    loader: () => Promise<R[]>;
    exposesRef: ReturnType<typeof useRef<CommonDataGridExposed>>;
}

export default function CommonDataGrid<R extends GridValidRowModel>(
    props: Readonly<CommonDataGridProps<R>>
): ReactElement {
    const { snackError } = useSnackMessage();
    const [data, setData] = useState<R[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const actionWithRefresh = useCallback(function action(
        action: () => Promise<unknown>
    ) {
        //TODO how to block simultaneous calls?
        setLoading(true);
        action().finally(() => setLoading(false));
    },
    []);

    const { loader } = props; //for eslint who don't understand with usememo
    const loadData = useCallback(
        function loadData() {
            actionWithRefresh(() =>
                loader().then(setData, (error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'table.error.retrieve',
                    });
                    //TODO what to do with "old" data?
                })
            );
        },
        [actionWithRefresh, loader, snackError]
    );

    useEffect(() => {
        //Load data one time at initial render
        loadData();
    }, [loadData]);

    //expose to parent
    useImperativeHandle<CommonDataGridExposed, CommonDataGridExposed>(
        props.exposesRef as Ref<CommonDataGridExposed>,
        () => ({
            actionThenRefresh: actionWithRefresh,
        }),
        [actionWithRefresh]
    );
    return (
        <DataGrid
            {...props}
            rows={data ?? []}
            loading={loading}
            density="compact"
            slots={{
                //toolbar: GridToolbar,
                toolbar: useCallback<FunctionComponent<CustomGridToolbarProps>>(
                    (props) => <CustomToolbar {...props} refresh={loadData} />,
                    [loadData]
                ),
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
