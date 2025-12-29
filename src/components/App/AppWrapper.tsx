/*
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import App from './App';
import { useMemo } from 'react';
import { CssBaseline, responsiveFontSizes, ThemeOptions } from '@mui/material';
import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import { enUS as MuiCoreEnUS, frFR as MuiCoreFrFR } from '@mui/material/locale';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
import { enUS as MuiDatePickersEnUS, frFR as MuiDatePickersFrFR } from '@mui/x-date-pickers/locales';
import { enUS as dateFnsEnUS, fr as dateFnsFr } from 'date-fns/locale';
import {
    CardErrorBoundary,
    cardErrorBoundaryEn,
    cardErrorBoundaryFr,
    GsLangUser,
    GsTheme,
    LANG_ENGLISH,
    LANG_FRENCH,
    LIGHT_THEME,
    loginEn,
    loginFr,
    tableEn,
    tableFr,
    NotificationsProvider,
    SnackbarProvider,
    topBarEn,
    topBarFr,
    errorsEn,
    errorsFr,
    PARAM_THEME,
} from '@gridsuite/commons-ui';
import { type IntlConfig, IntlProvider } from 'react-intl';
import { Provider, useSelector } from 'react-redux';
import messages_en from '../../translations/en.json';
import messages_fr from '../../translations/fr.json';
import { store } from '../../redux/store';
import { AppState } from '../../redux/reducer';
import { useNotificationsUrlGenerator } from '../../utils/notifications-provider';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
import { BrowserRouter } from 'react-router';

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
    aggrid: {
        theme: 'ag-theme-alpine',
    },
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
    aggrid: {
        theme: 'ag-theme-alpine-dark',
    },
};

const getMuiTheme = (theme: GsTheme, locale: GsLangUser): Theme => {
    return responsiveFontSizes(
        createTheme(
            theme === LIGHT_THEME ? lightTheme : darkTheme,
            locale === LANG_FRENCH ? MuiCoreFrFR : MuiCoreEnUS, // MUI core translations
            locale === LANG_FRENCH ? MuiDatePickersFrFR : MuiDatePickersEnUS // MUI x-date-pickers translations
        )
    );
};

const messages: Record<GsLangUser, IntlConfig['messages']> = {
    en: {
        ...messages_en,
        ...loginEn,
        ...topBarEn,
        ...cardErrorBoundaryEn,
        ...tableEn,
        ...errorsEn,
    },
    fr: {
        ...messages_fr,
        ...loginFr,
        ...topBarFr,
        ...cardErrorBoundaryFr,
        ...tableFr,
        ...errorsFr,
    },
};

const basename = new URL(document.baseURI ?? '').pathname;

function intlToDateFnsLocale(lng: GsLangUser) {
    switch (lng) {
        case LANG_FRENCH:
            return dateFnsFr;
        case LANG_ENGLISH:
            return dateFnsEnUS;
        default:
            return undefined;
    }
}

const AppWrapperWithRedux = () => {
    const computedLanguage = useSelector((state: AppState) => state.computedLanguage);
    const theme = useSelector((state: AppState) => state[PARAM_THEME]);
    const themeCompiled = useMemo(() => getMuiTheme(theme, computedLanguage), [computedLanguage, theme]);
    const urlMapper = useNotificationsUrlGenerator();

    return (
        <IntlProvider locale={computedLanguage} defaultLocale={LANG_ENGLISH} messages={messages[computedLanguage]}>
            <BrowserRouter basename={basename}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={themeCompiled}>
                        <LocalizationProvider
                            dateAdapter={AdapterDateFns}
                            adapterLocale={intlToDateFnsLocale(computedLanguage)}
                        >
                            <SnackbarProvider hideIconVariant={false}>
                                <CssBaseline />
                                <CardErrorBoundary>
                                    <NotificationsProvider urls={urlMapper}>
                                        <App />
                                    </NotificationsProvider>
                                </CardErrorBoundary>
                            </SnackbarProvider>
                        </LocalizationProvider>
                    </ThemeProvider>
                </StyledEngineProvider>
            </BrowserRouter>
        </IntlProvider>
    );
};

export default function AppWrapper() {
    return (
        <Provider store={store}>
            <AppWrapperWithRedux />
        </Provider>
    );
}
