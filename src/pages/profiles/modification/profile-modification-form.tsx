/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ElementType, TextInput } from '@gridsuite/commons-ui';
import Grid from '@mui/material/Grid';
import ParameterSelection from './parameter-selection';
import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent } from 'react';

export const PROFILE_NAME = 'name';
export const LF_PARAM_ID = 'lfParamId';

const ProfileModificationForm: FunctionComponent = () => {
    return (
        <Grid container spacing={2} marginTop={'auto'}>
            <Grid item xs={12}>
                <TextInput
                    name={PROFILE_NAME}
                    label={'profiles.table.id'}
                    clearable={false}
                />
            </Grid>
            <Grid item xs={12}>
                <h3>
                    <FormattedMessage
                        id={'profiles.form.modification.defaultParameters'}
                    />
                </h3>
            </Grid>
            <Grid item xs={12}>
                <ParameterSelection
                    elementType={ElementType.LOADFLOW_PARAMETERS}
                    parameterFormId={LF_PARAM_ID}
                    parameterNameKey={
                        'profiles.form.modification.loadflow.name'
                    }
                />
            </Grid>
        </Grid>
    );
};

export default ProfileModificationForm;
