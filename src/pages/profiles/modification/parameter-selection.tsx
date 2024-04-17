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
import {
    fetchDirectoryContent,
    fetchPath,
    fetchRootFolders,
} from 'services/directory';
import { fetchElementsInfos } from 'services/explore';
import LinkedPathDisplay from './linked-path-display';

export interface ParameterSelectionProps {
    elementType:
        | ElementType.LOADFLOW_PARAMETERS
        | ElementType.SECURITY_ANALYSIS_PARAMETERS
        | ElementType.SENSITIVITY_PARAMETERS
        | ElementType.VOLTAGE_INIT_PARAMETERS;
    parameterFormId: string;
}

const ParameterSelection: FunctionComponent<ParameterSelectionProps> = (
    props
) => {
    const intl = useIntl();

    const [openDirectorySelector, setOpenDirectorySelector] =
        useState<boolean>(false);
    const [selectedElementName, setSelectedElementName] = useState<string>();
    const [parameterLinkValid, setParameterLinkValid] = useState<boolean>();
    const watchParamId = useWatch({
        name: props.parameterFormId,
    });
    const ctlParamId = useController({
        name: props.parameterFormId,
    });

    useEffect(() => {
        if (!watchParamId) {
            setSelectedElementName(undefined);
            setParameterLinkValid(undefined);
        } else {
            fetchPath(watchParamId)
                .then((res: any) => {
                    setParameterLinkValid(true);
                    setSelectedElementName(
                        res
                            .map((element: any) => element.elementName.trim())
                            .reverse()
                            .join('/')
                    );
                })
                .catch(() => {
                    setSelectedElementName(undefined);
                    setParameterLinkValid(false);
                });
        }
    }, [watchParamId]);

    const handleSelectFolder = () => {
        setOpenDirectorySelector(true);
    };

    const handleResetParameter = () => {
        ctlParamId.field.onChange(undefined);
    };

    const handleClose = (selection: any) => {
        if (selection.length) {
            ctlParamId.field.onChange(selection[0]?.id);
        }
        setOpenDirectorySelector(false);
    };

    const getParameterTranslationKey = () => {
        switch (props.elementType) {
            case ElementType.LOADFLOW_PARAMETERS:
                return 'profiles.form.modification.loadflow.name';
        }
        return 'cannot happen';
    };

    return (
        <Grid container columns={24} alignItems={'center'}>
            <Grid item xs={1}>
                <IconButton
                    edge="start"
                    onClick={handleResetParameter}
                    disableRipple={watchParamId === undefined}
                >
                    <Tooltip
                        title={intl.formatMessage({
                            id: 'profiles.form.modification.parameter.reset.tooltip',
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
                            id: 'profiles.form.modification.parameter.choose.tooltip',
                        })}
                    >
                        <FolderIcon color="action" />
                    </Tooltip>
                </IconButton>
            </Grid>
            <Grid item xs={22}>
                <LinkedPathDisplay
                    nameKey={getParameterTranslationKey()}
                    value={selectedElementName}
                    linkValidity={parameterLinkValid}
                />
            </Grid>
            <DirectoryItemSelector
                open={openDirectorySelector}
                onClose={handleClose}
                types={[props.elementType]}
                onlyLeaves={true}
                multiselect={false}
                validationButtonText={intl.formatMessage({
                    id: 'validate',
                })}
                title={intl.formatMessage({
                    id: 'profiles.form.modification.parameterSelection.dialog.title',
                })}
                contentText={intl.formatMessage({
                    id: 'profiles.form.modification.parameterSelection.dialog.message',
                })}
                fetchDirectoryContent={fetchDirectoryContent}
                fetchRootFolders={fetchRootFolders}
                fetchElementsInfos={fetchElementsInfos}
            />
        </Grid>
    );
};

export default ParameterSelection;
