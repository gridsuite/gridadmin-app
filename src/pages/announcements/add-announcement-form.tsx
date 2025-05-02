/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from 'react';
import { Grid } from '@mui/material';
import { type DateOrTimeView } from '@mui/x-date-pickers';
import { useIntl } from 'react-intl';
import { type Option, SubmitButton, useSnackMessage } from '@gridsuite/commons-ui';
import yup from '../../utils/yup-config';
import { type InferType } from 'yup';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, SelectElement, TextareaAutosizeElement } from 'react-hook-form-mui';
import { DateTimePickerElement, type DateTimePickerElementProps } from 'react-hook-form-mui/date-pickers';
import { TZDate } from '@date-fns/tz';
import { endOfMinute, startOfMinute } from 'date-fns';
import { UserAdminSrv } from '../../services';
import { getErrorMessage, handleAnnouncementCreationErrors } from '../../utils/error';

export const MESSAGE = 'message';
export const START_DATE = 'startDate';
export const END_DATE = 'endDate';
export const SEVERITY = 'severity';

export type AddAnnouncementFormProps = {
    onAnnouncementCreated?: () => void;
};

const severitySelect: Option[] = Object.values(UserAdminSrv.AnnouncementSeverity).map((value) => ({
    id: value,
    label: `announcements.severity.${value}`,
}));

const formSchema = yup
    .object()
    .shape({
        [MESSAGE]: yup.string().trim().min(1).required(),
        [START_DATE]: yup.string().datetime({ precision: 0 }).required(),
        [END_DATE]: yup.string().datetime({ precision: 0 }).required(),
        [SEVERITY]: yup
            .string<UserAdminSrv.AnnouncementSeverity>()
            .oneOf(Object.values(UserAdminSrv.AnnouncementSeverity))
            .required(),
    })
    .required();
type FormSchema = InferType<typeof formSchema>;

const datetimePickerTransform: NonNullable<DateTimePickerElementProps<FormSchema>['transform']> = {
    input: (value) => (value ? new TZDate(value) : null),
    output: (value) => value?.toISOString() ?? '',
};
const pickerView = ['year', 'month', 'day', 'hours', 'minutes'] as const satisfies readonly DateOrTimeView[];

export default function AddAnnouncementForm({ onAnnouncementCreated }: Readonly<AddAnnouncementFormProps>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const formContext = useForm({
        resolver: yupResolver(formSchema),
        /*TODO defaultValues: {
            [MESSAGE]: null,
            [START_DATE]: null,
            [END_DATE]: null,
            [SEVERITY]: null,
        },*/
    });
    const { formState, getValues } = formContext;
    const startDateValue = getValues(START_DATE);

    const onSubmit = useCallback<SubmitHandler<FormSchema>>(
        (params) => {
            UserAdminSrv.addAnnouncement({
                //id: crypto.randomUUID(),
                message: params.message,
                startDate: startOfMinute(new TZDate(params.startDate)).toISOString(),
                endDate: endOfMinute(new TZDate(params.endDate)).toISOString(),
                severity: params.severity,
            })
                .then(() => onAnnouncementCreated?.())
                .catch((error) => {
                    let errorMessage = getErrorMessage(error) ?? '';
                    if (!handleAnnouncementCreationErrors(errorMessage, snackError)) {
                        snackError({ headerId: 'announcements.form.errCreateAnnouncement', messageTxt: errorMessage });
                    }
                });
        },
        [onAnnouncementCreated, snackError]
    );

    return (
        <FormContainer<FormSchema> formContext={formContext} onSuccess={onSubmit}>
            <DateTimePickerElement<FormSchema> name={END_DATE} />
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <TextareaAutosizeElement<FormSchema>
                        name={MESSAGE}
                        label={intl.formatMessage({ id: 'announcements.form.message' })}
                        minRows={2}
                        maxRows={5}
                        fullWidth
                        //inputProps={{ maxLength: 200 }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <DateTimePickerElement<FormSchema>
                        name={START_DATE}
                        label={intl.formatMessage({ id: 'announcements.table.startDate' })}
                        transform={datetimePickerTransform}
                        timezone="system"
                        views={pickerView}
                        timeSteps={{ hours: 1, minutes: 1, seconds: 0 }}
                        disablePast
                    />
                </Grid>
                <Grid item xs={2}>
                    <DateTimePickerElement<FormSchema>
                        name={END_DATE}
                        label={intl.formatMessage({ id: 'announcements.table.endDate' })}
                        transform={datetimePickerTransform}
                        timezone="system"
                        views={pickerView}
                        timeSteps={{ hours: 1, minutes: 1, seconds: 0 }}
                        disablePast
                        minDateTime={startDateValue ? new TZDate(startDateValue) : undefined}
                    />
                </Grid>
                <Grid item xs={2}>
                    <SelectElement<FormSchema>
                        name={SEVERITY}
                        label={intl.formatMessage({ id: 'announcements.severity' })}
                        options={severitySelect}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={2}>
                    <SubmitButton
                        variant="outlined"
                        type="submit"
                        fullWidth
                        disabled={!formState.isValid || formState.isValidating}
                    />
                </Grid>
            </Grid>
        </FormContainer>
    );
}
