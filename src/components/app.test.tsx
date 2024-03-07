// app.test.tsx

import React, { FunctionComponent, PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router-dom';
import App from './App/app';
import { store } from '../redux/store';
import {
    createTheme,
    StyledEngineProvider,
    ThemeProvider,
} from '@mui/material/styles';
import { SnackbarProvider } from '@gridsuite/commons-ui';
import { UserManagerMock } from '@gridsuite/commons-ui/es/utils/UserManagerMock';
import { CssBaseline } from '@mui/material';
import { appRoutes } from '../routes';

let container: Element | any = null;

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    container.remove();
    container = null;
});

//broken test
it.skip('renders', async () => {
    const root = createRoot(container);
    const AppWrapperRouterLayout: FunctionComponent<
        PropsWithChildren<{}>
    > = () => (
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
