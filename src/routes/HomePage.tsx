/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';

export default function HomePage(): ReactElement {
    return (
        <Grid item id="home-page" xs={12} alignSelf="center" component="section">
            <Typography variant="h3" color="textPrimary" align="center">
                <FormattedMessage id="connected" />
            </Typography>
        </Grid>
    );
}
