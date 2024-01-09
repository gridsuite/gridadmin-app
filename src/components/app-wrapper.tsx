/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import App from './app';
import React, { FunctionComponent } from 'react';
import {
    createTheme,
    StyledEngineProvider,
    Theme,
    ThemeProvider,
} from '@mui/material/styles';
import {
    card_error_boundary_en,
    card_error_boundary_fr,
    CardErrorBoundary,
    LIGHT_THEME,
    login_en,
    login_fr,
    SnackbarProvider,
    top_bar_en,
    top_bar_fr,
} from '@gridsuite/commons-ui';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import messages_en from '../translations/en.json';
import messages_fr from '../translations/fr.json';
import messages_plugins_en from '../plugins/translations/en.json';
import messages_plugins_fr from '../plugins/translations/fr.json';
import { store } from '../redux/store';
import CssBaseline from '@mui/material/CssBaseline';
import { PARAM_THEME } from '../utils/config-params';
import { IntlConfig } from 'react-intl/src/types';
import { AppState } from '../redux/reducer';

const lightTheme: Theme = createTheme({
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
});

const darkTheme: Theme = createTheme({
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
});

const getMuiTheme = (theme: unknown): Theme => {
    if (theme === LIGHT_THEME) {
        return lightTheme;
    } else {
        return darkTheme;
    }
};

const messages: Record<string, IntlConfig['messages']> = {
    en: {
        ...messages_en,
        ...login_en,
        ...top_bar_en,
        ...card_error_boundary_en,
        ...messages_plugins_en, // keep it at the end to allow translation overwriting
    },
    fr: {
        ...messages_fr,
        ...login_fr,
        ...top_bar_fr,
        ...card_error_boundary_fr,
        ...messages_plugins_fr, // keep it at the end to allow translation overwriting
    },
};

const basename = new URL(document.querySelector('base')?.href || '').pathname;

const AppWrapperWithRedux: FunctionComponent = () => {
    const computedLanguage = useSelector(
        (state: AppState) => state.computedLanguage
    );
    const theme = useSelector((state: AppState) => state[PARAM_THEME]);
    return (
        <IntlProvider
            locale={computedLanguage}
            messages={messages[computedLanguage]}
        >
            <BrowserRouter basename={basename}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={getMuiTheme(theme)}>
                        <SnackbarProvider hideIconVariant={false}>
                            <CssBaseline />
                            <CardErrorBoundary>
                                <App />
                            </CardErrorBoundary>
                        </SnackbarProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </BrowserRouter>
        </IntlProvider>
    );
};

const AppWrapper: FunctionComponent = () => {
    return (
        <Provider store={store}>
            <AppWrapperWithRedux />
        </Provider>
    );
};

export default AppWrapper;
