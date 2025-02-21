/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// app.test.tsx

import React, { FunctionComponent, PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import App from './app';
import { store } from '../../redux/store';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from '@gridsuite/commons-ui';
import { CssBaseline } from '@mui/material';
import { appRoutes } from '../../routes/utils';

let container: HTMLElement | null = null;

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    container?.remove();
    container = null;
});

//broken test
it.skip('renders', async () => {
    if (container === null) {
        throw new Error('No container was defined');
    }
    const root = createRoot(container);
    const AppWrapperRouterLayout: FunctionComponent<PropsWithChildren<{}>> = () => (
        <IntlProvider locale="en">
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={createTheme({})}>
                    <SnackbarProvider hideIconVariant={false}>
                        <CssBaseline />
                        <App>
                            <Outlet />
                        </App>
                    </SnackbarProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </IntlProvider>
    );
    const router = createMemoryRouter(
        [
            {
                element: (
                    <AppWrapperRouterLayout>
                        <Outlet />
                    </AppWrapperRouterLayout>
                ),
                children: appRoutes(),
            },
        ]
        //{ basename: props.basename }
    );
    await act(async () =>
        root.render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )
    );

    expect(container.textContent).toContain('GridAdmin');
    act(() => {
        root.unmount();
    });
});
