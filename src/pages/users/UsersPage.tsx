import { FunctionComponent, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GridColDef } from '@mui/x-data-grid';
import { Grid, Typography } from '@mui/material';
import CommonDataGrid from '../../components/XDataGrid/CommonDataGrid';
import { UserAdminSrv, UserInfos } from '../../services';

function getRowId(row: UserInfos) {
    return row.sub;
}

const UsersPage: FunctionComponent = () => {
    //const data = useLoaderData() as DeferredData;
    const intl = useIntl();
    const columns: GridColDef<UserInfos>[] = useMemo(
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
                field: 'isAdmin',
                headerName: intl.formatMessage({
                    id: 'users.table.isAdmin',
                }),
                description: intl.formatMessage({
                    id: 'users.table.isAdmin.description',
                }),
                type: 'boolean',
                sortable: false,
                flex: 0.15,
                editable: false,
                filterable: true,
            },
        ],
        [intl]
    );
    return (
        <Grid item container direction="column" spacing={2}>
            <Grid item xs="auto">
                <Typography variant="h2">
                    <FormattedMessage id="users.title" />
                </Typography>
            </Grid>
            <Grid item xs>
                <CommonDataGrid
                    loader={UserAdminSrv.fetchUsers}
                    columns={columns}
                    getRowId={getRowId}
                    ignoreDiacritics
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    initialState={{
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterExcludeHiddenColumns: true,
                            },
                        },
                    }}
                />
            </Grid>
        </Grid>
    );
};
export default UsersPage;
