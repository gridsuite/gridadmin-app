/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo, type FunctionComponent } from 'react';
import { Grid2 as Grid } from '@mui/material';
import * as yup from 'yup';
import { TextInput } from '@gridsuite/commons-ui';
import TableSelection from '../../common/table-selection';
import { useIntl } from 'react-intl';
import { ColDef } from 'ag-grid-community';

export const GROUP_NAME = 'name';
export const SELECTED_USERS = 'users';

export const GroupModificationSchema = yup
    .object()
    .shape({
        [GROUP_NAME]: yup.string().trim().required('nameEmpty'),
        [SELECTED_USERS]: yup.string().nullable(),
    })
    .required();

export type GroupModificationFormType = yup.InferType<typeof GroupModificationSchema>;
export interface UserSelectionItem {
    sub: string;
    fullName: string;
}

interface GroupModificationFormProps {
    usersOptions: UserSelectionItem[];
    selectedUsers?: string[];
    onSelectionChanged: (selectedItems: string[]) => void;
}

const GroupModificationForm: FunctionComponent<GroupModificationFormProps> = ({
    usersOptions,
    selectedUsers,
    onSelectionChanged,
}) => {
    const intl = useIntl();

    const userColumnDefs = useMemo(
        (): ColDef<UserSelectionItem>[] => [
            {
                field: 'sub',
                headerName: intl.formatMessage({ id: 'users.table.id' }),
                tooltipField: 'sub',
            },
            {
                field: 'fullName',
                headerName: intl.formatMessage({ id: 'users.table.fullName' }),
                tooltipField: 'fullName',
            },
        ],
        [intl]
    );

    return (
        <Grid container spacing={2} marginTop={0} sx={{ height: '100%', width: '100%' }}>
            <Grid sx={{ width: '100%' }}>
                <TextInput name={GROUP_NAME} label={'groups.table.id'} clearable={true} />
            </Grid>
            <Grid sx={{ height: '90%', width: '100%' }}>
                <TableSelection<UserSelectionItem>
                    titleId="groups.table.users"
                    items={usersOptions}
                    getItemId={(user) => user.sub}
                    columnDefs={userColumnDefs}
                    selectedIds={selectedUsers}
                    onSelectionChanged={onSelectionChanged}
                />
            </Grid>
        </Grid>
    );
};

export default GroupModificationForm;
