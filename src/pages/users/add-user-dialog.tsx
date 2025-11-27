/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, RefObject, useCallback } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    TextField,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Controller, useForm } from 'react-hook-form';
import { AccountCircle } from '@mui/icons-material';
import { UserAdminSrv, UserInfos } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { GridTableRef } from '../../components/Grid';
import PaperForm from '../common/paper-form';

export interface AddUserDialogProps {
    gridRef: RefObject<GridTableRef<UserInfos>>;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const AddUserDialog: FunctionComponent<AddUserDialogProps> = (props) => {
    const { snackError } = useSnackMessage();

    const { handleSubmit, control, reset, clearErrors } = useForm<{
        name: string;
    }>({
        defaultValues: { name: '' }, //need default not undefined value for html input, else react error at runtime
    });

    const addUser = useCallback(
        (id: string) => {
            UserAdminSrv.addUser(id)
                .catch((_error) =>
                    snackError({
                        headerId: 'users.table.error.add',
                        headerValues: {
                            user: id,
                        },
                    })
                )
                .then(() => props.gridRef?.current?.context?.refresh?.());
        },
        [props.gridRef, snackError]
    );

    const handleClose = useCallback(() => {
        props.setOpen(false);
        reset();
        clearErrors();
    }, [clearErrors, props, reset]);

    const onSubmit = useCallback(
        (data: { name: string }) => {
            addUser(data.name.trim());
            handleClose();
        },
        [addUser, handleClose]
    );

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            PaperComponent={(props) => <PaperForm untypedProps={props} onSubmit={handleSubmit(onSubmit)} />}
        >
            <DialogTitle>
                <FormattedMessage id="users.form.title" />
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <FormattedMessage id="users.form.content" />
                </DialogContentText>
                <Controller
                    name="name"
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
    );
};
export default AddUserDialog;
