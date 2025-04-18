/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CustomFormProvider, SubmitButton, useSnackMessage } from '@gridsuite/commons-ui';
import Grid from '@mui/material/Grid';
import { FormattedMessage, useIntl } from 'react-intl';
import React, { FunctionComponent, useCallback } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { UserAdminSrv, Announcement } from '../../services';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../utils/yup-config';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
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

const AddAnnouncementForm: FunctionComponent<AddAnnouncementProps> = ({ onAnnouncementCreated }) => {
    const intl = useIntl();
    const [languageLocal] = useParameterState(PARAM_LANGUAGE);
    const { snackError } = useSnackMessage();

    const formSchema = yup
        .object()
        .shape({
            [MESSAGE]: yup.string().trim().required(),
            [START_DATE]: yup.string().required(),
            [END_DATE]: yup.string().required(),
            [SEVERITY]: yup.string().required(),
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
                            headerId: 'errCreateAnnouncement',
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
                        label={intl.formatMessage({ id: 'banners.form.message' })}
                        multiline
                        rows={4}
                        fullWidth
                        inputProps={{ maxLength: 200 }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={languageLocal}>
                        <DateTimePicker
                            {...register('startDate')}
                            name={START_DATE}
                            label={intl.formatMessage({ id: 'banners.table.startDate' })}
                            onChange={(newValue) => setValue('startDate', newValue?.toISOString() ?? '')}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={languageLocal}>
                        <DateTimePicker
                            {...register('endDate')}
                            name={END_DATE}
                            label={intl.formatMessage({ id: 'banners.table.endDate' })}
                            onChange={(newValue) => setValue('endDate', newValue?.toISOString() ?? '')}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <InputLabel id="severity-input-label">
                            <FormattedMessage id="banners.table.severity" />
                        </InputLabel>
                        <Select
                            {...register('severity')}
                            name={SEVERITY}
                            label={intl.formatMessage({ id: 'banners.table.severity' })}
                            fullWidth={true}
                            defaultValue={''}
                        >
                            <MenuItem value={UserAdminSrv.AnnouncementSeverity.INFO}>
                                {intl.formatMessage({ id: 'banners.table.info' })}
                            </MenuItem>
                            <MenuItem value={UserAdminSrv.AnnouncementSeverity.WARN}>
                                {intl.formatMessage({ id: 'banners.table.warn' })}
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
};

export default AddAnnouncementForm;
