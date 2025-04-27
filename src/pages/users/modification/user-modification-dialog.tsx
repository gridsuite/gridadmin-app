/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ProfileModificationForm, {
    USER_NAME,
    USER_PROFILE_NAME,
    UserModificationFormType,
    UserModificationSchema,
} from './user-modification-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { CustomMuiDialog, FetchStatus, useSnackMessage } from '@gridsuite/commons-ui';
import { UpdateUserInfos, UserAdminSrv, UserInfos, UserProfile } from '../../../services';

interface UserModificationDialogProps {
    userInfos: UserInfos | undefined;
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const UserModificationDialog: FunctionComponent<UserModificationDialogProps> = ({
    userInfos,
    open,
    onClose,
    onUpdate,
}) => {
    const { snackError } = useSnackMessage();
    const formMethods = useForm({
        resolver: yupResolver(UserModificationSchema),
    });
    const { reset } = formMethods;
    const [profileOptions, setprofileOptions] = useState<string[]>([]);
    const [dataFetchStatus, setDataFetchStatus] = useState<string>(FetchStatus.IDLE);

    useEffect(() => {
        // fetch available profiles
        if (userInfos && open) {
            setDataFetchStatus(FetchStatus.FETCHING);
            UserAdminSrv.fetchProfilesWithoutValidityCheck()
                .then((allProfiles: UserProfile[]) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    setprofileOptions(
                        allProfiles.map((p) => p.name).sort((a: string, b: string) => a.localeCompare(b))
                    );
                })
                .catch((error) => {
                    setDataFetchStatus(FetchStatus.FETCH_ERROR);
                    snackError({
                        messageTxt: error.message,
                        headerId: 'users.table.error.profiles',
                    });
                });
        }
    }, [open, snackError, userInfos]);

    useEffect(() => {
        if (userInfos && open) {
            reset({
                [USER_NAME]: userInfos.sub,
                [USER_PROFILE_NAME]: userInfos.profileName,
            });
        }
    }, [userInfos, open, reset]);

    const onDialogClose = useCallback(() => {
        setDataFetchStatus(FetchStatus.IDLE);
        onClose();
    }, [onClose]);

    const onSubmit = useCallback(
        (userFormData: UserModificationFormType) => {
            if (userInfos) {
                console.log('DBG DBR', userFormData, userInfos);
                const newData: UpdateUserInfos = {
                    sub: userInfos.sub, // sub cannot be changed, it is a PK in database
                    isAdmin: userInfos.isAdmin, // cannot be changed for now
                    profileName: userFormData.profileName ?? undefined,
                    groups: [],
                };
                UserAdminSrv.udpateUser(newData)
                    .catch((error) =>
                        snackError({
                            messageTxt: error.message,
                            headerId: 'users.table.error.update',
                        })
                    )
                    .then(() => {
                        onUpdate();
                    });
            }
        },
        [onUpdate, snackError, userInfos]
    );

    const isDataReady = useMemo(() => dataFetchStatus === FetchStatus.FETCH_SUCCESS, [dataFetchStatus]);
    const isDataFetching = useMemo(() => dataFetchStatus === FetchStatus.FETCHING, [dataFetchStatus]);

    return (
        <CustomMuiDialog
            open={open}
            onClose={onDialogClose}
            onSave={onSubmit}
            formSchema={UserModificationSchema}
            formMethods={formMethods}
            titleId={'profiles.form.modification.title'}
            removeOptional={true}
            isDataFetching={isDataFetching}
        >
            {isDataReady && <ProfileModificationForm profileOptions={profileOptions} />}
        </CustomMuiDialog>
    );
};

export default UserModificationDialog;
