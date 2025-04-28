/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ProfileModificationForm, {
    GROUP_NAME,
    GroupModificationFormType,
    GroupModificationSchema,
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
    const { reset } = formMethods;
    const [userOptions, setUserOptions] = useState<string[]>([]);
    const [dataFetchStatus, setDataFetchStatus] = useState<string>(FetchStatus.IDLE);

    useEffect(() => {
        if (groupInfos && open) {
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
    }, [open, snackError, groupInfos]);

    useEffect(() => {
        if (groupInfos && open) {
            reset({
                [GROUP_NAME]: groupInfos.name,
            });
        }
    }, [groupInfos, open, reset]);

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
                    users: [],
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
        [onUpdate, snackError, groupInfos]
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
        >
            {isDataReady && <ProfileModificationForm usersOptions={userOptions} />}
        </CustomMuiDialog>
    );
};

export default GroupModificationDialog;
