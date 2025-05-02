/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'crypto';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Divider, Grid, type SxProps, type Theme, Typography } from '@mui/material';
import { useSnackMessage } from '@gridsuite/commons-ui';
import type { ColDef, GetRowIdParams, ValueGetterParams } from 'ag-grid-community';
import { type GridTableRef } from '../../components/Grid';
import { Announcement, UserAdminSrv } from '../../services';
import AddAnnouncementForm from './add-announcement-form';
import { DateCellRenderer } from './date-cell-renderer';
import AgGrid from '../../components/Grid/AgGrid';
import { CancelButtonCellRenderer } from './cancel-button-cell-renderer';
import { getErrorMessage } from '../../utils/error';

const stylesLayout = {
    root: { display: 'flex' },
    columnContainer: {
        maxHeight: '60px',
        paddingLeft: '15px',
    },
} as const satisfies Record<string, SxProps<Theme>>;

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

    const convertSeverity = useCallback(
        (severity: string) => {
            if (severity === UserAdminSrv.AnnouncementSeverity.INFO) {
                return intl.formatMessage({ id: 'announcements.severity.INFO' });
            } else if (severity === UserAdminSrv.AnnouncementSeverity.WARN) {
                return intl.formatMessage({ id: 'announcements.severity.WARN' });
            } else {
                return '';
            }
        },
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
                field: 'message',
                cellDataType: 'text',
                flex: 3,
                headerName: intl.formatMessage({ id: 'announcements.table.message' }),
            },
            {
                field: 'startDate',
                cellRenderer: DateCellRenderer,
                flex: 3,
                headerName: intl.formatMessage({ id: 'announcements.table.startDate' }),
            },
            {
                field: 'endDate',
                cellRenderer: DateCellRenderer,
                flex: 3,
                headerName: intl.formatMessage({ id: 'announcements.table.endDate' }),
            },
            {
                field: 'severity',
                cellDataType: 'text',
                flex: 2,
                headerName: intl.formatMessage({ id: 'announcements.severity' }),
                valueGetter: (value: ValueGetterParams) => convertSeverity(value.data.severity),
            },
            {
                field: 'id',
                cellRenderer: CancelButtonCellRenderer,
                cellRendererParams: { onClickHandler: handleDeleteAnnouncement },
                flex: 2,
                headerName: intl.formatMessage({ id: 'announcements.table.cancel' }),
            },
        ],
        [intl, convertSeverity, handleDeleteAnnouncement]
    );

    // Note: using <Stack/> for the columns didn't work
    return (
        <Grid container spacing={1}>
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
                        context={useMemo(() => ({ refresh: loadDataAndSave }), [loadDataAndSave])}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
