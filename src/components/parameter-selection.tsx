/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// TODO: copy from grid-explore => move it to commons-ui

import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, useTheme } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { DirectoryItemSelector } from '@gridsuite/commons-ui';
import { useController, useWatch } from 'react-hook-form';
import {
    fetchDirectoryContent,
    fetchPath,
    fetchRootFolders,
} from 'services/directory';
import { fetchElementsInfos } from 'services/explore';

// TODO remove when available in commons-ui
export enum ElementType {
    DIRECTORY = 'DIRECTORY',
    STUDY = 'STUDY',
    FILTER = 'FILTER',
    CONTINGENCY_LIST = 'CONTINGENCY_LIST',
    MODIFICATION = 'MODIFICATION',
    CASE = 'CASE',
    VOLTAGE_INIT_PARAMETERS = 'VOLTAGE_INIT_PARAMETERS',
    SECURITY_ANALYSIS_PARAMETERS = 'SECURITY_ANALYSIS_PARAMETERS',
    LOADFLOW_PARAMETERS = 'LOADFLOW_PARAMETERS',
    SENSITIVITY_PARAMETERS = 'SENSITIVITY_PARAMETERS',
}

export interface ModifyElementSelectionProps {
    elementType: ElementType;
    formParamId: string;
}

const ParameterSelection: React.FunctionComponent<
    ModifyElementSelectionProps
> = (props) => {
    const intl = useIntl();
    const theme = useTheme();

    const [open, setOpen] = useState<boolean>(false);
    const [selectedElementName, setSelectedElementName] = useState<string>();
    const [validity, setValidity] = useState<boolean>();
    const watchParamId = useWatch({
        name: props.formParamId,
    });
    const ctlParamId = useController({
        name: props.formParamId,
    });

    useEffect(() => {
        console.log('DBR useEff elementUuid=', watchParamId);
        if (!watchParamId) {
            setSelectedElementName(undefined);
            setValidity(undefined);
        } else {
            fetchPath(watchParamId)
                .then((res: any) => {
                    console.log('DBR useEff fetchPath res=', res);
                    setValidity(true);
                    setSelectedElementName(
                        res
                            .map((element: any) => element.elementName.trim())
                            .reverse()
                            .join('/')
                    );
                })
                .catch(() => {
                    setSelectedElementName(undefined);
                    setValidity(false);
                });
        }
    }, [watchParamId]);

    const handleSelectFolder = () => {
        setOpen(true);
    };

    const handleResetParameter = () => {
        ctlParamId.field.onChange(undefined);
    };

    const handleClose = (selection: any) => {
        console.log(
            'DBR handleClose selected=',
            selection,
            selectedElementName
        );
        if (selection.length) {
            console.log(
                'DBR handleClose onChange=',
                selection[0]?.id,
                selectedElementName
            );
            ctlParamId.field.onChange(selection[0]?.id);
        }
        setOpen(false);
    };

    return (
        <Grid
            sx={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Button
                onClick={handleResetParameter}
                variant="contained"
                sx={{
                    padding: '10px 30px',
                }}
                color="primary"
                component="label"
                disabled={selectedElementName === undefined}
            >
                <FormattedMessage
                    id={
                        'profiles.form.modification.parameterSelectionResetButton'
                    }
                />
            </Button>
            <Button
                onClick={handleSelectFolder}
                variant="contained"
                sx={{
                    padding: '10px 30px',
                }}
                color="primary"
                component="label"
            >
                <FormattedMessage
                    id={'profiles.form.modification.parameterSelectionButton'}
                />
            </Button>
            <Typography
                sx={{
                    marginLeft: '10px',
                    fontWeight: 'bold',
                    color:
                        validity === false
                            ? theme.palette.error.main
                            : undefined,
                }}
            >
                {selectedElementName
                    ? selectedElementName
                    : intl.formatMessage({
                          id:
                              validity === false
                                  ? 'profiles.form.modification.invalidParameter'
                                  : 'profiles.form.modification.noSelectedParameter',
                      })}
            </Typography>
            <DirectoryItemSelector
                open={open}
                onClose={handleClose}
                types={[props.elementType]}
                onlyLeaves={props.elementType !== ElementType.DIRECTORY}
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
