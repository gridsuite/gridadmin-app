/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DurationInput } from './DurationInput';
import { SubmitButton, TextInput, useSnackMessage, CustomFormProvider } from '@gridsuite/commons-ui';
import { AnnouncementFormData, emptyFormData, formSchema, fromFrontToBack, MESSAGE } from './utils';
import { UserAdminSrv } from '../../services';

interface CreateAnnouncementDialogProps {
    open: boolean;
    onClose: () => void;
}

export const CreateAnnouncementDialog: FunctionComponent<CreateAnnouncementDialogProps> = (props) => {
    const { snackError } = useSnackMessage();

    const formMethods = useForm<AnnouncementFormData>({
        defaultValues: emptyFormData,
        //@ts-ignore because yup TS is broken
        resolver: yupResolver(formSchema),
    });

    const { handleSubmit, reset } = formMethods;

    const onSubmit = useCallback(
        (formData: AnnouncementFormData) => {
            UserAdminSrv.createAnnouncement(fromFrontToBack(formData)).catch((error) =>
                snackError({
                    messageTxt: error.message,
                    headerId: 'announcements.error.add',
                })
            );
            reset();
            props.onClose();
        },
        [props, reset, snackError]
    );

    return (
        //@ts-ignore because RHF TS is broken
        <CustomFormProvider validationSchema={formSchema} {...formMethods}>
            <Dialog open={props.open} onClose={props.onClose}>
                <DialogTitle>
                    <FormattedMessage id="announcements.dialog.title" />
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <TextInput
                                name={MESSAGE}
                                label={'announcements.dialog.input'}
                                formProps={{
                                    multiline: true,
                                    variant: 'filled',
                                    minRows: 3,
                                }}
                            />
                        </Grid>
                        <DurationInput />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <SubmitButton onClick={handleSubmit(onSubmit)} variant="outlined" />
                </DialogActions>
            </Dialog>
        </CustomFormProvider>
    );
};
