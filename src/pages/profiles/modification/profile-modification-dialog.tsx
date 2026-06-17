/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as yup from 'yup';
import ProfileModificationForm, {
    LOADFLOW_PARAM_ID,
    NETWORK_VISUALIZATION_PARAMETERS_ID,
    PCCMIN_PARAM_ID,
    PROFILE_NAME,
    SECURITY_ANALYSIS_PARAM_ID,
    SENSITIVITY_ANALYSIS_PARAM_ID,
    SHORTCIRCUIT_PARAM_ID,
    SPREADSHEET_CONFIG_COLLECTION_ID,
    USER_QUOTA_BALANCE_ADJUSTEMENT_NB,
    USER_QUOTA_BUILD_NB,
    USER_QUOTA_CASE_NB,
    USER_QUOTA_DYNAMIC_MARGIN_INIT_NB,
    USER_QUOTA_DYNAMIC_SECURITY_INIT_NB,
    USER_QUOTA_DYNAMIC_SIMULATION_INIT_NB,
    USER_QUOTA_LOADFLOW_NB,
    USER_QUOTA_PCC_MIN_NB,
    USER_QUOTA_SECURITY_NB,
    USER_QUOTA_SENSITIVITY_NB,
    USER_QUOTA_SHORTCIRCUIT_NB,
    USER_QUOTA_STATE_ESTIMATION_NB,
    USER_QUOTA_VOLTAGE_INIT_NB,
    VOLTAGE_INIT_PARAM_ID,
    WORKSPACE_ID,
} from './profile-modification-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { CustomMuiDialog, FetchStatus, snackWithFallback, useSnackMessage } from '@gridsuite/commons-ui';
import { UserAdminSrv, UserProfile } from '../../../services';
import type { UUID } from 'node:crypto';

export interface ProfileModificationDialogProps {
    profileId: UUID | undefined;
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const ProfileModificationDialog: FunctionComponent<ProfileModificationDialogProps> = ({
    profileId,
    open,
    onClose,
    onUpdate,
}) => {
    const { snackError } = useSnackMessage();
    const [dataFetchStatus, setDataFetchStatus] = useState<string>(FetchStatus.IDLE);

    const formSchema = yup
        .object()
        .shape({
            [PROFILE_NAME]: yup.string().trim().required('nameEmpty'),
            [LOADFLOW_PARAM_ID]: yup.string<UUID>().optional(),
            [SECURITY_ANALYSIS_PARAM_ID]: yup.string<UUID>().optional(),
            [SENSITIVITY_ANALYSIS_PARAM_ID]: yup.string<UUID>().optional(),
            [SHORTCIRCUIT_PARAM_ID]: yup.string<UUID>().optional(),
            [PCCMIN_PARAM_ID]: yup.string<UUID>().optional(),
            [VOLTAGE_INIT_PARAM_ID]: yup.string<UUID>().optional(),
            [USER_QUOTA_CASE_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_BUILD_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_LOADFLOW_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_SECURITY_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_SENSITIVITY_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_SHORTCIRCUIT_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_PCC_MIN_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_VOLTAGE_INIT_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_STATE_ESTIMATION_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_BALANCE_ADJUSTEMENT_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_DYNAMIC_SIMULATION_INIT_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_DYNAMIC_SECURITY_INIT_NB]: yup.number().positive('userQuotaPositive').optional(),
            [USER_QUOTA_DYNAMIC_MARGIN_INIT_NB]: yup.number().positive('userQuotaPositive').optional(),
            [SPREADSHEET_CONFIG_COLLECTION_ID]: yup.string<UUID>().optional(),
            [NETWORK_VISUALIZATION_PARAMETERS_ID]: yup.string<UUID>().optional(),
            [WORKSPACE_ID]: yup.string<UUID>().optional(),
        })
        .required();

    type FormSchema = yup.InferType<typeof formSchema>;

    const formMethods = useForm<FormSchema>({
        resolver: yupResolver(formSchema),
    });

    const { reset } = formMethods;

    const onSubmit = useCallback<SubmitHandler<FormSchema>>(
        (profileFormData) => {
            if (profileId) {
                const profileData: UserProfile = {
                    id: profileId,
                    name: profileFormData[PROFILE_NAME],
                    loadFlowParameterId: profileFormData[LOADFLOW_PARAM_ID],
                    securityAnalysisParameterId: profileFormData[SECURITY_ANALYSIS_PARAM_ID],
                    sensitivityAnalysisParameterId: profileFormData[SENSITIVITY_ANALYSIS_PARAM_ID],
                    shortcircuitParameterId: profileFormData[SHORTCIRCUIT_PARAM_ID],
                    pccMinParameterId: profileFormData[PCCMIN_PARAM_ID],
                    voltageInitParameterId: profileFormData[VOLTAGE_INIT_PARAM_ID],
                    maxAllowedCases: profileFormData[USER_QUOTA_CASE_NB],
                    maxAllowedBuilds: profileFormData[USER_QUOTA_BUILD_NB],
                    maxAllowedLoadflow: profileFormData[USER_QUOTA_LOADFLOW_NB],
                    maxAllowedSecurity: profileFormData[USER_QUOTA_SECURITY_NB],
                    maxAllowedSensitivity: profileFormData[USER_QUOTA_SENSITIVITY_NB],
                    maxAllowedShortCircuit: profileFormData[USER_QUOTA_SHORTCIRCUIT_NB],
                    maxAllowedVoltageInit: profileFormData[USER_QUOTA_VOLTAGE_INIT_NB],
                    maxAllowedPccMin: profileFormData[USER_QUOTA_PCC_MIN_NB],
                    maxAllowedStateEstimation: profileFormData[USER_QUOTA_STATE_ESTIMATION_NB],
                    maxAllowedBalanceAdjustement: profileFormData[USER_QUOTA_BALANCE_ADJUSTEMENT_NB],
                    maxAllowedDynamicSimulation: profileFormData[USER_QUOTA_DYNAMIC_SIMULATION_INIT_NB],
                    maxAllowedDynamicSecurity: profileFormData[USER_QUOTA_DYNAMIC_SECURITY_INIT_NB],
                    maxAllowedDynamicMargin: profileFormData[USER_QUOTA_DYNAMIC_MARGIN_INIT_NB],
                    spreadsheetConfigCollectionId: profileFormData[SPREADSHEET_CONFIG_COLLECTION_ID],
                    networkVisualizationParameterId: profileFormData[NETWORK_VISUALIZATION_PARAMETERS_ID],
                    workspaceId: profileFormData[WORKSPACE_ID],
                };
                UserAdminSrv.modifyProfile(profileData)
                    .catch((error) => {
                        snackWithFallback(snackError, error, { headerId: 'profiles.form.modification.updateError' });
                    })
                    .then(() => {
                        onUpdate();
                    });
            }
        },
        [profileId, snackError, onUpdate]
    );

    const onDialogClose = useCallback(() => {
        setDataFetchStatus(FetchStatus.IDLE);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (profileId && open) {
            setDataFetchStatus(FetchStatus.FETCHING);
            UserAdminSrv.getProfile(profileId)
                .then((response) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    reset({
                        [PROFILE_NAME]: response.name,
                        [LOADFLOW_PARAM_ID]: response.loadFlowParameterId ?? undefined,
                        [SECURITY_ANALYSIS_PARAM_ID]: response.securityAnalysisParameterId ?? undefined,
                        [SENSITIVITY_ANALYSIS_PARAM_ID]: response.sensitivityAnalysisParameterId ?? undefined,
                        [SHORTCIRCUIT_PARAM_ID]: response.shortcircuitParameterId ?? undefined,
                        [PCCMIN_PARAM_ID]: response.pccMinParameterId ?? undefined,
                        [VOLTAGE_INIT_PARAM_ID]: response.voltageInitParameterId ?? undefined,
                        [USER_QUOTA_CASE_NB]: response.maxAllowedCases,
                        [USER_QUOTA_BUILD_NB]: response.maxAllowedBuilds,
                        [USER_QUOTA_LOADFLOW_NB]: response.maxAllowedLoadflow,
                        [USER_QUOTA_SECURITY_NB]: response.maxAllowedSecurity,
                        [USER_QUOTA_SENSITIVITY_NB]: response.maxAllowedSensitivity,
                        [USER_QUOTA_SHORTCIRCUIT_NB]: response.maxAllowedShortCircuit,
                        [USER_QUOTA_PCC_MIN_NB]: response.maxAllowedPccMin,
                        [USER_QUOTA_VOLTAGE_INIT_NB]: response.maxAllowedVoltageInit,
                        [USER_QUOTA_STATE_ESTIMATION_NB]: response.maxAllowedStateEstimation,
                        [USER_QUOTA_BALANCE_ADJUSTEMENT_NB]: response.maxAllowedBalanceAdjustement,
                        [USER_QUOTA_DYNAMIC_SIMULATION_INIT_NB]: response.maxAllowedDynamicSimulation,
                        [USER_QUOTA_DYNAMIC_SECURITY_INIT_NB]: response.maxAllowedDynamicSecurity,
                        [USER_QUOTA_DYNAMIC_MARGIN_INIT_NB]: response.maxAllowedDynamicMargin,
                        [SPREADSHEET_CONFIG_COLLECTION_ID]: response.spreadsheetConfigCollectionId ?? undefined,
                        [NETWORK_VISUALIZATION_PARAMETERS_ID]: response.networkVisualizationParameterId ?? undefined,
                        [WORKSPACE_ID]: response.workspaceId ?? undefined,
                    });
                })
                .catch((error) => {
                    setDataFetchStatus(FetchStatus.FETCH_ERROR);
                    snackWithFallback(snackError, error, { headerId: 'profiles.form.modification.readError' });
                });
        }
    }, [profileId, open, reset, snackError]);

    const isDataReady = useMemo(() => dataFetchStatus === FetchStatus.FETCH_SUCCESS, [dataFetchStatus]);

    const isDataFetching = useMemo(() => dataFetchStatus === FetchStatus.FETCHING, [dataFetchStatus]);

    return (
        <CustomMuiDialog
            open={open}
            onClose={onDialogClose}
            onSave={onSubmit}
            formContext={{
                ...formMethods,
                validationSchema: formSchema,
                removeOptional: true,
            }}
            titleId={'profiles.form.modification.title'}
            isDataFetching={isDataFetching}
        >
            {isDataReady && <ProfileModificationForm />}
        </CustomMuiDialog>
    );
};

export default ProfileModificationDialog;
