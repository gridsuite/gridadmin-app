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
import { styled } from '@mui/system';

export const PROFILE_NAME = 'name';
export const LF_PARAM_ID = 'lfParamId';
export const LF_PARAM_FULL_NAME = 'lfFullName';

export const GridSection = ({
    title,
    heading = '3',
    size = 12,
    customStyle = {},
}) => {
    const CustomTag = styled(`h${heading}`)(customStyle);
    return (
        <Grid container spacing={2}>
            <Grid item xs={size}>
                <CustomTag>
                    <FormattedMessage id={title} />
                </CustomTag>
            </Grid>
        </Grid>
    );
};

const ProfileModificationForm = () => {
    return (
        <>
            <Grid container spacing={2} marginTop={'auto'}>
                <Grid item xs={12} align={'start'}>
                    <TextInput
                        name={PROFILE_NAME}
                        label={'profiles.table.id'}
                        clearable={false}
                    />
                </Grid>
            </Grid>
            <GridSection title="profiles.form.modification.loadFlowSectionName" />
            <Grid container spacing={2}>
                <Grid item xs={12} align={'start'}>
                    <ParameterSelection
                        elementType={ElementType.LOADFLOW_PARAMETERS}
                        formParamId={LF_PARAM_ID}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default ProfileModificationForm;
