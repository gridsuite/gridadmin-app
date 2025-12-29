/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo, type FunctionComponent } from 'react';
import { Grid } from '@mui/material';
import { AutocompleteInput, TextInput, yupConfig as yup } from '@gridsuite/commons-ui';
import TableSelection from '../../common/table-selection';
import { useIntl } from 'react-intl';
import { ColDef } from 'ag-grid-community';

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
        <Grid item container spacing={2} marginTop={0} style={{ height: '100%' }}>
            <Grid item xs={12}>
                <TextInput
                    name={USER_NAME}
                    label={'users.table.id'}
                    clearable={false}
                    formProps={{ disabled: true, style: { fontStyle: 'italic' } }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextInput
                    name={USER_FULL_NAME}
                    label={'users.table.fullName'}
                    clearable={false}
                    formProps={{ disabled: true, style: { fontStyle: 'italic' } }}
                />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12} style={{ height: '85%' }}>
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
