/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CustomFormProvider, SubmitButton, useSnackMessage } from '@gridsuite/commons-ui';
import Grid from '@mui/material/Grid';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCallback } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Announcement, UserAdminSrv } from '../../services';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../utils/yup-config';
import { useParameterState } from '../../components/parameters';
import { PARAM_LANGUAGE } from '../../utils/config-params';
import { getErrorMessage, handleAnnouncementCreationErrors } from '../../utils/error';

export const MESSAGE = 'message';
export const START_DATE = 'startDate';
export const END_DATE = 'endDate';
export const SEVERITY = 'severity';

interface AddAnnouncementProps {
    onAnnouncementCreated: () => void;
}

export default function AddAnnouncementForm({ onAnnouncementCreated }: Readonly<AddAnnouncementProps>) {
    const intl = useIntl();
    const [languageLocal] = useParameterState(PARAM_LANGUAGE);
    const { snackError } = useSnackMessage();

    const formSchema = yup
        .object()
        .shape({
            [MESSAGE]: yup.string().trim().required(), // TODO not empty
            [START_DATE]: yup.string().required(), //TODO date
            [END_DATE]: yup.string().required(), // TODO date
            [SEVERITY]: yup.string().required(), // TODO enum
        })
        .required();
    const formMethods = useForm({
        resolver: yupResolver(formSchema),
    });
    const { register, setValue, handleSubmit, formState } = formMethods;

    const onSubmit = useCallback(
        (params: any) => {
            let startDate = new Date(params.startDate).toISOString();
            let endDate = new Date(params.endDate).toISOString();
            const newAnnouncement = {
                id: crypto.randomUUID(),
                message: params.message,
                startDate: startDate,
                endDate: endDate,
                severity: params.severity,
            } as Announcement;
            UserAdminSrv.addAnnouncement(newAnnouncement)
                .then(() => onAnnouncementCreated())
                .catch((error) => {
                    let errorMessage = getErrorMessage(error) ?? '';
                    if (!handleAnnouncementCreationErrors(errorMessage, snackError)) {
                        snackError({
                            headerId: 'announcements.form.errCreateAnnouncement',
                            messageTxt: errorMessage,
                        });
                    }
                });
        },
        [onAnnouncementCreated, snackError]
    );

    return (
        <CustomFormProvider validationSchema={formSchema} {...formMethods}>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <TextField
                        {...register('message')}
                        id="message-input"
                        label={intl.formatMessage({ id: 'announcements.form.message' })}
                        multiline
                        rows={4}
                        fullWidth
                        inputProps={{ maxLength: 200 }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <DateTimePicker
                        {...register('startDate')}
                        name={START_DATE}
                        label={intl.formatMessage({ id: 'announcements.table.startDate' })}
                        onChange={(newValue) => setValue('startDate', newValue?.toISOString() ?? '')} //TODO startOf(min)
                        timezone="system"
                    />
                </Grid>
                <Grid item xs={2}>
                    <DateTimePicker
                        {...register('endDate')}
                        name={END_DATE}
                        label={intl.formatMessage({ id: 'announcements.table.endDate' })}
                        onChange={(newValue) => setValue('endDate', newValue?.toISOString() ?? '')} //TODO endOf(min)
                        timezone="system"
                    />
                </Grid>
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <InputLabel id="severity-input-label">
                            <FormattedMessage id="announcements.severity" />
                        </InputLabel>
                        <Select
                            {...register('severity')}
                            name={SEVERITY}
                            label={intl.formatMessage({ id: 'announcements.severity' })}
                            fullWidth={true}
                            defaultValue={''} // TODO default info
                        >
                            <MenuItem value={UserAdminSrv.AnnouncementSeverity.INFO}>
                                {intl.formatMessage({ id: 'announcements.severity.INFO' })}
                            </MenuItem>
                            <MenuItem value={UserAdminSrv.AnnouncementSeverity.WARN}>
                                {intl.formatMessage({ id: 'announcements.severity.WARN' })}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <SubmitButton
                        variant="outlined"
                        onClick={handleSubmit(onSubmit)}
                        fullWidth={true}
                        disabled={!formState.isValid || formState.isValidating}
                    />
                </Grid>
            </Grid>
        </CustomFormProvider>
    );
}
