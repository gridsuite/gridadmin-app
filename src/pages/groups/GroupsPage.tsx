/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    InputAdornment,
    TextField,
} from '@mui/material';
import { AccountCircle, GroupAdd } from '@mui/icons-material';
import { GridButton, GridButtonDelete, GridTable, GridTableRef } from '../../components/Grid';
import { UserAdminSrv, GroupInfos, UserInfos, UpdateGroupInfos } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ColDef, GetRowIdParams, SelectionChangedEvent, TextFilterParams, ICellEditorParams } from 'ag-grid-community';
import PaperForm from '../common/paper-form';
import DeleteConfirmationDialog from '../common/delete-confirmation-dialog';
import MultiSelectEditorComponent from '../common/multi-select-editor-component';
import MultiChipsRendererComponent from '../common/multi-chips-renderer-component';
import { UUID } from 'crypto';

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

    const addGroup = useCallback(
        (group: string) => {
            UserAdminSrv.addGroup(group)
                .catch((error) =>
                    snackError({
                        messageTxt: `Error while adding group "${group}"${error.message && ':\n' + error.message}`,
                        headerId: 'groups.table.error.add',
                    })
                )
                .then(() => gridContext?.refresh?.());
        },
        [gridContext, snackError]
    );
    const { handleSubmit, control, reset, clearErrors } = useForm<{
        group: string;
    }>({
        defaultValues: { group: '' }, //need default not undefined value for html input, else react error at runtime
    });
    const [open, setOpen] = useState(false);
    const [showDeletionDialog, setShowDeletionDialog] = useState(false);
    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    };
    const onSubmit: SubmitHandler<{ group: string }> = (data) => {
        addGroup(data.group.trim());
        handleClose();
    };
    const onSubmitForm = handleSubmit(onSubmit);

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
                        onClick={useCallback(() => setOpen(true), [])}
                    />
                    <GridButtonDelete onClick={() => setShowDeletionDialog(true)} disabled={deleteGroupsDisabled} />
                </GridTable>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={(props) => <PaperForm untypedProps={props} onSubmit={onSubmitForm} />}
                >
                    <DialogTitle>
                        <FormattedMessage id="groups.form.title" />
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <FormattedMessage id="groups.form.content" />
                        </DialogContentText>
                        <Controller
                            name="group"
                            control={control}
                            rules={{ required: true, minLength: 1 }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    autoFocus
                                    required
                                    margin="dense"
                                    label={<FormattedMessage id="groups.form.field.group.label" />}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    inputMode="text"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle />
                                            </InputAdornment>
                                        ),
                                    }}
                                    error={fieldState?.invalid}
                                    helperText={fieldState?.error?.message}
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            <FormattedMessage id="cancel" />
                        </Button>
                        <Button type="submit">
                            <FormattedMessage id="ok" />
                        </Button>
                    </DialogActions>
                </Dialog>

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
