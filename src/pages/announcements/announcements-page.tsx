/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'node:crypto';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Divider, Grid, Typography } from '@mui/material';
import { useSnackMessage } from '@gridsuite/commons-ui';
import type { ColDef, GetRowIdParams, ValueFormatterFunc } from 'ag-grid-community';
import { type GridTableRef } from '../../components/Grid';
import { Announcement, UserAdminSrv } from '../../services';
import AddAnnouncementForm from './add-announcement-form';
import AgGrid from '../../components/Grid/AgGrid';
import CancelCellRenderer from './cancel-cell-renderer';
import { getErrorMessage } from '../../utils/error';

const defaultColDef: ColDef<Announcement> = {
    editable: false,
    resizable: true,
    minWidth: 50,
    cellRenderer: 'agAnimateSlideCellRenderer',
    rowDrag: false,
    sortable: true,
    lockVisible: true,
};

function getRowId(params: GetRowIdParams<Announcement>) {
    return params.data.id;
}

export default function AnnouncementsPage() {
    const intl = useIntl();
    const gridRef = useRef<GridTableRef<Announcement>>(null);
    const { snackError } = useSnackMessage();

    const [data, setData] = useState<Announcement[] | null>(null);

    const loadDataAndSave = useCallback(async (): Promise<void> => {
        try {
            setData(await UserAdminSrv.fetchAnnouncementList());
        } catch (error) {
            snackError({ messageTxt: getErrorMessage(error) ?? undefined, headerId: 'table.error.retrieve' });
        }
    }, [snackError]);

    const renderSeverity = useCallback<NonNullable<ValueFormatterFunc<Announcement, string>>>(
        (params) => {
            switch (params.value) {
                case UserAdminSrv.AnnouncementSeverity.INFO:
                    return intl.formatMessage({ id: 'announcements.severity.INFO' });
                case UserAdminSrv.AnnouncementSeverity.WARN:
                    return intl.formatMessage({ id: 'announcements.severity.WARN' });
                default:
                    return params.value || '';
            }
        },
        [intl]
    );

    const renderDate = useCallback<NonNullable<ValueFormatterFunc<Announcement, string>>>(
        (params) => (params.value ? intl.formatDate(params.value, { dateStyle: 'short', timeStyle: 'short' }) : ''),
        [intl]
    );

    const refreshGrid = useCallback(() => {
        gridRef.current?.context?.refresh?.();
    }, []);

    const handleDeleteAnnouncement = useCallback(
        (announcementId: UUID) => {
            UserAdminSrv.deleteAnnouncement(announcementId).then(refreshGrid);
        },
        [refreshGrid]
    );

    const columns = useMemo(
        (): ColDef<Announcement>[] => [
            {
                field: 'startDate',
                valueFormatter: renderDate,
                headerName: intl.formatMessage({ id: 'announcements.table.startDate' }),
                sort: 'asc',
                sortIndex: 1,
                initialWidth: 150,
            },
            {
                field: 'endDate',
                valueFormatter: renderDate,
                headerName: intl.formatMessage({ id: 'announcements.table.endDate' }),
                sort: 'asc',
                sortIndex: 2,
                initialWidth: 150,
            },
            {
                field: 'severity',
                valueFormatter: renderSeverity,
                headerName: intl.formatMessage({ id: 'announcements.severity' }),
                initialWidth: 150,
            },
            {
                field: 'message',
                cellDataType: 'text',
                flex: 1,
                headerName: intl.formatMessage({ id: 'announcements.table.message' }),
            },
            {
                field: 'id',
                cellRenderer: CancelCellRenderer,
                cellRendererParams: { onClickHandler: handleDeleteAnnouncement },
                headerName: '',
                initialWidth: 70,
            },
        ],
        [renderDate, intl, handleDeleteAnnouncement, renderSeverity]
    );

    const gridContext = useMemo(() => ({ refresh: loadDataAndSave }), [loadDataAndSave]);

    // Note: using <Stack/> for the columns didn't work
    return (
        <Grid container spacing={2} p={1} height={'100%'}>
            <Grid item container direction="column" xs={12} sm={6} md={4}>
                <Grid item xs="auto">
                    <Typography variant="subtitle1">
                        <FormattedMessage id="announcements.programNewMessage" />
                    </Typography>
                </Grid>
                <Grid item xs="auto">
                    <Divider sx={{ mt: 0.5, mb: 1.5 }} />
                </Grid>
                <Grid item xs>
                    <AddAnnouncementForm onAnnouncementCreated={refreshGrid} />
                </Grid>
            </Grid>
            <Grid item container direction="column" xs={12} sm={6} md={8}>
                <Grid item xs="auto">
                    <Typography variant="subtitle1" mb={0.5}>
                        <FormattedMessage id="announcements.programmedMessage" />
                    </Typography>
                </Grid>
                <Grid item xs>
                    <AgGrid<Announcement>
                        ref={gridRef}
                        rowData={data}
                        alwaysShowVerticalScroll
                        onGridReady={loadDataAndSave}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        gridId="table-announcements"
                        getRowId={getRowId}
                        context={gridContext}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
