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
import { ManageAccounts } from '@mui/icons-material';
import { GroupInfos, UserAdminSrv } from '../../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { GridTableRef } from '../../components/Grid';
import PaperForm from '../common/paper-form';

export interface AddGroupDialogProps {
    gridRef: RefObject<GridTableRef<GroupInfos>>;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const AddGroupDialog: FunctionComponent<AddGroupDialogProps> = (props) => {
    const { snackError } = useSnackMessage();

    const addGroup = useCallback(
        (group: string) => {
            UserAdminSrv.addGroup(group)
                .catch((error) =>
                    snackError({
                        headerId: 'groups.table.error.add',
                        headerValues: {
                            group: group,
                        },
                    })
                )
                .then(() => props.gridRef?.current?.context?.refresh?.());
        },
        [props.gridRef, snackError]
    );
    const { handleSubmit, control, reset, clearErrors } = useForm<{
        group: string;
    }>({
        defaultValues: { group: '' }, //need default not undefined value for html input, else react error at runtime
    });

    const handleClose = useCallback(() => {
        props.setOpen(false);
        reset();
        clearErrors();
    }, [clearErrors, props, reset]);

    const onSubmit = useCallback(
        (data: { group: string }) => {
            addGroup(data.group.trim());
            handleClose();
        },
        [addGroup, handleClose]
    );

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            PaperComponent={(props) => <PaperForm untypedProps={props} onSubmit={handleSubmit(onSubmit)} />}
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
                    render={({ field, fieldState, formState }) => (
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
    );
};
export default AddGroupDialog;
