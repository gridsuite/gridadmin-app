/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    FunctionComponent,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
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
    Paper,
    PaperProps,
    TextField,
} from '@mui/material';
import {
    Cancel,
    CheckCircle,
    ManageAccounts,
    RadioButtonUnchecked,
} from '@mui/icons-material';
import {
    GridButton,
    GridButtonDelete,
    GridTable,
    GridTableRef,
} from '../../components/Grid';
import { UserAdminSrv, UserProfile } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    ColDef,
    GetRowIdParams,
    RowDoubleClickedEvent,
    SelectionChangedEvent,
    TextFilterParams,
} from 'ag-grid-community';
import ProfileModificationDialog from './modification/profile-modification-dialog';
import { UUID } from 'crypto';

const defaultColDef: ColDef<UserProfile> = {
    editable: false,
    resizable: true,
    minWidth: 50,
    cellRenderer: 'agAnimateSlideCellRenderer',
    showDisabledCheckboxes: true,
    rowDrag: false,
    sortable: true,
};

function getRowId(params: GetRowIdParams<UserProfile>): string {
    return params.data.id ? params.data.id : '';
}

const ProfilesPage: FunctionComponent = () => {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const gridRef = useRef<GridTableRef<UserProfile>>(null);
    const gridContext = gridRef.current?.context;
    const [openProfileModificationDialog, setOpenProfileModificationDialog] =
        useState(false);
    const [editingProfileId, setEditingProfileId] = useState<UUID>();

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
                cellStyle: (params) => ({
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

    const [rowsSelection, setRowsSelection] = useState<UserProfile[]>([]);
    const deleteProfiles = useCallback((): Promise<void> | undefined => {
        let profileNames = rowsSelection.map((userProfile) => userProfile.name);
        return UserAdminSrv.deleteProfiles(profileNames)
            .catch((error) =>
                snackError({
                    messageTxt: error.message,
                    headerId: 'profiles.table.error.delete',
                })
            )
            .then(() => gridContext?.refresh?.());
    }, [gridContext, rowsSelection, snackError]);
    const deleteProfilesDisabled = useMemo(
        () => rowsSelection.length <= 0,
        [rowsSelection.length]
    );

    const addProfile = useCallback(
        (name: string) => {
            const profileData: UserProfile = {
                id: undefined,
                name: name,
                loadFlowParameterId: undefined,
                allParametersLinksValid: undefined,
            };
            UserAdminSrv.addProfile(profileData)
                .catch((error) =>
                    snackError({
                        messageTxt: error.message,
                        headerId: 'profiles.table.error.add',
                    })
                )
                .then(() => gridContext?.refresh?.());
        },
        [gridContext, snackError]
    );
    const { handleSubmit, control, reset, clearErrors } = useForm<{
        name: string;
    }>({
        defaultValues: { name: '' }, //need default not undefined value for html input, else react error at runtime
    });
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    };
    const onSubmit: SubmitHandler<{ name: string }> = (data) => {
        addProfile(data.name.trim());
        handleClose();
    };
    const onSubmitForm = handleSubmit(onSubmit);

    const handleCloseProfileModificationDialog = () => {
        setOpenProfileModificationDialog(false);
        setEditingProfileId(undefined);
        reset();
    };

    const handleUpdateProfileModificationDialog = () => {
        gridContext?.refresh?.();
        handleCloseProfileModificationDialog();
    };

    const onRowDoubleClicked = useCallback(
        (event: RowDoubleClickedEvent<UserProfile>) => {
            if (event.data) {
                setEditingProfileId(event.data.id);
                setOpenProfileModificationDialog(true);
            }
        },
        []
    );

    return (
        <Grid item container direction="column" spacing={2} component="section">
            <Grid item container xs sx={{ width: 1 }}>
                <ProfileModificationDialog
                    profileId={editingProfileId}
                    open={openProfileModificationDialog}
                    onClose={handleCloseProfileModificationDialog}
                    onUpdate={handleUpdateProfileModificationDialog}
                />
                <GridTable<UserProfile, {}>
                    ref={gridRef}
                    dataLoader={UserAdminSrv.fetchProfiles}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    gridId="table-profiles"
                    getRowId={getRowId}
                    rowSelection="multiple"
                    onRowDoubleClicked={onRowDoubleClicked}
                    onSelectionChanged={useCallback(
                        (event: SelectionChangedEvent<UserProfile, {}>) =>
                            setRowsSelection(event.api.getSelectedRows() ?? []),
                        []
                    )}
                >
                    <GridButton
                        labelId="profiles.table.toolbar.add.label"
                        textId="profiles.table.toolbar.add"
                        startIcon={<ManageAccounts fontSize="small" />}
                        color="primary"
                        onClick={useCallback(() => setOpen(true), [])}
                    />
                    <GridButtonDelete
                        onClick={deleteProfiles}
                        disabled={deleteProfilesDisabled}
                    />
                </GridTable>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={(props) => (
                        <PaperForm
                            untypedProps={props}
                            onSubmit={onSubmitForm}
                        />
                    )}
                >
                    <DialogTitle>
                        <FormattedMessage id="profiles.form.title" />
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <FormattedMessage id="profiles.form.content" />
                        </DialogContentText>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: true, minLength: 1 }}
                            render={({ field, fieldState, formState }) => (
                                <TextField
                                    {...field}
                                    autoFocus
                                    required
                                    margin="dense"
                                    label={
                                        <FormattedMessage id="profiles.form.field.profilename.label" />
                                    }
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    inputMode="text"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ManageAccounts />
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
            </Grid>
        </Grid>
    );
};
export default ProfilesPage;

/*
 * <Paper> is defined in <Dialog> without generics, which default to `PaperProps => PaperProps<'div'>`,
 *   so we must trick typescript check with a cast
 */
const PaperForm: FunctionComponent<
    PaperProps<'form'> & { untypedProps?: PaperProps }
> = (props, context) => {
    const { untypedProps, ...formProps } = props;
    const othersProps = untypedProps as PaperProps<'form'>; //trust me ts
    return <Paper component="form" {...formProps} {...(othersProps ?? {})} />;
};
