/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Typography, useTheme } from '@mui/material';
import { useIntl } from 'react-intl';

export interface ParameterDisplayProps {
    nameKey: string;
    value?: string;
    linkValidity?: boolean;
}

const ParameterDisplay: React.FunctionComponent<ParameterDisplayProps> = (
    props
) => {
    const intl = useIntl();
    const theme = useTheme();

    return (
        <Typography
            sx={{
                fontWeight: 'bold',
                color:
                    props.linkValidity === false
                        ? theme.palette.error.main
                        : undefined,
            }}
        >
            {intl.formatMessage({
                id: props.nameKey,
            }) +
                ' : ' +
                (props.value
                    ? props.value
                    : intl.formatMessage({
                          id:
                              props.linkValidity === false
                                  ? 'profiles.form.modification.invalidParameter'
                                  : 'profiles.form.modification.noSelectedParameter',
                      }))}
        </Typography>
    );
};

export default ParameterDisplay;
