/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Typography } from '@mui/material';
import { DAYS, DURATION, HOURS, MINUTES } from './utils';
import { IntegerInput } from '@gridsuite/commons-ui';
import { useIntl } from 'react-intl';

const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const DaysAdornment = {
    position: 'end',
    text: 'd',
};
const HoursAdornment = {
    position: 'end',
    text: 'h',
};
const MinutesAdornment = {
    position: 'end',
    text: 'm',
};

export const DurationInput = () => {
    const intl = useIntl();

    return (
        <Grid item container columns={30} justifyContent="center">
            <Grid item xs={6} sx={centerStyle}>
                <Typography variant="body1">
                    {intl.formatMessage({
                        id: 'announcements.dialog.duration',
                    })}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <IntegerInput name={`${DURATION}.${DAYS}`} label={'duration.days'} adornment={DaysAdornment} />
            </Grid>
            <Grid item xs={1} sx={centerStyle}>
                <Typography variant="h6">:</Typography>
            </Grid>
            <Grid item xs={4}>
                <IntegerInput name={`${DURATION}.${HOURS}`} label={'duration.hours'} adornment={HoursAdornment} />
            </Grid>
            <Grid item xs={1} sx={centerStyle}>
                <Typography variant="h6">:</Typography>
            </Grid>
            <Grid item xs={4}>
                <IntegerInput name={`${DURATION}.${MINUTES}`} label={'duration.minutes'} adornment={MinutesAdornment} />
            </Grid>
        </Grid>
    );
};
