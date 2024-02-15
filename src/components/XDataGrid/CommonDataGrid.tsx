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
import { LinearProgressProps } from '@mui/material/LinearProgress/LinearProgress';
import { GridSlotsComponentsProps } from '@mui/x-data-grid/models/gridSlotsComponentsProps';

export type CommonDataGridExposed = {
    actionThenRefresh: (action: () => Promise<unknown>) => void;
};
interface CommonDataGridProps<R extends GridValidRowModel>
    extends Omit<DataGridProps<R>, 'rows' | 'loading'> {
    //rows: Partial<DataGridProps<R>['rows']>;
    loader: () => Promise<R[]>;
    exposesRef: ReturnType<typeof useRef<CommonDataGridExposed>>;
    toolbarExtends?: CustomGridToolbarProps['children'];
}

export default function CommonDataGrid<R extends GridValidRowModel>(
    props: Readonly<CommonDataGridProps<R>>
): ReactElement {
    const { snackError } = useSnackMessage();
    const [data, setData] = useState<R[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false);

    const actionWithLoadingState = useCallback(function actionWithState(
        action: () => Promise<unknown>
    ) {
        //TODO how to block simultaneous calls?
        setLoading(true);
        return action().finally(() => {
            setLoading(false);
        });
    },
    []);

    const { loader } = props; //for eslint who don't understand with usememo
    const loadData = useCallback(
        function loadData() {
            setLoadingRefresh(true);
            actionWithLoadingState(() =>
                loader()
                    .then(setData, (error) => {
                        snackError({
                            messageTxt: error.message,
                            headerId: 'table.error.retrieve',
                        });
                        //TODO what to do with "old" data?
                    })
                    .finally(() => setLoadingRefresh(false))
            );
        },
        [actionWithLoadingState, loader, snackError]
    );

    const actionWithRefresh = useCallback(
        function actionThenRefresh(action: () => Promise<unknown>) {
            actionWithLoadingState(action).then(loadData);
        },
        [actionWithLoadingState, loadData]
    );
    //expose to parent
    useImperativeHandle<CommonDataGridExposed, CommonDataGridExposed>(
        props.exposesRef as Ref<CommonDataGridExposed>,
        () => ({
            actionThenRefresh: actionWithRefresh,
        }),
        [actionWithRefresh]
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
                //toolbar: GridToolbar,
                toolbar: useCallback<FunctionComponent<CustomGridToolbarProps>>(
                    (toolbarProps) => (
                        <CustomToolbar {...toolbarProps} onRefresh={loadData}>
                            {props.toolbarExtends}
                        </CustomToolbar>
                    ),
                    [loadData, props.toolbarExtends]
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
                    loadingOverlay: {
                        variant: loadingRefresh ? 'query' : 'indeterminate',
                    } as LinearProgressProps as GridSlotsComponentsProps['loadingOverlay'],
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
