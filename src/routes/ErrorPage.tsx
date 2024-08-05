/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid, Typography } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { ReactElement, useEffect } from 'react';

export default function ErrorPage(): ReactElement {
    const error = useRouteError() as any;
    useEffect(() => {
        console.error(error);
    }, [error]);
    return (
        <Grid item id="error-page" component="article">
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
                <i>{error.message || error?.data?.message || error.statusText}</i>
            </p>
            {isRouteErrorResponse(error) && error.data.error && (
                <pre
                    style={{
                        wordWrap: 'normal',
                        overflowWrap: 'break-word',
                    }}
                >
                    <code>
                        {(function () {
                            try {
                                return JSON.stringify(error.data.error, undefined, 2);
                            } catch (e) {
                                return null;
                            }
                        })() ?? `${error.data.error}`}
                    </code>
                </pre>
            )}
        </Grid>
    );
}
