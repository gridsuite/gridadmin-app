/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, RefObject, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { Cancel, CheckCircle, ManageAccounts, RadioButtonUnchecked } from '@mui/icons-material';
import { GridButton, GridButtonDelete, GridTable, GridTableRef } from '../../components/Grid';
import { userAdminSrv, UserProfile } from '../../services';
import {
    ColDef,
    GetRowIdParams,
    RowDoubleClickedEvent,
    SelectionChangedEvent,
    TextFilterParams,
} from 'ag-grid-community';
import { useSnackMessage } from '@gridsuite/commons-ui';

const defaultColDef: ColDef<UserProfile> = {
    editable: false,
    resizable: true,
    minWidth: 50,
    cellRenderer: 'agAnimateSlideCellRenderer',
    showDisabledCheckboxes: true,
    rowDrag: false,
    sortable: true,
};

export interface ProfilesTableProps {
    gridRef: RefObject<GridTableRef<UserProfile>>;
    onRowDoubleClicked: (event: RowDoubleClickedEvent<UserProfile>) => void;
    setOpenAddProfileDialog: (open: boolean) => void;
}

const ProfilesTable: FunctionComponent<ProfilesTableProps> = (props) => {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const [rowsSelection, setRowsSelection] = useState<UserProfile[]>([]);

    function getRowId(params: GetRowIdParams<UserProfile>): string {
        return params.data.id ? params.data.id : '';
    }

    const onSelectionChanged = useCallback(
        (event: SelectionChangedEvent<UserProfile, {}>) => setRowsSelection(event.api.getSelectedRows() ?? []),
        [setRowsSelection]
    );

    const onAddButton = useCallback(() => props.setOpenAddProfileDialog(true), [props]);

    const deleteProfiles = useCallback(() => {
        let profileNames = rowsSelection.map((userProfile) => userProfile.name);
        return userAdminSrv
            .deleteProfiles(profileNames)
            .catch((error) => {
                if (error.status === 422) {
                    snackError({
                        headerId: 'profiles.table.integrity.error.delete',
                    });
                } else {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'profiles.table.error.delete',
                    });
                }
            })
            .then(() => props.gridRef?.current?.context?.refresh?.());
    }, [props.gridRef, rowsSelection, snackError]);

    const deleteProfilesDisabled = useMemo(() => rowsSelection.length <= 0, [rowsSelection.length]);

    const columns = useMemo(
        (): ColDef<UserProfile>[] => [
            {
                field: 'name',
                cellDataType: 'text',
                flex: 3,
                lockVisible: true,
                filter: true,
                headerName: intl.formatMessage({ id: 'profiles.table.id' }),
                headerTooltip: intl.formatMessage({
                    id: 'profiles.table.id.description',
                }),
                headerCheckboxSelection: true,
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserProfile>,
                editable: false,
            },
            {
                field: 'allParametersLinksValid',
                cellDataType: 'boolean',
                cellStyle: () => ({
                    display: 'flex',
                    alignItems: 'center',
                }),
                cellRenderer: (params: any) => {
                    return params.value == null ? (
                        <RadioButtonUnchecked fontSize="small" />
                    ) : params.value ? (
                        <CheckCircle fontSize="small" color="success" />
                    ) : (
                        <Cancel fontSize="small" color="error" />
                    );
                },
                flex: 1,
                headerName: intl.formatMessage({
                    id: 'profiles.table.validity',
                }),
                headerTooltip: intl.formatMessage({
                    id: 'profiles.table.validity.description',
                }),
                sortable: true,
                filter: true,
                initialSortIndex: 1,
                initialSort: 'asc',
            },
        ],
        [intl]
    );

    return (
        <GridTable<UserProfile, {}>
            ref={props.gridRef}
            dataLoader={userAdminSrv.fetchProfiles}
            columnDefs={columns}
            defaultColDef={defaultColDef}
            gridId="table-profiles"
            getRowId={getRowId}
            rowSelection="multiple"
            onRowDoubleClicked={props.onRowDoubleClicked}
            onSelectionChanged={onSelectionChanged}
        >
            <GridButton
                labelId="profiles.table.toolbar.add.label"
                textId="profiles.table.toolbar.add"
                startIcon={<ManageAccounts fontSize="small" />}
                color="primary"
                onClick={onAddButton}
            />
            <GridButtonDelete onClick={deleteProfiles} disabled={deleteProfilesDisabled} />
        </GridTable>
    );
};
export default ProfilesTable;
