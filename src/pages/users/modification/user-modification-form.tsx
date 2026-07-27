/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useMemo, type FunctionComponent } from 'react';
import { Grid, IconButton, Tooltip } from '@mui/material';
import * as yup from 'yup';
import { AutocompleteInput, snackWithFallback, TextInput, useSnackMessage } from '@gridsuite/commons-ui';
import TableSelection from '../../common/table-selection';
import { useIntl } from 'react-intl';
import { ColDef } from 'ag-grid-community';
import { useWatch } from 'react-hook-form';
import { LockReset } from '@mui/icons-material';
import { UserAdminSrv } from '../../../services';

export const USER_NAME = 'sub';
export const USER_FULL_NAME = 'fullName';
export const USER_PROFILE_NAME = 'profileName';
export const USER_SELECTED_GROUPS = 'groups';

export const UserModificationSchema = yup
    .object()
    .shape({
        [USER_NAME]: yup.string().trim().required('nameEmpty'),
        [USER_FULL_NAME]: yup.string().nullable(),
        [USER_PROFILE_NAME]: yup.string().nullable(),
        [USER_SELECTED_GROUPS]: yup.string().nullable(),
    })
    .required();

export type UserModificationFormType = yup.InferType<typeof UserModificationSchema>;

export interface GroupSelectionItem {
    name: string;
}
interface UserModificationFormProps {
    profileOptions: string[];
    groupOptions: GroupSelectionItem[];
    selectedGroups?: string[];
    onSelectionChanged: (selectedItems: string[]) => void;
}

const UserModificationForm: FunctionComponent<UserModificationFormProps> = ({
    profileOptions,
    groupOptions,
    selectedGroups,
    onSelectionChanged,
}) => {
    const intl = useIntl();
    const { snackError, snackSuccess } = useSnackMessage();
    const sub = useWatch({ name: USER_NAME });

    const handleResetQuota = useCallback(() => {
        if (!sub) {
            return;
        }
        UserAdminSrv.resetUserCurrentQuotaUsage(sub)
            .then(() => snackSuccess({ headerId: 'users.table.success.resetQuota' }))
            .catch((error) => snackWithFallback(snackError, error, { headerId: 'users.table.error.resetQuota' }));
    }, [sub, snackError, snackSuccess]);

    const groupColumnDefs = useMemo(
        (): ColDef<GroupSelectionItem>[] => [
            {
                field: 'name',
                headerName: intl.formatMessage({ id: 'groups.table.id' }),
                tooltipField: 'name',
            },
        ],
        [intl]
    );

    return (
        <Grid container spacing={2} marginTop={2} sx={{ height: '100%', width: '100%' }}>
            <Grid sx={{ width: '100%' }}>
                <TextInput
                    name={USER_NAME}
                    label={'users.table.id'}
                    clearable={false}
                    formProps={{ disabled: true, style: { fontStyle: 'italic' } }}
                />
            </Grid>
            <Grid sx={{ width: '100%' }}>
                <TextInput
                    name={USER_FULL_NAME}
                    label={'users.table.fullName'}
                    clearable={false}
                    formProps={{ disabled: true, style: { fontStyle: 'italic' } }}
                />
            </Grid>
            <Grid sx={{ width: '100%' }}>
                <Grid container columns={24} columnSpacing={3} alignItems="center">
                    <Grid size={23}>
                        <AutocompleteInput
                            name={USER_PROFILE_NAME}
                            label={'users.table.profileName'}
                            size="small"
                            forcePopupIcon
                            autoHighlight
                            selectOnFocus
                            id="user-profile"
                            options={profileOptions}
                        />
                    </Grid>
                    <Grid size={1}>
                        <Tooltip
                            title={intl.formatMessage({
                                id: 'users.table.resetQuota.tooltip',
                            })}
                        >
                            <IconButton edge="start" onClick={handleResetQuota}>
                                <LockReset color="action" />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid sx={{ height: '85%', width: '100%' }}>
                <TableSelection<GroupSelectionItem>
                    titleId="users.table.groups"
                    items={groupOptions}
                    getItemId={(group) => group.name}
                    columnDefs={groupColumnDefs}
                    selectedIds={selectedGroups}
                    onSelectionChanged={onSelectionChanged}
                />
            </Grid>
        </Grid>
    );
};

export default UserModificationForm;
