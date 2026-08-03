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
    VOLTAGE_INIT_PARAM_ID,
    WORKSPACE_ID,
} from './profile-modification-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import {
    CustomMuiDialog,
    FetchStatus,
    NAME_EMPTY,
    snackWithFallback,
    useSnackMessage,
    YUP_REQUIRED,
} from '@gridsuite/commons-ui';
import { USER_QUOTA_POSITIVE } from '../../../utils/translation-keys';
import { UserAdminSrv, UserProfile } from '../../../services';
import type { UUID } from 'node:crypto';
import { MaxAllowedKeys } from './max-allowed-keys';
import { UserQuotaNb } from './user-quota-nb';

export interface ProfileModificationDialogProps {
    profileId: UUID | undefined;
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const userQuotaSchema = yup.number().positive(USER_QUOTA_POSITIVE).required(YUP_REQUIRED);

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
            [PROFILE_NAME]: yup.string().trim().required(NAME_EMPTY),
            [LOADFLOW_PARAM_ID]: yup.string<UUID>().optional(),
            [SECURITY_ANALYSIS_PARAM_ID]: yup.string<UUID>().optional(),
            [SENSITIVITY_ANALYSIS_PARAM_ID]: yup.string<UUID>().optional(),
            [SHORTCIRCUIT_PARAM_ID]: yup.string<UUID>().optional(),
            [PCCMIN_PARAM_ID]: yup.string<UUID>().optional(),
            [VOLTAGE_INIT_PARAM_ID]: yup.string<UUID>().optional(),
            [UserQuotaNb.CASE]: userQuotaSchema,
            [UserQuotaNb.BUILD]: userQuotaSchema,
            [UserQuotaNb.LOADFLOW]: userQuotaSchema,
            [UserQuotaNb.SECURITY]: userQuotaSchema,
            [UserQuotaNb.SENSITIVITY]: userQuotaSchema,
            [UserQuotaNb.SHORTCIRCUIT]: userQuotaSchema,
            [UserQuotaNb.VOLTAGE_INIT]: userQuotaSchema,
            [UserQuotaNb.PCC_MIN]: userQuotaSchema,
            [UserQuotaNb.STATE_ESTIMATION]: userQuotaSchema,
            [UserQuotaNb.BALANCE_ADJUSTEMENT]: userQuotaSchema,
            [UserQuotaNb.DYNAMIC_SIMULATION_INIT]: userQuotaSchema,
            [UserQuotaNb.DYNAMIC_SECURITY_INIT]: userQuotaSchema,
            [UserQuotaNb.DYNAMIC_MARGIN_INIT]: userQuotaSchema,
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
                const maxAllowValues = {
                    [MaxAllowedKeys.CASES]: profileFormData[UserQuotaNb.CASE],
                    [MaxAllowedKeys.BUILD]: profileFormData[UserQuotaNb.BUILD],
                    [MaxAllowedKeys.LOADFLOW]: profileFormData[UserQuotaNb.LOADFLOW],
                    [MaxAllowedKeys.SECURITY]: profileFormData[UserQuotaNb.SECURITY],
                    [MaxAllowedKeys.SENSITIVITY]: profileFormData[UserQuotaNb.SENSITIVITY],
                    [MaxAllowedKeys.SHORT_CIRCUIT]: profileFormData[UserQuotaNb.SHORTCIRCUIT],
                    [MaxAllowedKeys.VOLTAGE_INIT]: profileFormData[UserQuotaNb.VOLTAGE_INIT],
                    [MaxAllowedKeys.PCC_MIN]: profileFormData[UserQuotaNb.PCC_MIN],
                    [MaxAllowedKeys.STATE_ESTIMATION]: profileFormData[UserQuotaNb.STATE_ESTIMATION],
                    [MaxAllowedKeys.BALANCE_ADJUSTEMENT]: profileFormData[UserQuotaNb.BALANCE_ADJUSTEMENT],
                    [MaxAllowedKeys.DYNAMIC_SIMULATION]: profileFormData[UserQuotaNb.DYNAMIC_SIMULATION_INIT],
                    [MaxAllowedKeys.DYNAMIC_SECURITY]: profileFormData[UserQuotaNb.DYNAMIC_SECURITY_INIT],
                    [MaxAllowedKeys.DYNAMIC_MARGIN]: profileFormData[UserQuotaNb.DYNAMIC_MARGIN_INIT],
                };
                const profileData: UserProfile = {
                    id: profileId,
                    name: profileFormData[PROFILE_NAME],
                    loadFlowParameterId: profileFormData[LOADFLOW_PARAM_ID],
                    securityAnalysisParameterId: profileFormData[SECURITY_ANALYSIS_PARAM_ID],
                    sensitivityAnalysisParameterId: profileFormData[SENSITIVITY_ANALYSIS_PARAM_ID],
                    shortcircuitParameterId: profileFormData[SHORTCIRCUIT_PARAM_ID],
                    pccMinParameterId: profileFormData[PCCMIN_PARAM_ID],
                    voltageInitParameterId: profileFormData[VOLTAGE_INIT_PARAM_ID],
                    maxOperationQuota: maxAllowValues,
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
                        [UserQuotaNb.CASE]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.CASES]
                            : undefined,
                        [UserQuotaNb.BUILD]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.BUILD]
                            : undefined,
                        [UserQuotaNb.LOADFLOW]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.LOADFLOW]
                            : undefined,
                        [UserQuotaNb.SECURITY]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.SECURITY]
                            : undefined,
                        [UserQuotaNb.SENSITIVITY]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.SENSITIVITY]
                            : undefined,
                        [UserQuotaNb.SHORTCIRCUIT]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.SHORT_CIRCUIT]
                            : undefined,
                        [UserQuotaNb.VOLTAGE_INIT]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.VOLTAGE_INIT]
                            : undefined,
                        [UserQuotaNb.PCC_MIN]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.PCC_MIN]
                            : undefined,
                        [UserQuotaNb.STATE_ESTIMATION]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.STATE_ESTIMATION]
                            : undefined,
                        [UserQuotaNb.BALANCE_ADJUSTEMENT]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.BALANCE_ADJUSTEMENT]
                            : undefined,
                        [UserQuotaNb.DYNAMIC_SIMULATION_INIT]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.DYNAMIC_SIMULATION]
                            : undefined,
                        [UserQuotaNb.DYNAMIC_SECURITY_INIT]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.DYNAMIC_SECURITY]
                            : undefined,
                        [UserQuotaNb.DYNAMIC_MARGIN_INIT]: response.maxOperationQuota
                            ? response.maxOperationQuota[MaxAllowedKeys.DYNAMIC_MARGIN]
                            : undefined,
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
