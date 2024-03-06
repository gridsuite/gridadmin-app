/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { FunctionComponent, useMemo, useRef } from 'react';
import DataGrid, { DataGridRef } from '../../components/Grid/DataGrid';
import { UserAdminSrv, UserConnection } from '../../services';
import { GetRowIdParams } from 'ag-grid-community/dist/lib/interfaces/iCallbackParams';
import { AgColDef, GridColumnTypes } from '../../components/Grid';

function getRowId(params: GetRowIdParams<UserConnection>): string {
    return params.data.sub;
}

export const ConnectionsPage: FunctionComponent = () => {
    const intl = useIntl();
    const gridRef = useRef<DataGridRef<UserConnection>>(null);

    const columns: AgColDef<UserConnection>[] = useMemo(
        () => [
            {
                field: 'sub',
                cellDataType: 'text',
                flex: 2,
                headerName: intl.formatMessage({ id: 'table.id' }),
                headerTooltip: intl.formatMessage({
                    id: 'connections.table.id.description',
                }),
                filter: true,
                lockVisible: true,
            },
            {
                field: 'firstConnection',
                type: GridColumnTypes.Timestamp,
                flex: 3,
                headerName: intl.formatMessage({
                    id: 'connections.table.firstConnection',
                }),
                headerTooltip: intl.formatMessage({
                    id: 'connections.table.firstConnection.description',
                }),
                valueGetter: (params) =>
                    params.data?.firstConnection &&
                    new Date(params.data?.firstConnection),
                //filter: true,
                //TODO valueFormatter "2023-09-05T21:42:18.100151Z"
            },
            {
                field: 'lastConnection',
                type: GridColumnTypes.Timestamp,
                flex: 3,
                headerName: intl.formatMessage({
                    id: 'connections.table.lastConnection',
                }),
                headerTooltip: intl.formatMessage({
                    id: 'connections.table.lastConnection.description',
                }),
                valueGetter: (params) =>
                    params.data?.lastConnection &&
                    new Date(params.data?.lastConnection),
                //filter: true,
            },
            {
                field: 'isAccepted',
                cellDataType: 'boolean',
                flex: 1,
                headerName: intl.formatMessage({
                    id: 'connections.table.allowed',
                }),
                headerTooltip: intl.formatMessage({
                    id: 'connections.table.allowed.description',
                }),
                sortable: false,
                filter: true,
                /*renderCell: (params) => <BoolValue value={params.value} />,
                headerAlign: 'left',
                */
            },
        ],
        [intl]
    );
    return (
        <Grid item container direction="column" spacing={2} component="section">
            <Grid item xs="auto" component="header">
                <Typography variant="h2">
                    <FormattedMessage id="connections.title" />
                </Typography>
            </Grid>
            <Grid item xs sx={{ width: 1 }} component="main">
                <DataGrid<UserConnection>
                    accessRef={gridRef}
                    dataLoader={UserAdminSrv.fetchUsersConnections}
                    columnDefs={columns}
                    gridId="grid-connections"
                    getRowId={getRowId}
                />
            </Grid>
        </Grid>
    );
};
export default ConnectionsPage;
