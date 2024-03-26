/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { TextInput } from '@gridsuite/commons-ui';
import Grid from '@mui/material/Grid';
import ParameterSelection, {
    ElementType,
} from '../../../components/parameter-selection';
import { FormattedMessage } from 'react-intl';

export const PROFILE_NAME = 'name';
export const LF_PARAM_ID = 'lfParamId';
export const LF_PARAM_FULL_NAME = 'lfFullName';

const ProfileModificationForm = () => {
    return (
        <Grid container spacing={2} marginTop={'auto'}>
            <Grid item xs={12} align={'start'}>
                <TextInput
                    name={PROFILE_NAME}
                    label={'profiles.table.id'}
                    clearable={false}
                />
            </Grid>
            <Grid item xs={12} align={'start'}>
                <h3>
                    <FormattedMessage
                        id={'profiles.form.modification.defaultParameters'}
                    />
                </h3>
            </Grid>
            <Grid item xs={12} align={'start'}>
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
