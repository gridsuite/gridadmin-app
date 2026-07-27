/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ElementType, IntegerInput, TextInput } from '@gridsuite/commons-ui';
import { Grid } from '@mui/material';
import ConfigurationSelection, { ConfigSelectionProps } from './configuration-selection';
import { FormattedMessage } from 'react-intl';
import React, { FunctionComponent } from 'react';
import { UserQuotaNb } from './user-quota-nb';

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
        <Grid container spacing={2} marginTop={2} sx={{ width: '100%' }}>
            <Grid sx={{ width: '100%' }}>
                <TextInput name={PROFILE_NAME} label={'profiles.table.id'} clearable={true} />
            </Grid>
            <Grid sx={{ width: '100%' }}>
                <h3>
                    <FormattedMessage id={'profiles.form.modification.defaultConfigurations'} />
                </h3>
            </Grid>
            {configList.map((config) => {
                return (
                    <Grid key={config.selectionFormId} sx={{ width: '100%' }}>
                        <ConfigurationSelection
                            elementType={config.elementType}
                            selectionFormId={config.selectionFormId}
                        />
                    </Grid>
                );
            })}
            <Grid sx={{ width: '100%' }}>
                <h3>
                    <FormattedMessage id={'profiles.form.modification.userQuotas'} />
                </h3>
            </Grid>
            <Grid container spacing={2} direction="row" marginLeft={'auto'} sx={{ width: '100%' }}>
                <Grid sx={{ width: '100%' }}>
                    <h4>
                        <FormattedMessage id={'profiles.form.modification.userCaseAndBuildsQuotas'} />
                    </h4>
                </Grid>
                <Grid container spacing={2} direction="row" marginLeft={'auto'} sx={{ width: '100%' }}>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.CASE}
                            label="profiles.form.modification.numberOfCasesOrStudies"
                            clearable={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.BUILD}
                            label="profiles.form.modification.numberOfNodeBuilds"
                            clearable={true}
                        />
                    </Grid>
                </Grid>
                <Grid sx={{ width: '100%' }}>
                    <h4>
                        <FormattedMessage id={'profiles.form.modification.parallelExecutionsQuotas'} />
                    </h4>
                </Grid>
                <Grid container spacing={2} direction="row" marginLeft={'auto'} sx={{ width: '100%' }}>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.LOADFLOW}
                            label="profiles.form.modification.numberOfLoadflow"
                            clearable={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.SECURITY}
                            label="profiles.form.modification.numberOfSecurityAnalysis"
                            clearable={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.SENSITIVITY}
                            label="profiles.form.modification.numberOfSensitivityAnalysis"
                            clearable={true}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} direction="row" marginLeft={'auto'} sx={{ width: '100%' }}>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.SHORTCIRCUIT}
                            label="profiles.form.modification.numberOfShortcircuitAnalysis"
                            clearable={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.VOLTAGE_INIT}
                            label="profiles.form.modification.numberOfVoltageInit"
                            clearable={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.PCC_MIN}
                            label="profiles.form.modification.numberOfPccmin"
                            clearable={true}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} direction="row" marginLeft={'auto'} sx={{ width: '100%' }}>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.STATE_ESTIMATION}
                            label="profiles.form.modification.numberOfStateEstimation"
                            clearable={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.BALANCE_ADJUSTEMENT}
                            label="profiles.form.modification.numberOfBalanceAdjustement"
                            clearable={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.DYNAMIC_SIMULATION_INIT}
                            label="profiles.form.modification.numberOfDynamicSimulation"
                            clearable={true}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} direction="row" marginLeft={'auto'} sx={{ width: '100%' }}>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.DYNAMIC_SECURITY_INIT}
                            label="profiles.form.modification.numberOfDynamicSecurity"
                            clearable={true}
                        />
                    </Grid>
                    <Grid size={4}>
                        <IntegerInput
                            name={UserQuotaNb.DYNAMIC_MARGIN_INIT}
                            label="profiles.form.modification.numberOfDynamicMargin"
                            clearable={true}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ProfileModificationForm;
