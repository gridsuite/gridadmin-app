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
import { AccountCircle, ManageAccounts } from '@mui/icons-material';
import {
    GridButton,
    GridButtonDelete,
    GridTable,
    GridTableRef,
} from '../../components/Grid';
import { UserAdminSrv, UserProfile } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { GetRowIdParams } from 'ag-grid-community/dist/lib/interfaces/iCallbackParams';
import { TextFilterParams } from 'ag-grid-community/dist/lib/filter/provided/text/textFilter';
import { ColDef } from 'ag-grid-community';
import { SelectionChangedEvent } from 'ag-grid-community/dist/lib/events';

const defaultColDef: ColDef<UserProfile> = {
    editable: false,
    resizable: true,
    minWidth: 50,
    cellRenderer: 'agAnimateSlideCellRenderer', //'agAnimateShowChangeCellRenderer'
    showDisabledCheckboxes: true,
    rowDrag: false,
    sortable: true,
};

function getRowId(params: GetRowIdParams<UserProfile>): string {
    return params.data.name;
}

const ProfilesPage: FunctionComponent = () => {
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const gridRef = useRef<GridTableRef<UserProfile>>(null);
    const gridContext = gridRef.current?.context;

    const columns = useMemo(
        (): ColDef<UserProfile>[] => [
            {
                field: 'name',
                cellDataType: 'text',
                editable: true,
                flex: 3,
                lockVisible: true,
                filter: true,
                headerName: intl.formatMessage({ id: 'table.id' }),
                headerTooltip: intl.formatMessage({
                    id: 'profiles.table.id.description',
                }),
                headerCheckboxSelection: true,
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserProfile>,
            },
        ],
        [intl]
    );

    const [rowsSelection, setRowsSelection] = useState<UserProfile[]>([]);
    const deleteUsers = useCallback((): Promise<void> | undefined => {
        let subs = rowsSelection.map((user) => user.name);
        return UserAdminSrv.deleteUsers(subs)
            .catch((error) =>
                snackError({
                    messageTxt: `Error while deleting user "${JSON.stringify(
                        subs
                    )}"${error.message && ':\n' + error.message}`,
                    headerId: 'users.table.error.delete',
                })
            )
            .then(() => gridContext?.refresh?.());
    }, [gridContext, rowsSelection, snackError]);
    const deleteUsersDisabled = useMemo(
        () => rowsSelection.length <= 0,
        [rowsSelection.length]
    );

    const addUser = useCallback(
        (id: string) => {
            UserAdminSrv.addUser(id)
                .catch((error) =>
                    snackError({
                        messageTxt: `Error while adding user "${id}"${
                            error.message && ':\n' + error.message
                        }`,
                        headerId: 'users.table.error.add',
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

    return (
        <Grid item container direction="column" spacing={2} component="section">
            <Grid item container xs sx={{ width: 1 }}>
                <GridTable<UserProfile, {}>
                    ref={gridRef}
                    dataLoader={UserAdminSrv.fetchProfiles}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    gridId="table-users"
                    getRowId={getRowId}
                    rowSelection="multiple"
                    onSelectionChanged={useCallback(
                        (event: SelectionChangedEvent<UserProfile, {}>) =>
                            setRowsSelection(event.api.getSelectedRows() ?? []),
                        []
                    )}
                >
                    <GridButton
                        labelId="users.table.toolbar.add.label"
                        textId="profiles.table.toolbar.add"
                        startIcon={<ManageAccounts fontSize="small" />}
                        color="primary"
                        onClick={useCallback(() => setOpen(true), [])}
                    />
                    <GridButtonDelete
                        onClick={deleteUsers}
                        disabled={deleteUsersDisabled}
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
                            render={({ field, fieldState, formState }) => (
                                <TextField
                                    {...field}
                                    autoFocus
                                    required
                                    margin="dense"
                                    label={
                                        <FormattedMessage id="users.form.field.username.label" />
                                    }
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
