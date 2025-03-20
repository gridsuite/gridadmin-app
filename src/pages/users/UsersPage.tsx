/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
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
import { AccountCircle, PersonAdd } from '@mui/icons-material';
import { GridButton, GridButtonDelete, GridTable, GridTableRef } from '../../components/Grid';
import { GroupInfos, UpdateUserInfos, UserAdminSrv, UserInfos, UserProfile } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    CellEditingStoppedEvent,
    ColDef,
    GetRowIdParams,
    ICellEditorParams,
    ICheckboxCellRendererParams,
    SelectionChangedEvent,
    TextFilterParams,
} from 'ag-grid-community';
import PaperForm from '../common/paper-form';
import DeleteConfirmationDialog from '../common/delete-confirmation-dialog';
import MultiSelectEditorComponent from '../common/multi-select-editor-component';
import MultiChipsRendererComponent from '../common/multi-chips-renderer-component';

const defaultColDef: ColDef<UserInfos> = {
    editable: false,
    resizable: true,
    minWidth: 50,
    cellRenderer: 'agAnimateSlideCellRenderer', //'agAnimateShowChangeCellRenderer'
    rowDrag: false,
    sortable: true,
};

function getRowId(params: GetRowIdParams<UserInfos>): string {
    return params.data.sub;
}

const UsersPage: FunctionComponent = () => {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const gridRef = useRef<GridTableRef<UserInfos>>(null);
    const gridContext = gridRef.current?.context;
    const [profileNameOptions, setprofileNameOptions] = useState<string[]>([]);
    const [groupsOptions, setGroupsOptions] = useState<string[]>([]);

    useEffect(() => {
        // fetch available profiles
        UserAdminSrv.fetchProfilesWithoutValidityCheck()
            .then((allProfiles: UserProfile[]) => {
                let profiles: string[] = [intl.formatMessage({ id: 'users.table.profile.none' })];
                allProfiles?.forEach((p) => profiles.push(p.name));
                setprofileNameOptions(profiles);
            })
            .catch((error) =>
                snackError({
                    messageTxt: error.message,
                    headerId: 'users.table.error.profiles',
                })
            );

        // fetch available groups
        UserAdminSrv.fetchGroups()
            .then((allGroups: GroupInfos[]) => {
                let groups: string[] = [];
                allGroups?.forEach((g) => groups.push(g.name));
                setGroupsOptions(groups);
            })
            .catch((error) =>
                snackError({
                    messageTxt: error.message,
                    headerId: 'users.table.error.groups',
                })
            );
    }, [intl, snackError]);

    const updateUserCallback = useCallback(
        (sub: string, profileName: string | undefined, isAdmin: boolean | undefined, groups: string[]) => {
            const newData: UpdateUserInfos = {
                sub: sub,
                profileName: profileName,
                isAdmin: isAdmin,
                groups: groups,
            };
            UserAdminSrv.udpateUser(newData)
                .catch((error) =>
                    snackError({
                        messageTxt: error.message,
                        headerId: 'users.table.error.update',
                    })
                )
                .then(() => gridContext?.refresh?.());
        },
        [gridContext, snackError]
    );

    const columns = useMemo(
        (): ColDef<UserInfos>[] => [
            {
                field: 'sub',
                cellDataType: 'text',
                flex: 3,
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
                flex: 1,
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
                editable: true,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: () => {
                    return {
                        values: profileNameOptions,
                        valueListMaxHeight: 400,
                        valueListMaxWidth: 300,
                    };
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
            {
                field: 'groups',
                cellDataType: 'text',
                flex: 1,
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
                editable: true,
                cellRenderer: MultiChipsRendererComponent,
                cellEditor: MultiSelectEditorComponent,
                cellEditorParams: (params: ICellEditorParams<UserInfos>) => ({
                    options: groupsOptions,
                    setValue: (values: string[]) => {
                        if (params.data?.sub) {
                            updateUserCallback(params.data.sub, params.data.profileName, params.data.isAdmin, values);
                        }
                    },
                }),
            },
        ],
        [intl, profileNameOptions, groupsOptions, updateUserCallback]
    );

    const [rowsSelection, setRowsSelection] = useState<UserInfos[]>([]);
    const deleteUsers = useCallback((): Promise<void> | undefined => {
        let subs = rowsSelection.map((user) => user.sub);
        return UserAdminSrv.deleteUsers(subs)
            .catch((error) =>
                snackError({
                    messageTxt: error.message,
                    headerId: 'users.table.error.delete',
                })
            )
            .then(() => gridContext?.refresh?.());
    }, [gridContext, rowsSelection, snackError]);
    const deleteUsersDisabled = useMemo(() => rowsSelection.length <= 0, [rowsSelection.length]);

    const addUser = useCallback(
        (id: string) => {
            UserAdminSrv.addUser(id)
                .catch((error) =>
                    snackError({
                        headerId: 'users.table.error.add',
                        headerValues: {
                            user: id,
                        },
                    })
                )
                .then(() => gridContext?.refresh?.());
        },
        [gridContext, snackError]
    );
    const { handleSubmit, control, reset, clearErrors } = useForm<{
        user: string;
    }>({
        defaultValues: { user: '' }, //need default not undefined value for html input, else react error at runtime
    });
    const [open, setOpen] = useState(false);
    const [showDeletionDialog, setShowDeletionDialog] = useState(false);
    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    };
    const onSubmit: SubmitHandler<{ user: string }> = (data) => {
        addUser(data.user.trim());
        handleClose();
    };
    const onSubmitForm = handleSubmit(onSubmit);

    const handleCellEditingStopped = useCallback(
        (event: CellEditingStoppedEvent) => {
            if (event.valueChanged && event.data) {
                updateUserCallback(event.data.sub, event.data.profileName, event.data.isAdmin, event.data.groups);
            } else {
                gridContext?.refresh?.();
            }
        },
        [gridContext, updateUserCallback]
    );

    return (
        <Grid item container direction="column" spacing={2} component="section">
            <Grid item container xs sx={{ width: 1 }}>
                <GridTable<UserInfos, {}>
                    ref={gridRef}
                    dataLoader={UserAdminSrv.fetchUsers}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    stopEditingWhenCellsLoseFocus={true}
                    onCellEditingStopped={handleCellEditingStopped}
                    gridId="table-users"
                    getRowId={getRowId}
                    rowSelection={{
                        mode: 'multiRow',
                        enableClickSelection: false,
                        checkboxes: true,
                        headerCheckbox: true,
                        hideDisabledCheckboxes: false,
                    }}
                    onSelectionChanged={useCallback(
                        (event: SelectionChangedEvent<UserInfos, {}>) =>
                            setRowsSelection(event.api.getSelectedRows() ?? []),
                        []
                    )}
                >
                    <GridButton
                        labelId="users.table.toolbar.add.label"
                        textId="users.table.toolbar.add"
                        startIcon={<PersonAdd fontSize="small" />}
                        color="primary"
                        onClick={useCallback(() => setOpen(true), [])}
                    />
                    <GridButtonDelete onClick={() => setShowDeletionDialog(true)} disabled={deleteUsersDisabled} />
                </GridTable>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={(props) => <PaperForm untypedProps={props} onSubmit={onSubmitForm} />}
                >
                    <DialogTitle>
                        <FormattedMessage id="users.form.title" />
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <FormattedMessage id="users.form.content" />
                        </DialogContentText>
                        <Controller
                            name="user"
                            control={control}
                            rules={{ required: true, minLength: 1 }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    autoFocus
                                    required
                                    margin="dense"
                                    label={<FormattedMessage id="users.form.field.username.label" />}
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
                    itemType={intl.formatMessage({ id: 'form.delete.dialog.user' })}
                    itemNames={rowsSelection.map((user) => user.sub)}
                    deleteFunc={deleteUsers}
                />
            </Grid>
        </Grid>
    );
};
export default UsersPage;
