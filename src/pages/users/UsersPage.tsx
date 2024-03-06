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
import DataGrid, { DataGridRef } from '../../components/Grid/DataGrid';
import { UserAdminSrv, UserInfos } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import GridToolbarBtnAdd from '../../components/Grid/buttons/ButtonAdd';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { GetRowIdParams } from 'ag-grid-community/dist/lib/interfaces/iCallbackParams';
import { AgColDef } from '../../components/Grid/AgGrid/AgGrid.type';
import { TextFilterParams } from 'ag-grid-community/dist/lib/filter/provided/text/textFilter';

function getRowId(params: GetRowIdParams<UserInfos>): string {
    return params.data.sub;
}

const UsersPage: FunctionComponent = () => {
    //const data = useLoaderData() as DeferredData;
    const intl = useIntl();
    const { snackError } = useSnackMessage();
    const gridRef = useRef<DataGridRef<UserInfos>>(null);

    const deleteUser = useCallback(
        (id: string) => () =>
            gridRef.current?.context?.actionThenRefresh(() =>
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
    const columns = useMemo(
        (): AgColDef<UserInfos>[] => [
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
                //TODO headerCheckboxSelection: true,
                //initialSortIndex: 2,
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserInfos>,
            },
            {
                field: 'isAdmin',
                cellDataType: 'boolean',
                //checkboxSelection: true,
                //cellRenderer: 'agCheckboxCellRenderer',
                cellRendererParams: {
                    disabled: true,
                },
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
        [intl.locale]
    );

    const addUser = useCallback(
        (id: string) =>
            gridRef.current?.context?.actionThenRefresh(() =>
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

    const buttonAdd = useCallback(
        () => (
            <GridToolbarBtnAdd
                labelId="users.table.toolbar.add.label"
                textId="users.table.toolbar.add"
                tooltipTextId="users.table.toolbar.add.tooltip"
                onClick={() => setOpen(true)}
                icon={PersonAdd}
            />
        ),
        []
    );

    return (
        <Grid item container direction="column" spacing={2} component="section">
            <Grid item xs="auto" component="header">
                <Typography variant="h2">
                    <FormattedMessage id="users.title" />
                </Typography>
            </Grid>
            <Grid item xs sx={{ width: 1 }}>
                <DataGrid<UserInfos>
                    accessRef={gridRef}
                    dataLoader={UserAdminSrv.fetchUsers}
                    addBtn={buttonAdd}
                    columnDefs={columns}
                    gridId="table-users"
                    getRowId={getRowId}
                    //TODO onClick={deleteUser(params.row.sub)}
                    //TODO onRemove
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
    return <Paper component="form" {...formProps} {...(othersProps ?? {})} />;
};
