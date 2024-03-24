/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// TODO: copy from grid-explore => move it to commons-ui

import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { DirectoryItemSelector } from '@gridsuite/commons-ui';
import { useController } from 'react-hook-form';
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
    formParamFullName: string;
    dialogOpeningButtonLabel: string;
    dialogTitleLabel: string;
    dialogMessageLabel: string;
    noElementMessageLabel?: string;
}

const ModifyElementSelection: React.FunctionComponent<
    ModifyElementSelectionProps
> = (props) => {
    const intl = useIntl();

    const [open, setOpen] = useState<boolean>(false);
    const [selectedElementName, setSelectedElementName] = useState('');

    const ctlParamId = useController({
        name: props.formParamId,
    });
    const ctlParamFullName = useController({
        name: props.formParamFullName,
    });

    useEffect(() => {
        console.log('DBR useEff elementUuid=', ctlParamId.field.value);
        if (ctlParamId.field.value) {
            fetchPath(ctlParamId.field.value).then((res: any) => {
                console.log('DBR useEff fetchPath res=', res);
                setSelectedElementName(
                    res
                        .map((element: any) => element.elementName.trim())
                        .reverse()
                        .join('/')
                );
            });
            //.catch((error) => setSelectedElementName('error'));
        }
    }, [ctlParamId.field.value]);

    const handleSelectFolder = () => {
        setOpen(true);
    };

    const handleClose = (selection: any) => {
        console.log('DBR handleClose selected=', selection, selectedElementName);
        if (selection.length) {
            console.log(
                'DBR handleClose onChange=',
                selection[0]?.id,
                selectedElementName
            );
            ctlParamId.field.onChange(selection[0]?.id);
            ctlParamFullName.field.onChange(selectedElementName);
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
                onClick={handleSelectFolder}
                variant="contained"
                sx={{
                    padding: '10px 30px',
                }}
                color="primary"
                component="label"
            >
                <FormattedMessage id={props.dialogOpeningButtonLabel} />
            </Button>
            <Typography
                sx={{
                    marginLeft: '10px',
                    fontWeight: 'bold',
                }}
            >
                {selectedElementName
                    ? selectedElementName
                    : props?.noElementMessageLabel
                    ? intl.formatMessage({
                          id: props.noElementMessageLabel,
                      })
                    : ''}
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
                    id: props.dialogTitleLabel,
                })}
                contentText={intl.formatMessage({
                    id: props.dialogMessageLabel,
                })}
                fetchDirectoryContent={fetchDirectoryContent}
                fetchRootFolders={fetchRootFolders}
                fetchElementsInfos={fetchElementsInfos}
            />
        </Grid>
    );
};

export default ModifyElementSelection;
