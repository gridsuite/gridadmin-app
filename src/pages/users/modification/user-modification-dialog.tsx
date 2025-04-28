/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import UserModificationForm, {
    USER_NAME,
    USER_PROFILE_NAME,
    USER_SELECTED_GROUPS,
    UserModificationFormType,
    UserModificationSchema,
} from './user-modification-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { CustomMuiDialog, FetchStatus, useSnackMessage } from '@gridsuite/commons-ui';
import { GroupInfos, UpdateUserInfos, UserAdminSrv, UserInfos, UserProfile } from '../../../services';

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
    const { reset, setValue } = formMethods;
    const [profileOptions, setProfileOptions] = useState<string[]>([]);
    const [groupOptions, setGroupOptions] = useState<string[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [dataFetchStatus, setDataFetchStatus] = useState<string>(FetchStatus.IDLE);

    useEffect(() => {
        if (userInfos && open) {
            setSelectedGroups(userInfos.groups);
            // fetch profile & groups
            setDataFetchStatus(FetchStatus.FETCHING);
            let fetcherPromises: Promise<unknown>[] = [];
            const profilePromise = UserAdminSrv.fetchProfilesWithoutValidityCheck();
            const groupPromise = UserAdminSrv.fetchGroups();
            fetcherPromises.push(profilePromise);
            fetcherPromises.push(groupPromise);

            profilePromise
                .then((allProfiles: UserProfile[]) => {
                    setProfileOptions(
                        allProfiles.map((p) => p.name).sort((a: string, b: string) => a.localeCompare(b))
                    );
                })
                .catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'users.table.error.profiles',
                    });
                });

            groupPromise
                .then((allGroups: GroupInfos[]) => {
                    setGroupOptions(allGroups.map((g) => g.name).sort((a: string, b: string) => a.localeCompare(b)));
                })
                .catch((error) => {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'users.table.error.groups',
                    });
                });

            Promise.all(fetcherPromises)
                .then(() => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                })
                .catch(() => {
                    setDataFetchStatus(FetchStatus.FETCH_ERROR);
                });
        }
    }, [open, snackError, userInfos]);

    useEffect(() => {
        if (userInfos && open) {
            const sortedGroups = Array.from(userInfos.groups).sort((a, b) => a.localeCompare(b));
            reset({
                [USER_NAME]: userInfos.sub,
                [USER_PROFILE_NAME]: userInfos.profileName,
                [USER_SELECTED_GROUPS]: JSON.stringify(sortedGroups), // only used to dirty the form
            });
        }
    }, [userInfos, open, reset]);

    const onDialogClose = useCallback(() => {
        setDataFetchStatus(FetchStatus.IDLE);
        onClose();
    }, [onClose]);

    const onSelectionChanged = useCallback(
        (selectedItems: string[]) => {
            if (userInfos) {
                setSelectedGroups(selectedItems);
                selectedItems.sort((a, b) => a.localeCompare(b));
                setValue(USER_SELECTED_GROUPS, JSON.stringify(selectedItems), {
                    shouldDirty: true,
                });
            }
        },
        [setValue, userInfos]
    );

    const onSubmit = useCallback(
        (userFormData: UserModificationFormType) => {
            if (userInfos) {
                const newData: UpdateUserInfos = {
                    sub: userInfos.sub, // sub cannot be changed, it is a PK in database
                    isAdmin: userInfos.isAdmin, // cannot be changed for now
                    profileName: userFormData.profileName ?? undefined,
                    groups: selectedGroups,
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
        [onUpdate, selectedGroups, snackError, userInfos]
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
            titleId={'users.form.modification.title'}
            removeOptional={true}
            isDataFetching={isDataFetching}
            unscrollableFullHeight
        >
            {isDataReady && (
                <UserModificationForm
                    profileOptions={profileOptions}
                    groupOptions={groupOptions}
                    selectedGroups={selectedGroups}
                    onSelectionChanged={onSelectionChanged}
                />
            )}
        </CustomMuiDialog>
    );
};

export default UserModificationDialog;
