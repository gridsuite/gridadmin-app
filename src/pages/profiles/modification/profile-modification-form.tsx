/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ElementType, IntegerInput, TextInput } from '@gridsuite/commons-ui';
import Grid from '@mui/material/Grid';
import ConfigurationSelection from './configuration-selection';
import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent } from 'react';

export const PROFILE_NAME = 'name';
export const LOADFLOW_PARAM_ID = 'loadFlowParamId';
export const SECURITY_ANALYSIS_PARAM_ID = 'securityAnalysisParamId';
export const SENSITIVITY_ANALYSIS_PARAM_ID = 'sensitivityAnalysisParamId';
export const SHORTCIRCUIT_PARAM_ID = 'shortcircuitParamId';
export const VOLTAGE_INIT_PARAM_ID = 'voltageInitParamId';
export const SPREADSHEET_CONFIG_COLLECTION_ID = 'spreadsheetConfigCollectionId';
export const NETWORK_VISUALIZATION_PARAMETERS_ID = 'networkVisualizationParametersId';

export const USER_QUOTA_CASE_NB = 'userQuotaCaseNb';
export const USER_QUOTA_BUILD_NB = 'userQuotaBuildNb';

const ProfileModificationForm: FunctionComponent = () => {
    return (
        <Grid container spacing={2} marginTop={'auto'}>
            <Grid item xs={12}>
                <TextInput name={PROFILE_NAME} label={'profiles.table.id'} clearable={false} />
            </Grid>
            <Grid item xs={12}>
                <h3>
                    <FormattedMessage id={'profiles.form.modification.defaultConfigurations'} />
                </h3>
            </Grid>
            <Grid item xs={12}>
                <ConfigurationSelection
                    elementType={ElementType.LOADFLOW_PARAMETERS}
                    selectionFormId={LOADFLOW_PARAM_ID}
                />
            </Grid>
            <Grid item xs={12}>
                <ConfigurationSelection
                    elementType={ElementType.SECURITY_ANALYSIS_PARAMETERS}
                    selectionFormId={SECURITY_ANALYSIS_PARAM_ID}
                />
            </Grid>
            <Grid item xs={12}>
                <ConfigurationSelection
                    elementType={ElementType.SENSITIVITY_PARAMETERS}
                    selectionFormId={SENSITIVITY_ANALYSIS_PARAM_ID}
                />
            </Grid>
            <Grid item xs={12}>
                <ConfigurationSelection
                    elementType={ElementType.SHORT_CIRCUIT_PARAMETERS}
                    selectionFormId={SHORTCIRCUIT_PARAM_ID}
                />
            </Grid>
            <Grid item xs={12}>
                <ConfigurationSelection
                    elementType={ElementType.VOLTAGE_INIT_PARAMETERS}
                    selectionFormId={VOLTAGE_INIT_PARAM_ID}
                />
            </Grid>
            <Grid item xs={12}>
                <ConfigurationSelection
                    elementType={ElementType.SPREADSHEET_CONFIG_COLLECTION}
                    selectionFormId={SPREADSHEET_CONFIG_COLLECTION_ID}
                />
            </Grid>
            <Grid item xs={12}>
                <ConfigurationSelection
                    elementType={ElementType.NETWORK_VISUALIZATIONS_PARAMETERS}
                    selectionFormId={NETWORK_VISUALIZATION_PARAMETERS_ID}
                />
            </Grid>
            <Grid item xs={12}>
                <h3>
                    <FormattedMessage id={'profiles.form.modification.userQuotas'} />
                </h3>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_CASE_NB}
                        label="profiles.form.modification.numberOfCasesOrStudies"
                        clearable={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_BUILD_NB}
                        label="profiles.form.modification.numberOfNodeBuilds"
                        clearable={true}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProfileModificationForm;
