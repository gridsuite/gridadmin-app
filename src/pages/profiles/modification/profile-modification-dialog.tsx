/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ProfileModificationForm, {
    LOADFLOW_PARAM_ID,
    SECURITY_ANALYSIS_PARAM_ID,
    SENSITIVITY_ANALYSIS_PARAM_ID,
    SHORTCIRCUIT_PARAM_ID,
    VOLTAGE_INIT_PARAM_ID,
    SPREADSHEET_CONFIG_COLLECTION_ID,
    PROFILE_NAME,
    USER_QUOTA_BUILD_NB,
    USER_QUOTA_CASE_NB,
    NETWORK_VISUALIZATION_PARAMETERS_ID,
} from './profile-modification-form';
import yup from '../../../utils/yup-config';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { CustomMuiDialog, useSnackMessage } from '@gridsuite/commons-ui';
import { UserAdminSrv, UserProfile } from '../../../services';
import { UUID } from 'crypto';

// TODO remove FetchStatus when exported in commons-ui (available soon)
enum FetchStatus {
    IDLE = 'IDLE',
    FETCHING = 'FETCHING',
    FETCH_SUCCESS = 'FETCH_SUCCESS',
    FETCH_ERROR = 'FETCH_ERROR',
}

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
    const [dataFetchStatus, setDataFetchStatus] = useState<FetchStatus>(FetchStatus.IDLE);

    const formSchema = yup
        .object()
        .shape({
            [PROFILE_NAME]: yup.string().trim().required('nameEmpty'),
            [LOADFLOW_PARAM_ID]: yup.string().optional(),
            [SECURITY_ANALYSIS_PARAM_ID]: yup.string().optional(),
            [SENSITIVITY_ANALYSIS_PARAM_ID]: yup.string().optional(),
            [SHORTCIRCUIT_PARAM_ID]: yup.string().optional(),
            [VOLTAGE_INIT_PARAM_ID]: yup.string().optional(),
            [USER_QUOTA_CASE_NB]: yup.number().positive('userQuotaPositive').nullable(),
            [USER_QUOTA_BUILD_NB]: yup.number().positive('userQuotaPositive').nullable(),
            [SPREADSHEET_CONFIG_COLLECTION_ID]: yup.string().optional(),
            [NETWORK_VISUALIZATION_PARAMETERS_ID]: yup.string().optional(),
        })
        .required();

    const formMethods = useForm({
        resolver: yupResolver(formSchema),
    });

    const { reset } = formMethods;

    const onSubmit = useCallback(
        (profileFormData: any) => {
            if (profileId) {
                const profileData: UserProfile = {
                    id: profileId,
                    name: profileFormData[PROFILE_NAME],
                    loadFlowParameterId: profileFormData[LOADFLOW_PARAM_ID],
                    securityAnalysisParameterId: profileFormData[SECURITY_ANALYSIS_PARAM_ID],
                    sensitivityAnalysisParameterId: profileFormData[SENSITIVITY_ANALYSIS_PARAM_ID],
                    shortcircuitParameterId: profileFormData[SHORTCIRCUIT_PARAM_ID],
                    voltageInitParameterId: profileFormData[VOLTAGE_INIT_PARAM_ID],
                    maxAllowedCases: profileFormData[USER_QUOTA_CASE_NB],
                    maxAllowedBuilds: profileFormData[USER_QUOTA_BUILD_NB],
                    spreadsheetConfigCollectionId: profileFormData[SPREADSHEET_CONFIG_COLLECTION_ID],
                    networkVisualizationParameterId: profileFormData[NETWORK_VISUALIZATION_PARAMETERS_ID],
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
                        [LOADFLOW_PARAM_ID]: response.loadFlowParameterId ? response.loadFlowParameterId : undefined,
                        [SECURITY_ANALYSIS_PARAM_ID]: response.securityAnalysisParameterId
                            ? response.securityAnalysisParameterId
                            : undefined,
                        [SENSITIVITY_ANALYSIS_PARAM_ID]: response.sensitivityAnalysisParameterId
                            ? response.sensitivityAnalysisParameterId
                            : undefined,
                        [SHORTCIRCUIT_PARAM_ID]: response.shortcircuitParameterId
                            ? response.shortcircuitParameterId
                            : undefined,
                        [VOLTAGE_INIT_PARAM_ID]: response.voltageInitParameterId
                            ? response.voltageInitParameterId
                            : undefined,
                        [USER_QUOTA_CASE_NB]: response.maxAllowedCases,
                        [USER_QUOTA_BUILD_NB]: response.maxAllowedBuilds,
                        [SPREADSHEET_CONFIG_COLLECTION_ID]: response.spreadsheetConfigCollectionId
                            ? response.spreadsheetConfigCollectionId
                            : undefined,
                        [NETWORK_VISUALIZATION_PARAMETERS_ID]: response.networkVisualizationParameterId
                            ? response.networkVisualizationParameterId
                            : undefined,
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
