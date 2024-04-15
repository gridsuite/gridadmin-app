/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
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
import { ManageAccounts } from '@mui/icons-material';
import { GridTableRef } from '../../components/Grid';
import { UserAdminSrv, UserProfile } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { RowDoubleClickedEvent } from 'ag-grid-community';
import ProfileModificationDialog from './modification/profile-modification-dialog';
import { UUID } from 'crypto';
import ProfilesTable from './profiles-table';

const ProfilesPage: FunctionComponent = () => {
    const { snackError } = useSnackMessage();
    const gridRef = useRef<GridTableRef<UserProfile>>(null);
    const gridContext = gridRef.current?.context;
    const [openProfileModificationDialog, setOpenProfileModificationDialog] =
        useState(false);
    const [editingProfileId, setEditingProfileId] = useState<UUID>();

    const addProfile = useCallback(
        (name: string) => {
            const profileData: UserProfile = {
                name: name,
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
    const [openAddProfileDialog, setOpenAddProfileDialog] = useState(false);
    const handleClose = () => {
        setOpenAddProfileDialog(false);
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
                <ProfilesTable
                    gridRef={gridRef}
                    onRowDoubleClicked={onRowDoubleClicked}
                    setOpenAddProfileDialog={setOpenAddProfileDialog}
                />
                <Dialog
                    open={openAddProfileDialog}
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
