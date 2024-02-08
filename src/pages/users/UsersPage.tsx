import { FunctionComponent, useCallback, useMemo, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Grid, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import CommonDataGrid, {
    CommonDataGridExposed,
} from '../../components/XDataGrid/CommonDataGrid';
import { UserAdminSrv, UserInfos } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';

function getRowId(row: UserInfos) {
    return row.sub;
}

const UsersPage: FunctionComponent = () => {
    //const data = useLoaderData() as DeferredData;
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const gridRef = useRef<CommonDataGridExposed>();
    const deleteUser = useCallback(
        (id: string) => () =>
            gridRef.current?.actionThenRefresh(() =>
                UserAdminSrv.deleteUser(id).then(
                    (success) =>
                        snackError({
                            messageTxt: `Error while deleting user ${id}`,
                            headerId: 'table.error.delete',
                        }),
                    (error) =>
                        snackError({
                            messageTxt: error.message,
                            headerId: 'table.error.delete',
                        })
                )
            ),
        [snackError]
    );
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
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={deleteUser(params.row.sub)}
                    />,
                ],
            },
        ],
        [intl, deleteUser]
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
                    exposesRef={gridRef}
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
