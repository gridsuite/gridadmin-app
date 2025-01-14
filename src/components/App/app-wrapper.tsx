/*
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import App from './app';
import { FunctionComponent, useMemo } from 'react';
import { CssBaseline, responsiveFontSizes, ThemeOptions } from '@mui/material';
import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import { enUS as MuiCoreEnUS, frFR as MuiCoreFrFR } from '@mui/material/locale';
import {
    cardErrorBoundaryEn,
    cardErrorBoundaryFr,
    CardErrorBoundary,
    GsLangUser,
    GsTheme,
    LANG_ENGLISH,
    LANG_FRENCH,
    LIGHT_THEME,
    loginEn,
    loginFr,
    SnackbarProvider,
    topBarEn,
    topBarFr,
    NotificationsProvider,
} from '@gridsuite/commons-ui';
import { IntlConfig, IntlProvider } from 'react-intl';
import { Provider, useSelector } from 'react-redux';
import messages_en from '../../translations/en.json';
import messages_fr from '../../translations/fr.json';
import { store } from '../../redux/store';
import { PARAM_THEME } from '../../utils/config-params';
import { AppState } from '../../redux/reducer';
import { AppWithAuthRouter } from '../../routes';
import { useNotificationsUrlGenerator } from '../../utils/notifications-provider';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';

// Register all community features (migration to V33)
ModuleRegistry.registerModules([AllCommunityModule]);

// Mark all grids as using legacy themes (migration to V33)
provideGlobalGridOptions({ theme: 'legacy' });

const lightTheme: ThemeOptions = {
    palette: {
        mode: 'light',
    },
    arrow: {
        fill: '#212121',
        stroke: '#212121',
    },
    arrow_hover: {
        fill: 'white',
        stroke: 'white',
    },
    circle: {
        stroke: 'white',
        fill: 'white',
    },
    circle_hover: {
        stroke: '#212121',
        fill: '#212121',
    },
    link: {
        color: 'blue',
    },
    agGridTheme: 'ag-theme-alpine',
};

const darkTheme: ThemeOptions = {
    palette: {
        mode: 'dark',
    },
    arrow: {
        fill: 'white',
        stroke: 'white',
    },
    arrow_hover: {
        fill: '#424242',
        stroke: '#424242',
    },
    circle: {
        stroke: '#424242',
        fill: '#424242',
    },
    circle_hover: {
        stroke: 'white',
        fill: 'white',
    },
    link: {
        color: 'green',
    },
    agGridTheme: 'ag-theme-alpine-dark',
};

const getMuiTheme = (theme: GsTheme, locale: GsLangUser): Theme => {
    return responsiveFontSizes(
        createTheme(
            theme === LIGHT_THEME ? lightTheme : darkTheme,
            locale === LANG_FRENCH ? MuiCoreFrFR : MuiCoreEnUS // MUI core translations
        )
    );
};

const messages: Record<GsLangUser, IntlConfig['messages']> = {
    en: {
        ...messages_en,
        ...loginEn,
        ...topBarEn,
        ...cardErrorBoundaryEn,
    },
    fr: {
        ...messages_fr,
        ...loginFr,
        ...topBarFr,
        ...cardErrorBoundaryFr,
    },
};

const basename = new URL(document.baseURI ?? '').pathname;

/**
 * Layer injecting Theme, Internationalization (i18n) and other tools (snackbar, error boundary, ...)
 */
const AppWrapperRouterLayout: typeof App = (props, context) => {
    const computedLanguage = useSelector((state: AppState) => state.computedLanguage);
    const theme = useSelector((state: AppState) => state[PARAM_THEME]);
    const themeCompiled = useMemo(() => getMuiTheme(theme, computedLanguage), [computedLanguage, theme]);
    const urlMapper = useNotificationsUrlGenerator();
    return (
        <IntlProvider locale={computedLanguage} defaultLocale={LANG_ENGLISH} messages={messages[computedLanguage]}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={themeCompiled}>
                    <SnackbarProvider hideIconVariant={false}>
                        <CssBaseline />
                        <CardErrorBoundary>
                            <NotificationsProvider urls={urlMapper}>
                                <App {...props}>{props.children}</App>
                            </NotificationsProvider>
                        </CardErrorBoundary>
                    </SnackbarProvider>
                </ThemeProvider>
            </StyledEngineProvider>
        </IntlProvider>
    );
};

/**
 * Layer managing router depending on user authentication state
 */
const AppWrapperWithRedux: FunctionComponent = () => (
    <AppWithAuthRouter basename={basename} layout={AppWrapperRouterLayout} />
);

/**
 * Layer injecting Redux store in context
 */
export const AppWrapper: FunctionComponent = () => (
    <Provider store={store}>
        <AppWrapperWithRedux />
    </Provider>
);
export default AppWrapper;
