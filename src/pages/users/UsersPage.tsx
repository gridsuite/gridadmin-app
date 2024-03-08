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
    Typography,
} from '@mui/material';
import { AccountCircle, PersonAdd } from '@mui/icons-material';
import {
    GridButton,
    GridButtonDelete,
    GridTable,
    GridTableRef,
} from '../../components/Grid';
import { UserAdminSrv, UserInfos } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { GetRowIdParams } from 'ag-grid-community/dist/lib/interfaces/iCallbackParams';
import { TextFilterParams } from 'ag-grid-community/dist/lib/filter/provided/text/textFilter';
import { ColDef, ICheckboxCellRendererParams } from 'ag-grid-community';
import { SelectionChangedEvent } from 'ag-grid-community/dist/lib/events';

const defaultColDef: ColDef<UserInfos> = {
    editable: false,
    resizable: true,
    minWidth: 50,
    cellRenderer: 'agAnimateSlideCellRenderer', //'agAnimateShowChangeCellRenderer'
    showDisabledCheckboxes: true,
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

    const columns = useMemo(
        (): ColDef<UserInfos>[] => [
            {
                field: 'sub',
                cellDataType: 'text',
                flex: 3,
                lockVisible: true,
                filter: true,
                headerName: intl.formatMessage({ id: 'table.id' }),
                headerTooltip: intl.formatMessage({
                    id: 'users.table.id.description',
                }),
                headerCheckboxSelection: true,
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserInfos>,
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
                sortable: false,
                filter: true,
                initialSortIndex: 1,
                initialSort: 'asc',
            },
        ],
        [intl]
    );

    const [rowsSelection, setRowsSelection] = useState<UserInfos[]>([]);
    const deleteUsers = useCallback(
        (): Promise<void> | undefined =>
            gridContext
                ?.runningAction(() => {
                    let subs = rowsSelection.map((user) => user.sub);
                    return UserAdminSrv.deleteUsers(subs).catch((error) =>
                        snackError({
                            messageTxt: `Error while deleting user "${JSON.stringify(
                                subs
                            )}"${error.message && ':\n' + error.message}`,
                            headerId: 'users.table.error.delete',
                        })
                    );
                })
                //TODO replace manual refresh by notification in GridTable component
                .then(() => gridContext?.refresh?.()),
        [gridContext, rowsSelection, snackError]
    );
    const deleteUsersDisabled = useMemo(
        () => rowsSelection.length <= 0,
        [rowsSelection.length]
    );

    const addUser = useCallback(
        (id: string) => {
            gridContext
                ?.runningAction(() =>
                    UserAdminSrv.addUser(id).catch((error) =>
                        snackError({
                            messageTxt: `Error while adding user "${id}"${
                                error.message && ':\n' + error.message
                            }`,
                            headerId: 'users.table.error.add',
                        })
                    )
                )
                //TODO replace manual refresh by notification in GridTable component
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
            <Grid item xs="auto" component="header">
                <Typography variant="h2">
                    <FormattedMessage id="users.title" />
                </Typography>
            </Grid>
            <Grid item container xs sx={{ width: 1 }}>
                <GridTable<UserInfos, {}>
                    ref={gridRef}
                    dataLoader={UserAdminSrv.fetchUsers}
                    columnDefs={columns}
                    defaultColDef={defaultColDef}
                    gridId="table-users"
                    getRowId={getRowId}
                    rowSelection="multiple"
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
export default UsersPage;

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
