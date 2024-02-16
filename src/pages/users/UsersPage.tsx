import {
    Fragment,
    FunctionComponent,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
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
import { AccountCircle, Delete, PersonAdd } from '@mui/icons-material';
import CommonDataGrid, {
    CommonDataGridExposed,
} from '../../components/XDataGrid/CommonDataGrid';
import { UserAdminSrv, UserInfos } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import GridToolbarBtnAdd from '../../components/XDataGrid/GridToolbarButtonAdd';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

function getRowId(row: UserInfos) {
    return row.sub;
}

const UsersPage: FunctionComponent = () => {
    //const data = useLoaderData() as DeferredData;
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const gridRef = useRef<CommonDataGridExposed>();

    const deleteUser = useCallback(
        (id: string) => () =>
            gridRef.current?.actionThenRefresh(() =>
                UserAdminSrv.deleteUser(id).catch((error) =>
                    snackError({
                        messageTxt: `Error while deleting user "${id}"${
                            error.message && ':\n' + error.message
                        }`,
                        headerId: 'users.table.error.delete',
                    })
                )
            ),
        [snackError]
    );
    const columns: GridColDef<UserInfos>[] = useMemo(
        () => [
            {
                field: 'sub',
                headerName: intl.formatMessage({ id: 'table.id' }),
                description: intl.formatMessage({
                    id: 'users.table.id.description',
                }),
                type: 'string',
                flex: 0.25,
                editable: false,
                filterable: true,
                hideable: false,
            },
            {
                field: 'isAdmin',
                headerName: intl.formatMessage({
                    id: 'users.table.isAdmin',
                }),
                description: intl.formatMessage({
                    id: 'users.table.isAdmin.description',
                }),
                type: 'boolean',
                sortable: false,
                flex: 0.15,
                editable: false,
                filterable: true,
            },
            {
                field: 'actions',
                type: 'actions',
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={deleteUser(params.row.sub)}
                    />,
                ],
            },
        ],
        [intl, deleteUser]
    );

    const addUser = useCallback(
        (id: string) =>
            gridRef.current?.actionThenRefresh(() =>
                UserAdminSrv.addUser(id).catch((error) =>
                    snackError({
                        messageTxt: `Error while adding user "${id}"${
                            error.message && ':\n' + error.message
                        }`,
                        headerId: 'users.table.error.delete',
                    })
                )
            ),
        [snackError]
    );
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setFocus,
        clearErrors,
    } = useForm<{ user: string }>();
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
    };
    const onSubmit: SubmitHandler<{ user: string }> = (data) => {
        console.groupCollapsed('onSubmit(...)');
        console.dir(data);
        console.groupEnd();
        addUser(data.user.trim());
        handleClose();
    };
    const onSubmitForm = handleSubmit(onSubmit);

    return (
        <Grid item container direction="column" spacing={2}>
            <Grid item xs="auto">
                <Typography variant="h2">
                    <FormattedMessage id="users.title" />
                </Typography>
            </Grid>
            <Grid item xs sx={{ width: 1 }}>
                <CommonDataGrid
                    exposesRef={gridRef}
                    loader={UserAdminSrv.fetchUsers}
                    columns={columns}
                    getRowId={getRowId}
                    ignoreDiacritics
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    initialState={{
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterExcludeHiddenColumns: true,
                            },
                        },
                    }}
                    toolbarExtends={
                        <>
                            <GridToolbarBtnAdd
                                labelId="users.table.toolbar.add.label"
                                textId="users.table.toolbar.add"
                                tooltipId="users.table.toolbar.add.tooltip"
                                addElement={useCallback(
                                    () => setOpen(true),
                                    []
                                )}
                                icon={PersonAdd}
                            />
                            {/*TODO remove selection*/}
                        </>
                    }
                />
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
    return <Paper component="form" {...formProps} {...othersProps} />;
};
