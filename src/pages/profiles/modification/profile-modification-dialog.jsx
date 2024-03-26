/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ProfileModificationForm, {
    LF_PARAM_ID,
    PROFILE_NAME,
} from './profile-modification-form';
import yup from 'utils/yup-config';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { getProfile, modifyProfile } from 'services/user-admin';
import PropTypes from 'prop-types';
import CustomMuiDialog from '../../../components/custom-mui-dialog';

// TODO remove FetchStatus when available in commons-ui (available soon)
export const FetchStatus = {
    IDLE: 'IDLE',
    FETCHING: 'FETCHING',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
};

const ProfileModificationDialog = ({ profileId, open, onClose, onUpdate }) => {
    const { snackError } = useSnackMessage();
    const [dataFetchStatus, setDataFetchStatus] = useState(FetchStatus.IDLE);

    const formSchema = yup
        .object()
        .shape({
            [PROFILE_NAME]: yup.string().trim().required('nameEmpty'),
            [LF_PARAM_ID]: yup.string().optional(),
        })
        .required();

    const formMethods = useForm({
        resolver: yupResolver(formSchema),
    });

    const { reset } = formMethods;

    const onSubmit = (profileFormData) => {
        modifyProfile(
            profileId,
            profileFormData[PROFILE_NAME],
            profileFormData[LF_PARAM_ID]
        )
            .catch((error) => {
                snackError({
                    messageTxt: error.message,
                    headerId: 'profiles.form.modification.updateError',
                });
            })
            .then(() => {
                onUpdate();
            });
    };

    useEffect(() => {
        if (profileId && open) {
            setDataFetchStatus(FetchStatus.FETCHING);
            getProfile(profileId)
                .then((response) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    reset({
                        [PROFILE_NAME]: response.name,
                        [LF_PARAM_ID]: response.loadFlowParameterId
                            ? response.loadFlowParameterId
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

    const isDataReady = dataFetchStatus === FetchStatus.FETCH_SUCCESS;

    return (
        <CustomMuiDialog
            open={open}
            onClose={onClose}
            onSave={onSubmit}
            formSchema={formSchema}
            formMethods={formMethods}
            titleId={'profiles.form.modification.title'}
            removeOptional={true}
            isDataFetching={dataFetchStatus === FetchStatus.FETCHING}
        >
            {isDataReady && <ProfileModificationForm />}
        </CustomMuiDialog>
    );
};

ProfileModificationDialog.propTypes = {
    profileId: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
};

export default ProfileModificationDialog;
