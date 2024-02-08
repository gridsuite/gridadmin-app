import { Grid, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';

export default function HomePage(): ReactElement {
    return (
        <Grid item id="home-page" xs={12} alignSelf="center">
            <Typography variant="h3" color="textPrimary" align="center">
                <FormattedMessage id="connected" />
            </Typography>
        </Grid>
    );
}
