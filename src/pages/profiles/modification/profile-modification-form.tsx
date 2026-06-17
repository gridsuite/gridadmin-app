/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ElementType, IntegerInput, TextInput } from '@gridsuite/commons-ui';
import Grid from '@mui/material/Grid';
import ConfigurationSelection, { ConfigSelectionProps } from './configuration-selection';
import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent } from 'react';

export const PROFILE_NAME = 'name';
export const LOADFLOW_PARAM_ID = 'loadFlowParamId';
export const SECURITY_ANALYSIS_PARAM_ID = 'securityAnalysisParamId';
export const SENSITIVITY_ANALYSIS_PARAM_ID = 'sensitivityAnalysisParamId';
export const SHORTCIRCUIT_PARAM_ID = 'shortcircuitParamId';
export const PCCMIN_PARAM_ID = 'pccminParamId';
export const VOLTAGE_INIT_PARAM_ID = 'voltageInitParamId';
export const SPREADSHEET_CONFIG_COLLECTION_ID = 'spreadsheetConfigCollectionId';
export const NETWORK_VISUALIZATION_PARAMETERS_ID = 'networkVisualizationParametersId';
export const WORKSPACE_ID = 'workspaceId';

export const USER_QUOTA_CASE_NB = 'userQuotaCaseNb';
export const USER_QUOTA_BUILD_NB = 'userQuotaBuildNb';
export const USER_QUOTA_LOADFLOW_NB = 'userQuotaLoadflowNb';
export const USER_QUOTA_SECURITY_NB = 'userQuotaSecurityNb';
export const USER_QUOTA_SENSITIVITY_NB = 'userQuotaSensitivityNb';
export const USER_QUOTA_SHORTCIRCUIT_NB = 'userQuotaShortcircuitNb';
export const USER_QUOTA_VOLTAGE_INIT_NB = 'userQuotaVoltageInitNb';
export const USER_QUOTA_PCC_MIN_NB = 'userQuotaPccminNb';
export const USER_QUOTA_STATE_ESTIMATION_NB = 'userQuotaStateEstimationNb';
export const USER_QUOTA_BALANCE_ADJUSTEMENT_NB = 'userQuotaBalanceAdjustementNb';
export const USER_QUOTA_DYNAMIC_SIMULATION_INIT_NB = 'userQuotaDynamicSimulationInitNb';
export const USER_QUOTA_DYNAMIC_SECURITY_INIT_NB = 'userQuotaDynamicSecurityInitNb';
export const USER_QUOTA_DYNAMIC_MARGIN_INIT_NB = 'userQuotaDynamicMarginInitNb';

const configList: ConfigSelectionProps[] = [
    { selectionFormId: LOADFLOW_PARAM_ID, elementType: ElementType.LOADFLOW_PARAMETERS },
    { selectionFormId: SECURITY_ANALYSIS_PARAM_ID, elementType: ElementType.SECURITY_ANALYSIS_PARAMETERS },
    { selectionFormId: SENSITIVITY_ANALYSIS_PARAM_ID, elementType: ElementType.SENSITIVITY_PARAMETERS },
    { selectionFormId: SHORTCIRCUIT_PARAM_ID, elementType: ElementType.SHORT_CIRCUIT_PARAMETERS },
    { selectionFormId: PCCMIN_PARAM_ID, elementType: ElementType.PCC_MIN_PARAMETERS },
    { selectionFormId: VOLTAGE_INIT_PARAM_ID, elementType: ElementType.VOLTAGE_INIT_PARAMETERS },
    { selectionFormId: SPREADSHEET_CONFIG_COLLECTION_ID, elementType: ElementType.SPREADSHEET_CONFIG_COLLECTION },
    {
        selectionFormId: NETWORK_VISUALIZATION_PARAMETERS_ID,
        elementType: ElementType.NETWORK_VISUALIZATIONS_PARAMETERS,
    },
    { selectionFormId: WORKSPACE_ID, elementType: ElementType.WORKSPACE },
];

const ProfileModificationForm: FunctionComponent = () => {
    return (
        <Grid container spacing={2} marginTop={'auto'}>
            <Grid item xs={12}>
                <TextInput name={PROFILE_NAME} label={'profiles.table.id'} clearable={true} />
            </Grid>
            <Grid item xs={12}>
                <h3>
                    <FormattedMessage id={'profiles.form.modification.defaultConfigurations'} />
                </h3>
            </Grid>
            {configList.map((config) => {
                return (
                    <Grid item xs={12} key={config.selectionFormId}>
                        <ConfigurationSelection
                            elementType={config.elementType}
                            selectionFormId={config.selectionFormId}
                        />
                    </Grid>
                );
            })}
            <Grid item xs={12}>
                <h3>
                    <FormattedMessage id={'profiles.form.modification.userQuotas'} />
                </h3>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: 0 }}>
                <h4>
                    <FormattedMessage id={'profiles.form.modification.userCaseAndBuildsQuotas'} />
                </h4>
            </Grid>
            <Grid container spacing={2} direction="row" marginLeft={'auto'}>
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
            <Grid item xs={12} style={{ paddingTop: 0 }}>
                <h4>
                    <FormattedMessage id={'profiles.form.modification.parallelExecutionsQuotas'} />
                </h4>
            </Grid>
            <Grid container spacing={2} direction="row" marginLeft={'auto'}>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_LOADFLOW_NB}
                        label="profiles.form.modification.numberOfLoadflow"
                        clearable={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_SECURITY_NB}
                        label="profiles.form.modification.numberOfSecurityAnalysis"
                        clearable={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_SENSITIVITY_NB}
                        label="profiles.form.modification.numberOfSensitivityAnalysis"
                        clearable={true}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} direction="row" marginLeft={'auto'} paddingTop={1}>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_SHORTCIRCUIT_NB}
                        label="profiles.form.modification.numberOfShortcircuitAnalysis"
                        clearable={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_VOLTAGE_INIT_NB}
                        label="profiles.form.modification.numberOfVoltageInit"
                        clearable={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_PCC_MIN_NB}
                        label="profiles.form.modification.numberOfPccmin"
                        clearable={true}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} direction="row" marginLeft={'auto'} paddingTop={1}>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_STATE_ESTIMATION_NB}
                        label="profiles.form.modification.numberOfStateEstimation"
                        clearable={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_BALANCE_ADJUSTEMENT_NB}
                        label="profiles.form.modification.numberOfBalanceAdjustement"
                        clearable={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_DYNAMIC_SIMULATION_INIT_NB}
                        label="profiles.form.modification.numberOfDynamicSimulation"
                        clearable={true}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} direction="row" marginLeft={'auto'} paddingTop={1}>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_DYNAMIC_SECURITY_INIT_NB}
                        label="profiles.form.modification.numberOfDynamicSecurity"
                        clearable={true}
                    />
                </Grid>
                <Grid item xs={4}>
                    <IntegerInput
                        name={USER_QUOTA_DYNAMIC_MARGIN_INIT_NB}
                        label="profiles.form.modification.numberOfDynamicMargin"
                        clearable={true}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProfileModificationForm;
