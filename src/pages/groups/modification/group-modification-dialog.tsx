/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import GroupModificationForm, {
    GROUP_NAME,
    GroupModificationFormType,
    GroupModificationSchema,
    SELECTED_USERS,
} from './group-modification-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { CustomMuiDialog, FetchStatus, useSnackMessage } from '@gridsuite/commons-ui';
import { GroupInfos, UpdateGroupInfos, UserAdminSrv, UserInfos } from '../../../services';

interface GroupModificationDialogProps {
    groupInfos: GroupInfos | undefined;
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const GroupModificationDialog: FunctionComponent<GroupModificationDialogProps> = ({
    groupInfos,
    open,
    onClose,
    onUpdate,
}) => {
    const { snackError } = useSnackMessage();
    const formMethods = useForm({
        resolver: yupResolver(GroupModificationSchema),
    });
    const { reset, setValue } = formMethods;
    const [userOptions, setUserOptions] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [dataFetchStatus, setDataFetchStatus] = useState<string>(FetchStatus.IDLE);

    useEffect(() => {
        if (groupInfos && open) {
            const sortedUsers = Array.from(groupInfos.users).sort((a, b) => a.localeCompare(b));
            reset({
                [GROUP_NAME]: groupInfos.name,
                [SELECTED_USERS]: JSON.stringify(sortedUsers), // only used to dirty the form
            });
            setSelectedUsers(groupInfos.users);

            // fetch all users
            setDataFetchStatus(FetchStatus.FETCHING);
            UserAdminSrv.fetchUsers()
                .then((allUsers: UserInfos[]) => {
                    setDataFetchStatus(FetchStatus.FETCH_SUCCESS);
                    setUserOptions(
                        allUsers?.map((p) => p.sub).sort((a: string, b: string) => a.localeCompare(b)) || []
                    );
                })
                .catch((error) => {
                    setDataFetchStatus(FetchStatus.FETCH_ERROR);
                    snackError({
                        messageTxt: error.message,
                        headerId: 'groups.table.error.users',
                    });
                });
        }
    }, [open, snackError, groupInfos, reset]);

    const onSelectionChanged = useCallback(
        (selectedItems: string[]) => {
            setSelectedUsers(selectedItems);
            selectedItems.sort((a, b) => a.localeCompare(b));
            setValue(SELECTED_USERS, JSON.stringify(selectedItems), {
                shouldDirty: true,
            });
        },
        [setValue]
    );

    const onDialogClose = useCallback(() => {
        setDataFetchStatus(FetchStatus.IDLE);
        onClose();
    }, [onClose]);

    const onSubmit = useCallback(
        (groupFormData: GroupModificationFormType) => {
            if (groupInfos?.id) {
                const newData: UpdateGroupInfos = {
                    id: groupInfos.id,
                    name: groupFormData.name,
                    users: selectedUsers,
                };
                UserAdminSrv.udpateGroup(newData)
                    .catch((error) =>
                        snackError({
                            messageTxt: error.message,
                            headerId: 'groups.table.error.update',
                        })
                    )
                    .then(() => {
                        onUpdate();
                    });
            }
        },
        [groupInfos?.id, selectedUsers, snackError, onUpdate]
    );

    const isDataReady = useMemo(() => dataFetchStatus === FetchStatus.FETCH_SUCCESS, [dataFetchStatus]);
    const isDataFetching = useMemo(() => dataFetchStatus === FetchStatus.FETCHING, [dataFetchStatus]);

    return (
        <CustomMuiDialog
            open={open}
            onClose={onDialogClose}
            onSave={onSubmit}
            formSchema={GroupModificationSchema}
            formMethods={formMethods}
            titleId={'groups.form.modification.title'}
            removeOptional={true}
            isDataFetching={isDataFetching}
            unscrollableFullHeight
        >
            {isDataReady && (
                <GroupModificationForm
                    usersOptions={userOptions}
                    selectedUsers={selectedUsers}
                    onSelectionChanged={onSelectionChanged}
                />
            )}
        </CustomMuiDialog>
    );
};

export default GroupModificationDialog;
