import { GridColDef } from '@mui/x-data-grid';
import { Chip, ChipProps, Grid, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { FunctionComponent, useMemo } from 'react';
import { Check, Close, QuestionMark } from '@mui/icons-material';
import CommonDataGrid from '../../components/XDataGrid/CommonDataGrid';

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

const dataExample: ConnectionRow[] = [
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
];
export const ConnectionsPage: FunctionComponent = () => {
    const intl = useIntl();
    const columns: GridColDef<ConnectionRow>[] = useMemo(
        () => [
            {
                field: 'sub',
                headerName: intl.formatMessage({ id: 'table.id' }),
                description: intl.formatMessage({
                    id: 'table.id.description',
                }),
                type: 'string',
                flex: 0.25,
                editable: false,
                filterable: true,
                hideable: false,
            },
            {
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
                editable: false,
                filterable: true,
                //TODO valueFormatter
            },
            {
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
                editable: false,
                filterable: true,
                //TODO valueFormatter
            },
            {
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
                editable: false,
                filterable: true,
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
                <CommonDataGrid
                    rows={dataExample}
                    columns={columns}
                    getRowId={getRowId}
                />
            </Grid>
        </Grid>
    );
};
export default ConnectionsPage;
