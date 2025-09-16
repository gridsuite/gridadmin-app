/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo } from 'react';
import { Grid } from '@mui/material';
import { type DateOrTimeView } from '@mui/x-date-pickers';
import { useIntl } from 'react-intl';
import { SubmitButton, useSnackMessage, yupConfig as yup } from '@gridsuite/commons-ui';
import { type InferType } from 'yup';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    FormContainer,
    FormErrorProvider,
    type FormErrorProviderProps,
    SelectElement,
    TextareaAutosizeElement,
} from 'react-hook-form-mui';
import { DateTimePickerElement, type DateTimePickerElementProps } from 'react-hook-form-mui/date-pickers';
import { UserAdminSrv } from '../../services';
import { getErrorMessage, handleAnnouncementCreationErrors } from '../../utils/error';

export const MESSAGE = 'message';
export const START_DATE = 'startDate';
export const END_DATE = 'endDate';
export const SEVERITY = 'severity';

export type AddAnnouncementFormProps = {
    onAnnouncementCreated?: () => void;
};

const MESSAGE_MAX_LENGTH = 200;

const formSchema = yup
    .object()
    .shape({
        [MESSAGE]: yup
            .string()
            .nullable()
            .trim()
            .min(1, 'YupRequired')
            .max(MESSAGE_MAX_LENGTH, 'announcements.form.errForm.msgMaxLength' /*TODO temporary*/)
            .required('YupRequired' /*TODO temporary*/),
        [START_DATE]: yup.string().nullable().datetime().required('YupRequired' /*TODO temporary*/),
        [END_DATE]: yup
            .string()
            .nullable()
            .datetime()
            .required('YupRequired' /*TODO temporary*/)
            .when(START_DATE, (startDate, schema) =>
                schema.test(
                    'is-after-start',
                    'announcements.form.errForm.startDateAfterEndDateErr',
                    (endDate) => !startDate || !endDate || new Date(endDate) > new Date(startDate as unknown as string)
                )
            ),
        [SEVERITY]: yup
            .string<UserAdminSrv.AnnouncementSeverity>()
            .nullable()
            .oneOf(Object.values(UserAdminSrv.AnnouncementSeverity))
            .required('YupRequired' /*TODO temporary*/),
    })
    .required();
type FormSchema = InferType<typeof formSchema>;

const datetimePickerTransform: NonNullable<DateTimePickerElementProps<FormSchema>['transform']> = {
    input: (value) => {
        try {
            return value ? new Date(value) : null;
        } catch {
            return null; // RangeError: invalid date
        }
    },
    output: (value) => value?.toISOString() ?? '',
};
const pickerView = ['year', 'month', 'day', 'hours', 'minutes'] as const satisfies readonly DateOrTimeView[];

export default function AddAnnouncementForm({ onAnnouncementCreated }: Readonly<AddAnnouncementFormProps>) {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const formContext = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            // @ts-expect-error: nullable() is called, so null is accepted as default value
            [MESSAGE]: null,
            // @ts-expect-error: nullable() is called, so null is accepted as default value
            [START_DATE]: null,
            // @ts-expect-error: nullable() is called, so null is accepted as default value
            [END_DATE]: null,
            // @ts-expect-error: nullable() is called, so null is accepted as default value
            [SEVERITY]: null,
        },
        criteriaMode: 'all',
        mode: 'all',
        reValidateMode: 'onBlur', // TODO 'onChange'?
    });
    const { getValues } = formContext;
    const startDateValue = getValues(START_DATE);

    const onSubmit = useCallback<SubmitHandler<FormSchema>>(
        (params) => {
            UserAdminSrv.addAnnouncement({
                message: params.message,
                startDate: params.startDate,
                endDate: params.endDate,
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

    // TODO remove when yupConfig has been rework
    const onErrorIntl = useCallback<FormErrorProviderProps['onError']>(
        (error) =>
            error?.message?.includes(' ') // if it's not a token
                ? error.message
                : intl.formatMessage({ id: error.message, defaultMessage: error.message }),
        [intl]
    );

    return (
        <FormContainer<FormSchema>
            formContext={formContext}
            onSuccess={onSubmit}
            FormProps={{ style: { height: '100%' } }}
        >
            <FormErrorProvider onError={onErrorIntl}>
                <Grid container direction="column" spacing={1} height="100%">
                    <Grid item container xs="auto" spacing={1}>
                        <Grid item xs={12} lg={6}>
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
                        <Grid item xs={12} lg={6}>
                            <DateTimePickerElement<FormSchema>
                                name={END_DATE}
                                label={intl.formatMessage({ id: 'announcements.table.endDate' })}
                                transform={datetimePickerTransform}
                                timezone="system"
                                views={pickerView}
                                timeSteps={{ hours: 1, minutes: 1, seconds: 0 }}
                                disablePast
                                minDateTime={startDateValue ? new Date(startDateValue) : undefined}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs="auto">
                        <SelectElement<FormSchema>
                            name={SEVERITY}
                            label={intl.formatMessage({ id: 'announcements.severity' })}
                            options={useMemo(
                                () =>
                                    Object.values(UserAdminSrv.AnnouncementSeverity).map((value) => ({
                                        id: value,
                                        label: intl.formatMessage({ id: `announcements.severity.${value}` }),
                                    })),
                                [intl]
                            )}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs>
                        <TextareaAutosizeElement<FormSchema>
                            name={MESSAGE}
                            label={intl.formatMessage({ id: 'announcements.form.message' })}
                            rows={5} // why does it do nothing even if the field is set as multiline?!
                            fullWidth
                            //inputProps={{ maxLength: MESSAGE_MAX_LENGTH } satisfies Partial<HTMLInputElement>}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <SubmitButton variant="outlined" type="submit" fullWidth />
                    </Grid>
                </Grid>
            </FormErrorProvider>
        </FormContainer>
    );
}
