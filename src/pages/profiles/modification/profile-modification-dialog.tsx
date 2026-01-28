/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ProfileModificationForm, {
    DIAGRAM_CONFIG_ID,
    LOADFLOW_PARAM_ID,
    NETWORK_VISUALIZATION_PARAMETERS_ID,
    PCCMIN_PARAM_ID,
    PROFILE_NAME,
    SECURITY_ANALYSIS_PARAM_ID,
    SENSITIVITY_ANALYSIS_PARAM_ID,
    SHORTCIRCUIT_PARAM_ID,
    SPREADSHEET_CONFIG_COLLECTION_ID,
    USER_QUOTA_BUILD_NB,
    USER_QUOTA_CASE_NB,
    VOLTAGE_INIT_PARAM_ID,
} from './profile-modification-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { CustomMuiDialog, FetchStatus, useSnackMessage, yupConfig as yup } from '@gridsuite/commons-ui';
import { UserAdminSrv, UserProfile } from '../../../services';
import type { UUID } from 'node:crypto';
import { InferType } from 'yup';

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
            [SPREADSHEET_CONFIG_COLLECTION_ID]: yup.string<UUID>().optional(),
            [NETWORK_VISUALIZATION_PARAMETERS_ID]: yup.string<UUID>().optional(),
            [DIAGRAM_CONFIG_ID]: yup.string<UUID>().optional(),
        })
        .required();

    type FormSchema = InferType<typeof formSchema>;

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
                    spreadsheetConfigCollectionId: profileFormData[SPREADSHEET_CONFIG_COLLECTION_ID],
                    networkVisualizationParameterId: profileFormData[NETWORK_VISUALIZATION_PARAMETERS_ID],
                    diagramConfigId: profileFormData[DIAGRAM_CONFIG_ID],
                };
                UserAdminSrv.modifyProfile(profileData)
                    .catch((error) => {
                        snackError({
                            messageTxt: error.message,
                            headerId: 'profiles.form.modification.updateError',
                        });
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
                        [SPREADSHEET_CONFIG_COLLECTION_ID]: response.spreadsheetConfigCollectionId ?? undefined,
                        [NETWORK_VISUALIZATION_PARAMETERS_ID]: response.networkVisualizationParameterId ?? undefined,
                        [DIAGRAM_CONFIG_ID]: response.diagramConfigId ?? undefined,
                    });
                })
                .catch((error) => {
                    setDataFetchStatus(FetchStatus.FETCH_ERROR);
                    snackError({
                        messageTxt: error.message,
                        headerId: 'profiles.form.modification.readError',
                    });
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
            formSchema={formSchema}
            formMethods={formMethods}
            titleId={'profiles.form.modification.title'}
            removeOptional={true}
            isDataFetching={isDataFetching}
        >
            {isDataReady && <ProfileModificationForm />}
        </CustomMuiDialog>
    );
};

export default ProfileModificationDialog;
