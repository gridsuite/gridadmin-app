/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Typography, useTheme } from '@mui/material';
import { useIntl } from 'react-intl';
import { FunctionComponent } from 'react';

export interface LinkedPathDisplayProps {
    nameKey: string;
    value?: string;
    linkValidity?: boolean;
}

const LinkedPathDisplay: FunctionComponent<LinkedPathDisplayProps> = (props) => {
    const intl = useIntl();
    const theme = useTheme();

    return (
        <Typography
            sx={{
                fontWeight: 'bold',
                color: props.linkValidity === false ? theme.palette.error.main : undefined,
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
                                  ? 'linked.path.display.invalidLink'
                                  : 'linked.path.display.noLink',
                      }))}
        </Typography>
    );
};

export default LinkedPathDisplay;
