/*
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import App from './app';
import { FunctionComponent, useMemo } from 'react';
import { CssBaseline, responsiveFontSizes, ThemeOptions } from '@mui/material';
import {
    createTheme,
    StyledEngineProvider,
    Theme,
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
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { SupportedLanguages } from '../../utils/language';
import messages_en from '../../translations/en.json';
import messages_fr from '../../translations/fr.json';
import { store } from '../../redux/store';
import { PARAM_THEME } from '../../utils/config-params';
import { IntlConfig } from 'react-intl/src/types';
import { AppState } from '../../redux/reducer';

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
};

const getMuiTheme = (theme: unknown, locale: SupportedLanguages): Theme => {
    return responsiveFontSizes(
        createTheme(
            theme === LIGHT_THEME ? lightTheme : darkTheme,
            locale === LANG_FRENCH ? MuiCoreFrFR : MuiCoreEnUS // MUI core translations
        )
    );
};

const messages: Record<SupportedLanguages, IntlConfig['messages']> = {
    en: {
        ...messages_en,
        ...login_en,
        ...top_bar_en,
        ...card_error_boundary_en,
    },
    fr: {
        ...messages_fr,
        ...login_fr,
        ...top_bar_fr,
        ...card_error_boundary_fr,
    },
};

const basename = new URL(document.querySelector('base')?.href ?? '').pathname;

const AppWrapperWithRedux: FunctionComponent = () => {
    const computedLanguage = useSelector(
        (state: AppState) => state.computedLanguage
    );
    const theme = useSelector((state: AppState) => state[PARAM_THEME]);
    const themeCompiled = useMemo(
        () => getMuiTheme(theme, computedLanguage),
        [computedLanguage, theme]
    );
    return (
        <IntlProvider
            locale={computedLanguage}
            defaultLocale={LANG_ENGLISH}
            messages={messages[computedLanguage]}
        >
            <BrowserRouter basename={basename}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={themeCompiled}>
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
