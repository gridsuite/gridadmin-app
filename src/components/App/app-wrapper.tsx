/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import App from './app';
import { FunctionComponent, useCallback } from 'react';
import { CssBaseline, responsiveFontSizes } from '@mui/material';
import {
    createTheme,
    StyledEngineProvider,
    Theme,
    ThemeOptions,
    ThemeProvider,
} from '@mui/material/styles';
import { enUS as MuiCoreEnUS, frFR as MuiCoreFrFR } from '@mui/material/locale';
import {
    card_error_boundary_en,
    card_error_boundary_fr,
    CardErrorBoundary,
    LANG_ENGLISH,
    LANG_FRENCH,
    LIGHT_THEME,
    login_en,
    login_fr,
    SnackbarProvider,
    top_bar_en,
    top_bar_fr,
} from '@gridsuite/commons-ui';
import { IntlProvider } from 'react-intl';
import { Provider, useSelector } from 'react-redux';
import messages_en from '../../translations/en.json';
import messages_fr from '../../translations/fr.json';
import messages_plugins_en from '../../plugins/translations/en.json';
import messages_plugins_fr from '../../plugins/translations/fr.json';
import { store } from '../../redux/store';
import { PARAM_THEME } from '../../utils/config-params';
import { IntlConfig } from 'react-intl/src/types';
import { AppState } from '../../redux/reducer';
import { AppWithAuthRouter } from '../../routes';

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
    mapboxStyle: 'mapbox://styles/mapbox/light-v9',
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
    mapboxStyle: 'mapbox://styles/mapbox/dark-v9',
    agGridTheme: 'ag-theme-alpine-dark',
};

const getMuiTheme = (theme: unknown, locale: unknown): Theme => {
    return responsiveFontSizes(
        createTheme(
            theme === LIGHT_THEME ? lightTheme : darkTheme,
            locale === LANG_FRENCH ? MuiCoreFrFR : MuiCoreEnUS // MUI core translations
        )
    );
};

const messages: Record<string, IntlConfig['messages']> = {
    [LANG_ENGLISH]: {
        ...messages_en,
        ...login_en,
        ...top_bar_en,
        ...card_error_boundary_en,
        ...messages_plugins_en, // keep it at the end to allow translation overwriting
    },
    [LANG_FRENCH]: {
        ...messages_fr,
        ...login_fr,
        ...top_bar_fr,
        ...card_error_boundary_fr,
        ...messages_plugins_fr, // keep it at the end to allow translation overwriting
    },
};

const basename = new URL(document.querySelector('base')?.href || '').pathname;

/**
 * Layer injecting Theme, Internationalization (i18n) and other tools (snackbar, error boundary, ...)
 */
const AppWrapperRouterLayout: typeof App = (props, context) => {
    const computedLanguage = useSelector(
        (state: AppState) => state.computedLanguage
    );
    const theme = useSelector((state: AppState) => state[PARAM_THEME]);
    const getTheme = useCallback(getMuiTheme, []);
    return (
        <IntlProvider
            locale={computedLanguage}
            messages={messages[computedLanguage]}
        >
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={getTheme(theme, computedLanguage)}>
                    <SnackbarProvider hideIconVariant={false}>
                        <CssBaseline />
                        <CardErrorBoundary>
                            <App {...props}>{props.children}</App>
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
