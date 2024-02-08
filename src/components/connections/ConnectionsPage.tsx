import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import {
    Chip,
    ChipProps,
    Grid,
    LinearProgress,
    Typography,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { FunctionComponent, useMemo } from 'react';
import { Check, Close, QuestionMark } from '@mui/icons-material';
import CustomNoRowsOverlay from '../DataGrid/CustomNoRowsOverlay';

type ConnectionRow = {
    sub: string;
    firstConnection: string; //Datetime
    lastConnection: string; //Datetime
    allowed: boolean;
};

function getRowId(row: ConnectionRow) {
    return row.sub;
}

const BoolValue: FunctionComponent<{
    value: boolean | null | undefined;
}> = (props, context) => {
    const conf = ((value: unknown): Partial<ChipProps> => {
        switch (value) {
            case true:
                return {
                    label: (
                        <FormattedMessage id="connections.table.allowed.yes" />
                    ),
                    icon: <Check fontSize="small" color="success" />,
                    color: 'success',
                };
            case false:
                return {
                    label: (
                        <FormattedMessage id="connections.table.allowed.no" />
                    ),
                    icon: <Close fontSize="small" color="error" />,
                    color: 'error',
                };
            default:
                return {
                    label: (
                        <FormattedMessage id="connections.table.allowed.unknown" />
                    ),
                    icon: <QuestionMark fontSize="small" />,
                };
        }
    })(props.value);
    return <Chip variant="outlined" size="small" {...conf} />;
};

const commonColDef: Partial<GridColDef<ConnectionRow>> = {
    editable: false,
    filterable: true,
    //minWidth: 50,
    //width: 100,
};

const ConnectionsPage: FunctionComponent = () => {
    const intl = useIntl();
    const columns: GridColDef<ConnectionRow>[] = useMemo(
        () => [
            {
                ...commonColDef,
                field: 'sub',
                headerName: intl.formatMessage({ id: 'connections.table.id' }),
                description: intl.formatMessage({
                    id: 'connections.table.id.description',
                }),
                type: 'string',
                flex: 0.25,
                hideable: false,
            },
            {
                ...commonColDef,
                field: 'firstConnection',
                headerName: intl.formatMessage({
                    id: 'connections.table.firstConnection',
                }),
                description: intl.formatMessage({
                    id: 'connections.table.firstConnection.description',
                }),
                type: 'dateTime',
                valueGetter: ({ value }) => value && new Date(value),
                flex: 0.3,
            },
            {
                ...commonColDef,
                field: 'lastConnection',
                headerName: intl.formatMessage({
                    id: 'connections.table.lastConnection',
                }),
                description: intl.formatMessage({
                    id: 'connections.table.lastConnection.description',
                }),
                type: 'dateTime',
                valueGetter: ({ value }) => value && new Date(value),
                flex: 0.3,
                //TODO valueFormatter
            },
            {
                ...commonColDef,
                field: 'allowed',
                headerName: intl.formatMessage({
                    id: 'connections.table.allowed',
                }),
                description: intl.formatMessage({
                    id: 'connections.table.allowed.description',
                }),
                type: 'boolean',
                sortable: false,
                flex: 0.15,
                renderCell: (params) => <BoolValue value={params.value} />,
                headerAlign: 'left',
                align: 'left',
            },
        ],
        [intl]
    );
    return (
        <Grid item container direction="column" spacing={2}>
            <Grid item xs="auto">
                <Typography variant="h2">
                    <FormattedMessage id="connections.title" />
                </Typography>
            </Grid>
            <Grid item xs>
                <DataGrid
                    rows={[
                        {
                            sub: 'test',
                            firstConnection: `${new Date()}`,
                            lastConnection: `${new Date()}`,
                            allowed: true,
                        },
                        {
                            sub: 'test2',
                            firstConnection: `${new Date()}`,
                            lastConnection: `${new Date()}`,
                            allowed: true,
                        },
                        {
                            sub: 'test3',
                            firstConnection: `${new Date()}`,
                            lastConnection: `${new Date()}`,
                            allowed: false,
                        },
                    ]}
                    columns={columns}
                    getRowId={getRowId}
                    density="compact"
                    //TODO loading={false}
                    slots={{
                        toolbar: GridToolbar, //TODO (des)active as app parameter
                        loadingOverlay: LinearProgress,
                        noRowsOverlay: CustomNoRowsOverlay,
                        //TODO noResultsOverlay: ...
                    }}
                    slotProps={{
                        toolbar: {
                            csvOptions: {
                                //https://mui.com/x/api/data-grid/grid-print-export-options/
                                //TOSO fileName: `customerDataBase-${new Date()}`,
                                delimiter: ';',
                                utf8WithBom: true,
                                allColumns: true,
                                includeHeaders: true,
                            },
                            printOptions: {
                                //https://mui.com/x/api/data-grid/grid-print-export-options/
                            },
                        },
                    }}
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
            </Grid>
        </Grid>
    );
};
export default ConnectionsPage;
