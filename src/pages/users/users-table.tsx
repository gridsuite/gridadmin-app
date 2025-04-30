/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, RefObject, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { PersonAdd } from '@mui/icons-material';
import { GridButton, GridButtonDelete, GridTable, GridTableRef } from '../../components/Grid';
import { GroupInfos, UserAdminSrv, UserInfos } from '../../services';
import {
    ColDef,
    GetRowIdParams,
    ICheckboxCellRendererParams,
    ITooltipParams,
    RowClickedEvent,
    SelectionChangedEvent,
    TextFilterParams,
} from 'ag-grid-community';
import { useSnackMessage } from '@gridsuite/commons-ui';
import DeleteConfirmationDialog from '../common/delete-confirmation-dialog';
import { defaultColDef, defaultRowSelection } from '../common/table-config';

export interface UsersTableProps {
    gridRef: RefObject<GridTableRef<UserInfos>>;
    onRowClicked: (event: RowClickedEvent<UserInfos>) => void;
    setOpenAddUserDialog: (open: boolean) => void;
}

const UsersTable: FunctionComponent<UsersTableProps> = (props) => {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const [rowsSelection, setRowsSelection] = useState<UserInfos[]>([]);
    const [showDeletionDialog, setShowDeletionDialog] = useState(false);

    function getRowId(params: GetRowIdParams<UserInfos>): string {
        return params.data.sub ?? '';
    }

    const onSelectionChanged = useCallback(
        (event: SelectionChangedEvent<UserInfos, {}>) => setRowsSelection(event.api.getSelectedRows() ?? []),
        [setRowsSelection]
    );

    const onAddButton = useCallback(() => props.setOpenAddUserDialog(true), [props]);

    const deleteUsers = useCallback(() => {
        let subs = rowsSelection.map((user) => user.sub);
        return UserAdminSrv.deleteUsers(subs)
            .catch((error) =>
                snackError({
                    messageTxt: error.message,
                    headerId: 'users.table.error.delete',
                })
            )
            .then(() => props.gridRef?.current?.context?.refresh?.());
    }, [props.gridRef, rowsSelection, snackError]);

    const deleteUsersDisabled = useMemo(() => rowsSelection.length <= 0, [rowsSelection.length]);

    const columns = useMemo(
        (): ColDef<UserInfos>[] => [
            {
                field: 'sub',
                cellDataType: 'text',
                flex: 2,
                lockVisible: true,
                filter: true,
                headerName: intl.formatMessage({ id: 'users.table.id' }),
                headerTooltip: intl.formatMessage({
                    id: 'users.table.id.description',
                }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserInfos>,
                initialSort: 'asc',
            },
            {
                field: 'profileName',
                cellDataType: 'text',
                flex: 2,
                filter: true,
                headerName: intl.formatMessage({
                    id: 'users.table.profileName',
                }),
                headerTooltip: intl.formatMessage({
                    id: 'users.table.profileName.description',
                }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserInfos>,
            },
            {
                field: 'groups',
                cellDataType: 'text',
                flex: 3,
                filter: true,
                headerName: intl.formatMessage({
                    id: 'users.table.groups',
                }),
                headerTooltip: intl.formatMessage({
                    id: 'users.table.groups.description',
                }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<GroupInfos>,
                tooltipValueGetter: (p: ITooltipParams) => {
                    const items = p.value as string[];
                    if (items == null || items.length === 0) {
                        return '';
                    }
                    let groupWord = intl.formatMessage({
                        id: 'form.delete.dialog.group',
                    });
                    if (items.length > 1) {
                        groupWord = groupWord.concat('s');
                    }
                    return `${items.length} ${groupWord}`;
                },
            },
            {
                field: 'isAdmin',
                cellDataType: 'boolean',
                //detected as cellRenderer: 'agCheckboxCellRenderer',
                cellRendererParams: {
                    disabled: true,
                } as ICheckboxCellRendererParams<UserInfos, {}>,
                flex: 1,
                headerName: intl.formatMessage({
                    id: 'users.table.isAdmin',
                }),
                headerTooltip: intl.formatMessage({
                    id: 'users.table.isAdmin.description',
                }),
                filter: true,
            },
        ],
        [intl]
    );

    return (
        <>
            <GridTable<UserInfos, {}>
                ref={props.gridRef}
                dataLoader={UserAdminSrv.fetchUsers}
                columnDefs={columns}
                defaultColDef={defaultColDef}
                gridId="table-users"
                getRowId={getRowId}
                rowSelection={defaultRowSelection}
                onRowClicked={props.onRowClicked}
                onSelectionChanged={onSelectionChanged}
                tooltipShowDelay={1000}
            >
                <GridButton
                    labelId="users.table.toolbar.add.label"
                    textId="users.table.toolbar.add"
                    startIcon={<PersonAdd fontSize="small" />}
                    color="primary"
                    onClick={onAddButton}
                />
                <GridButtonDelete onClick={() => setShowDeletionDialog(true)} disabled={deleteUsersDisabled} />
            </GridTable>

            <DeleteConfirmationDialog
                open={showDeletionDialog}
                setOpen={setShowDeletionDialog}
                itemType={intl.formatMessage({ id: 'form.delete.dialog.user' })}
                itemNames={rowsSelection.map((user) => user.sub)}
                deleteFunc={deleteUsers}
            />
        </>
    );
};
export default UsersTable;
