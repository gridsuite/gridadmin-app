/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useEffect, useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FolderIcon from '@mui/icons-material/Folder';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { useIntl } from 'react-intl';
import { DirectoryItemSelector, ElementType } from '@gridsuite/commons-ui';
import { useController, useWatch } from 'react-hook-form';
import { DirectorySrv } from '../../../services';
import LinkedPathDisplay from './linked-path-display';

export interface ConfigSelectionProps {
    elementType:
        | ElementType.LOADFLOW_PARAMETERS
        | ElementType.SECURITY_ANALYSIS_PARAMETERS
        | ElementType.SENSITIVITY_PARAMETERS
        | ElementType.SHORT_CIRCUIT_PARAMETERS
        | ElementType.VOLTAGE_INIT_PARAMETERS
        | ElementType.SPREADSHEET_CONFIG_COLLECTION
        | ElementType.NETWORK_VISUALIZATIONS_PARAMETERS;
    selectionFormId: string;
}

const ConfigurationSelection: FunctionComponent<ConfigSelectionProps> = (props) => {
    const intl = useIntl();

    const [openDirectorySelector, setOpenDirectorySelector] = useState<boolean>(false);
    const [selectedElementName, setSelectedElementName] = useState<string>();
    const [configLinkValid, setConfigLinkValid] = useState<boolean>();
    const watchConfigId = useWatch({
        name: props.selectionFormId,
    });
    const ctlConfigId = useController({
        name: props.selectionFormId,
    });

    useEffect(() => {
        if (!watchConfigId) {
            setSelectedElementName(undefined);
            setConfigLinkValid(undefined);
        } else {
            DirectorySrv.fetchPath(watchConfigId)
                .then((res: any) => {
                    setConfigLinkValid(true);
                    setSelectedElementName(res.map((element: any) => element.elementName.trim()).join('/'));
                })
                .catch(() => {
                    setSelectedElementName(undefined);
                    setConfigLinkValid(false);
                });
        }
    }, [watchConfigId]);

    const handleSelectFolder = () => {
        setOpenDirectorySelector(true);
    };

    const handleResetConfig = () => {
        ctlConfigId.field.onChange(undefined);
    };

    const handleClose = (selection: any) => {
        if (selection.length) {
            ctlConfigId.field.onChange(selection[0]?.id);
        }
        setOpenDirectorySelector(false);
    };

    const getConfigTranslationKey = () => {
        switch (props.elementType) {
            case ElementType.LOADFLOW_PARAMETERS:
                return 'profiles.form.modification.loadflow.name';
            case ElementType.SECURITY_ANALYSIS_PARAMETERS:
                return 'profiles.form.modification.securityAnalysis.name';
            case ElementType.SENSITIVITY_PARAMETERS:
                return 'profiles.form.modification.sensitivityAnalysis.name';
            case ElementType.SHORT_CIRCUIT_PARAMETERS:
                return 'profiles.form.modification.shortcircuit.name';
            case ElementType.VOLTAGE_INIT_PARAMETERS:
                return 'profiles.form.modification.voltageInit.name';
            case ElementType.SPREADSHEET_CONFIG_COLLECTION:
                return 'profiles.form.modification.spreadsheetConfigCollection.name';
            case ElementType.NETWORK_VISUALIZATIONS_PARAMETERS:
                return 'profiles.form.modification.networkVisualizations.name';
        }
    };

    return (
        <Grid container columns={24} alignItems={'center'}>
            <Grid item xs={1}>
                <IconButton edge="start" onClick={handleResetConfig} disableRipple={watchConfigId === undefined}>
                    <Tooltip
                        title={intl.formatMessage({
                            id: 'profiles.form.modification.configuration.reset.tooltip',
                        })}
                    >
                        <HighlightOffIcon color="action" />
                    </Tooltip>
                </IconButton>
            </Grid>
            <Grid item xs={1}>
                <IconButton edge="start" onClick={handleSelectFolder}>
                    <Tooltip
                        title={intl.formatMessage({
                            id: 'profiles.form.modification.configuration.choose.tooltip',
                        })}
                    >
                        <FolderIcon color="action" />
                    </Tooltip>
                </IconButton>
            </Grid>
            <Grid item xs={22}>
                <LinkedPathDisplay
                    nameKey={getConfigTranslationKey()}
                    value={selectedElementName}
                    linkValidity={configLinkValid}
                />
            </Grid>
            <DirectoryItemSelector
                open={openDirectorySelector}
                onClose={handleClose}
                types={[props.elementType]}
                onlyLeaves={true}
                multiSelect={false}
                validationButtonText={intl.formatMessage({
                    id: 'validate',
                })}
                title={intl.formatMessage({
                    id: 'profiles.form.modification.configSelection.dialog.title',
                })}
                contentText={intl.formatMessage({
                    id: 'profiles.form.modification.configSelection.dialog.message',
                })}
            />
        </Grid>
    );
};

export default ConfigurationSelection;
