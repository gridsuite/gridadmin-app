/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TextInput } from '@gridsuite/commons-ui';
import { Grid } from '@mui/material';
import { type FunctionComponent } from 'react';
import TableSelection from '../../common/table-selection';

export const GROUP_NAME = 'name';
export const SELECTED_USERS = 'users';

interface GroupModificationFormProps {
    usersOptions: string[];
    selectedUsers?: string[];
    onSelectionChanged: (selectedItems: string[]) => void;
}

const GroupModificationForm: FunctionComponent<GroupModificationFormProps> = ({
    usersOptions,
    selectedUsers,
    onSelectionChanged,
}) => {
    return (
        <Grid item container spacing={2} marginTop={0} style={{ height: '100%' }}>
            <Grid item xs={12}>
                <TextInput name={GROUP_NAME} label={'groups.table.id'} clearable={true} />
            </Grid>
            <Grid item xs={12} style={{ height: '90%' }}>
                <TableSelection
                    itemName={'groups.table.users'}
                    tableItems={usersOptions}
                    tableSelectedItems={selectedUsers}
                    onSelectionChanged={onSelectionChanged}
                />
            </Grid>
        </Grid>
    );
};

export default GroupModificationForm;
