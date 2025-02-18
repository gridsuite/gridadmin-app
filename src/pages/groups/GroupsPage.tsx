/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Grid } from '@mui/material';
import { GroupAdd } from '@mui/icons-material';
import { GridButton, GridButtonDelete, GridTable, GridTableRef } from '../../components/Grid';
import { UserAdminSrv, GroupInfos, UserInfos, UpdateGroupInfos } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { ColDef, GetRowIdParams, SelectionChangedEvent, TextFilterParams, ICellEditorParams } from 'ag-grid-community';
import DeleteConfirmationDialog from '../common/delete-confirmation-dialog';
import MultiSelectEditorComponent from '../common/multi-select-editor-component';
import MultiChipsRendererComponent from '../common/multi-chips-renderer-component';
import { UUID } from 'crypto';
import AddGroupDialog from './add-group-dialog';

const defaultColDef: ColDef<GroupInfos> = {
    editable: false,
    resizable: true,
    minWidth: 50,
    cellRenderer: 'agAnimateSlideCellRenderer',
    rowDrag: false,
    sortable: true,
};

function getRowId(params: GetRowIdParams<GroupInfos>): string {
    return params.data.name;
}

const GroupsPage: FunctionComponent = () => {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const gridRef = useRef<GridTableRef<GroupInfos>>(null);
    const gridContext = gridRef.current?.context;
    const [usersOptions, setUsersOptions] = useState<string[]>([]);
    const [openAddGroupDialog, setOpenAddGroupDialog] = useState(false);

    useEffect(() => {
        UserAdminSrv.fetchUsers()
            .then((allUsers: UserInfos[]) => {
                const users = allUsers?.map((u) => u.sub) || [];
                setUsersOptions(users);
            })
            .catch((error) =>
                snackError({
                    messageTxt: error.message,
                    headerId: 'groups.table.error.users',
                })
            );
    }, [snackError]);

    const updateGroupCallback = useCallback(
        (id: UUID, name: string, users: string[]) => {
            const newData: UpdateGroupInfos = {
                id: id,
                name: name,
                users: users,
            };
            UserAdminSrv.udpateGroup(newData)
                .catch((error) =>
                    snackError({
                        messageTxt: error.message,
                        headerId: 'groups.table.error.update',
                    })
                )
                .then(() => gridContext?.refresh?.());
        },
        [gridContext, snackError]
    );

    const columns = useMemo(
        (): ColDef<GroupInfos>[] => [
            {
                field: 'name',
                cellDataType: 'text',
                flex: 3,
                lockVisible: true,
                filter: true,
                headerName: intl.formatMessage({ id: 'groups.table.id' }),
                headerTooltip: intl.formatMessage({
                    id: 'groups.table.id.description',
                }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<GroupInfos>,
                initialSort: 'asc',
            },
            {
                field: 'users',
                cellDataType: 'text',
                flex: 1,
                filter: true,
                headerName: intl.formatMessage({
                    id: 'groups.table.users',
                }),
                headerTooltip: intl.formatMessage({
                    id: 'groups.table.users.description',
                }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserInfos>,
                editable: true,
                cellRenderer: MultiChipsRendererComponent,
                cellEditor: MultiSelectEditorComponent,
                cellEditorParams: (params: ICellEditorParams<GroupInfos>) => ({
                    options: usersOptions,
                    setValue: (values: string[]) => {
                        if (params.data?.id) {
                            updateGroupCallback(params.data.id, params.data.name, values);
                        }
                    },
                }),
            },
        ],
        [intl, usersOptions, updateGroupCallback]
    );

    const [rowsSelection, setRowsSelection] = useState<GroupInfos[]>([]);
    const deleteGroups = useCallback((): Promise<void> | undefined => {
        let groupNames = rowsSelection.map((group) => group.name);
        return UserAdminSrv.deleteGroups(groupNames)
            .catch((error) =>
                snackError({
                    messageTxt: error.message,
                    headerId: 'groups.table.error.delete',
                })
            )
            .then(() => gridContext?.refresh?.());
    }, [gridContext, rowsSelection, snackError]);
    const deleteGroupsDisabled = useMemo(() => rowsSelection.length <= 0, [rowsSelection.length]);
    const [showDeletionDialog, setShowDeletionDialog] = useState(false);

    return (
        <Grid item container direction="column" spacing={2} component="section">
            <Grid item container xs sx={{ width: 1 }}>
                <GridTable<GroupInfos, {}>
                    ref={gridRef}
                    dataLoader={UserAdminSrv.fetchGroups}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    stopEditingWhenCellsLoseFocus={true}
                    gridId="table-groups"
                    getRowId={getRowId}
                    rowSelection={{
                        mode: 'multiRow',
                        enableClickSelection: false,
                        checkboxes: true,
                        headerCheckbox: true,
                        hideDisabledCheckboxes: false,
                    }}
                    onSelectionChanged={useCallback(
                        (event: SelectionChangedEvent<GroupInfos, {}>) =>
                            setRowsSelection(event.api.getSelectedRows() ?? []),
                        []
                    )}
                >
                    <GridButton
                        labelId="groups.table.toolbar.add.label"
                        textId="groups.table.toolbar.add"
                        startIcon={<GroupAdd fontSize="small" />}
                        color="primary"
                        onClick={useCallback(() => setOpenAddGroupDialog(true), [])}
                    />
                    <GridButtonDelete onClick={() => setShowDeletionDialog(true)} disabled={deleteGroupsDisabled} />
                </GridTable>
                <AddGroupDialog gridRef={gridRef} open={openAddGroupDialog} setOpen={setOpenAddGroupDialog} />
                <DeleteConfirmationDialog
                    open={showDeletionDialog}
                    setOpen={setShowDeletionDialog}
                    itemType={intl.formatMessage({ id: 'form.delete.dialog.group' })}
                    itemNames={rowsSelection.map((group) => group.name)}
                    deleteFunc={deleteGroups}
                />
            </Grid>
        </Grid>
    );
};
export default GroupsPage;
