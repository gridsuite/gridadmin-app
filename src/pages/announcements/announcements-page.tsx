/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { UUID } from 'crypto';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Grid, type SxProps, type Theme } from '@mui/material';
import { useSnackMessage } from '@gridsuite/commons-ui';
import type { ColDef, GetRowIdParams, ValueGetterParams } from 'ag-grid-community';
import { type GridTableRef } from '../../components/Grid';
import { Announcement, UserAdminSrv } from '../../services';
import AddAnnouncementForm from './add-announcement-form';
import { DateCellRenderer } from './date-cell-renderer';
import AgGrid from '../../components/Grid/AgGrid';
import { CancelButtonCellRenderer } from './cancel-button-cell-renderer';

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
};

function getRowId(params: GetRowIdParams<Announcement>) {
    return params.data.id;
}

export default function AnnouncementsPage() {
    const intl = useIntl();
    const gridRef = useRef<GridTableRef<Announcement>>(null);

    const { snackError } = useSnackMessage();

    const [data, setData] = useState<Announcement[] | null>(null);

    const loadDataAndSave = useCallback(
        function loadDataAndSave(): Promise<void> {
            return UserAdminSrv.fetchAnnouncementList().then(setData, (error) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'table.error.retrieve',
                });
            });
        },
        [snackError]
    );

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
                lockVisible: true,
                headerName: intl.formatMessage({ id: 'announcements.table.message' }),
            },
            {
                field: 'startDate',
                cellRenderer: DateCellRenderer,
                flex: 3,
                lockVisible: true,
                headerName: intl.formatMessage({ id: 'announcements.table.startDate' }),
            },
            {
                field: 'endDate',
                cellRenderer: DateCellRenderer,
                flex: 3,
                lockVisible: true,
                headerName: intl.formatMessage({ id: 'announcements.table.endDate' }),
            },
            {
                field: 'severity',
                cellDataType: 'text',
                flex: 2,
                lockVisible: true,
                headerName: intl.formatMessage({ id: 'announcements.severity' }),
                valueGetter: (value: ValueGetterParams) => convertSeverity(value.data.severity),
            },
            {
                field: 'id',
                cellRenderer: CancelButtonCellRenderer,
                cellRendererParams: {
                    onClickHandler: handleDeleteAnnouncement,
                },
                flex: 2,
                lockVisible: true,
                headerName: intl.formatMessage({ id: 'announcements.table.cancel' }),
            },
        ],
        [intl, convertSeverity, handleDeleteAnnouncement]
    );

    return (
        <Grid container direction="column" sx={stylesLayout.root}>
            <Grid container item xs={3} direction="column">
                <Grid item xs sx={stylesLayout.columnContainer}>
                    <h3>
                        <FormattedMessage id="announcements.programNewMessage"></FormattedMessage>
                    </h3>
                </Grid>
                <Grid item xs paddingX="15px">
                    <AddAnnouncementForm onAnnouncementCreated={refreshGrid} />
                </Grid>
            </Grid>

            <Grid container item xs direction="column" marginBottom="15px">
                <Grid item sx={stylesLayout.columnContainer}>
                    <h3>
                        <FormattedMessage id="announcements.programmedMessage" />
                    </h3>
                </Grid>
                <Grid container item xs paddingX="15px">
                    <Grid item xs>
                        <AgGrid<Announcement>
                            ref={gridRef}
                            rowData={data}
                            alwaysShowVerticalScroll
                            onGridReady={loadDataAndSave}
                            columnDefs={columns}
                            defaultColDef={defaultColDef}
                            gridId="table-banners"
                            getRowId={getRowId}
                            context={useMemo(() => ({ refresh: loadDataAndSave }), [loadDataAndSave])}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
