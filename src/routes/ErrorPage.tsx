import { Grid, Typography } from '@mui/material';
import { useRouteError } from 'react-router-dom';
import { ReactElement } from 'react';

export default function ErrorPage(): ReactElement {
    const error = useRouteError() as Record<any, any>;
    console.error(error);
    return (
        <Grid item id="error-page">
            <Typography variant="h1">Oops!</Typography>
            <Typography variant="body1" component="p">
                Sorry, an unexpected error has occurred.
            </Typography>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </Grid>
    );
}
