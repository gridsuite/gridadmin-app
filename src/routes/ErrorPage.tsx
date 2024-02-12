import { Grid, Typography } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { ReactElement, useMemo } from 'react';

export default function ErrorPage(): ReactElement {
    const error = useRouteError() as any;
    console.error(error);
    return useMemo(
        () => (
            <Grid item id="error-page">
                <Typography variant="h1">Oops!</Typography>
                <Typography variant="body1" component="p">
                    Sorry, an unexpected error has occurred.
                </Typography>
                {isRouteErrorResponse(error) && (
                    <>
                        <Typography variant="subtitle1" component="p">
                            {error.status}
                        </Typography>
                        <Typography variant="subtitle2" component="p">
                            {error.statusText}
                        </Typography>
                    </>
                )}
                <p>
                    <i>
                        {error.message ||
                            error?.data?.message ||
                            error.statusText}
                    </i>
                </p>
                {isRouteErrorResponse(error) && error.error && (
                    <pre
                        style={{
                            wordWrap: 'normal',
                            overflowWrap: 'break-word',
                        }}
                    >
                        <code>
                            {(function () {
                                try {
                                    return JSON.stringify(
                                        error.error,
                                        undefined,
                                        2
                                    );
                                } catch (e) {
                                    return null;
                                }
                            })() ?? `${error.error}`}
                        </code>
                    </pre>
                )}
            </Grid>
        ),
        [error]
    );
}