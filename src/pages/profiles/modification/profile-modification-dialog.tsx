/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ProfileModificationForm, {
    LF_PARAM_ID,
    PROFILE_NAME,
    USER_QUOTAS,
} from './profile-modification-form';
import yup from '../../../utils/yup-config';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { CustomMuiDialog, useSnackMessage } from '@gridsuite/commons-ui';
import { UserAdminSrv, UserProfile } from '../../../services';
import { UUID } from 'crypto';

// TODO remove FetchStatus when exported in commons-ui (available soon)
export enum FetchStatus {
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

const ProfileModificationDialog: FunctionComponent<
    ProfileModificationDialogProps
> = ({ profileId, open, onClose, onUpdate }) => {
    const { snackError } = useSnackMessage();
    const [dataFetchStatus, setDataFetchStatus] = useState<FetchStatus>(
        FetchStatus.IDLE
    );

    const formSchema = yup
        .object()
        .shape({
            [PROFILE_NAME]: yup.string().trim().required('nameEmpty'),
            [LF_PARAM_ID]: yup.string().optional(),
            [USER_QUOTAS]: yup
                .number()
                .positive('userQuotaPositive')
                .nullable(),
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
                    loadFlowParameterId: profileFormData[LF_PARAM_ID],
                    maxAllowedCases: profileFormData[USER_QUOTAS],
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
                        [LF_PARAM_ID]: response.loadFlowParameterId
                            ? response.loadFlowParameterId
                            : undefined,
                        [USER_QUOTAS]: response.maxAllowedCases,
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

    const isDataReady = useMemo(
        () => dataFetchStatus === FetchStatus.FETCH_SUCCESS,
        [dataFetchStatus]
    );

    const isDataFetching = useMemo(
        () => dataFetchStatus === FetchStatus.FETCHING,
        [dataFetchStatus]
    );

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
