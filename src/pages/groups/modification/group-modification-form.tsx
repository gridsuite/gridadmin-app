/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TextInput } from '@gridsuite/commons-ui';
import Grid from '@mui/material/Grid';
import React, { FunctionComponent } from 'react';
import yup from '../../../utils/yup-config';

export const GROUP_NAME = 'name';

export const GroupModificationSchema = yup
    .object()
    .shape({
        [GROUP_NAME]: yup.string().trim().required('nameEmpty'),
    })
    .required();

export type GroupModificationFormType = yup.InferType<typeof GroupModificationSchema>;

interface GroupModificationFormProps {
    usersOptions: string[];
}

const GroupModificationForm: FunctionComponent<GroupModificationFormProps> = ({ usersOptions }) => {
    return (
        <Grid container spacing={2} marginTop={'auto'}>
            <Grid item xs={12}>
                <TextInput name={GROUP_NAME} label={'groups.table.id'} clearable={true} />
            </Grid>
        </Grid>
    );
};

export default GroupModificationForm;
