/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createReducer } from '@reduxjs/toolkit';
import {
    getLocalStorageComputedLanguage,
    getLocalStorageLanguage,
    getLocalStorageTheme,
    saveLocalStorageLanguage,
    saveLocalStorageTheme,
} from './local-storage';

import {
    ComputedLanguageAction,
    SELECT_COMPUTED_LANGUAGE,
    SELECT_LANGUAGE,
    SELECT_THEME,
    SelectLanguageAction,
    ThemeAction,
    UPDATE_USER_MANAGER_STATE,
    UserManagerAction,
} from './actions';
import {
    AuthenticationActions,
    AuthenticationRouterErrorAction,
    AuthenticationRouterErrorState,
    CommonStoreState,
    GsLang,
    GsLangUser,
    GsTheme,
    LOGOUT_ERROR,
    LogoutErrorAction,
    RESET_AUTHENTICATION_ROUTER_ERROR,
    SHOW_AUTH_INFO_LOGIN,
    ShowAuthenticationRouterLoginAction,
    SIGNIN_CALLBACK_ERROR,
    SignInCallbackErrorAction,
    UNAUTHORIZED_USER_INFO,
    UnauthorizedUserAction,
    USER,
    USER_VALIDATION_ERROR,
    UserAction,
    UserManagerState,
    UserValidationErrorAction,
} from '@gridsuite/commons-ui';
import { PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params';

export type AppState = CommonStoreState & {
    computedLanguage: GsLangUser;
    [PARAM_THEME]: GsTheme;
    [PARAM_LANGUAGE]: GsLang;

    userManager: UserManagerState;
    signInCallbackError: Error | null;
    authenticationRouterError: AuthenticationRouterErrorState | null;
    showAuthenticationRouterLogin: boolean;
};

const initialState: AppState = {
    // authentication
    userManager: {
        instance: null,
        error: null,
    },
    user: null,
    signInCallbackError: null,
    authenticationRouterError: null,
    showAuthenticationRouterLogin: false,

    // params
    [PARAM_THEME]: getLocalStorageTheme(),
    [PARAM_LANGUAGE]: getLocalStorageLanguage(),
    computedLanguage: getLocalStorageComputedLanguage(),
};

export type Actions =
    | AuthenticationActions
    | UserManagerAction
    | ThemeAction
    | SelectLanguageAction
    | ComputedLanguageAction;

export type AppStateKey = keyof AppState;

export const reducer = createReducer<AppState>(initialState, (builder) => {
    builder.addCase(SELECT_THEME, (state, action: ThemeAction) => {
        state.theme = action.theme;
        saveLocalStorageTheme(state.theme);
    });

    builder.addCase(SELECT_LANGUAGE, (state, action: SelectLanguageAction) => {
        state[PARAM_LANGUAGE] = action[PARAM_LANGUAGE];
        saveLocalStorageLanguage(state[PARAM_LANGUAGE]);
    });

    builder.addCase(UPDATE_USER_MANAGER_STATE, (state, action: UserManagerAction) => {
        state.userManager = action.userManager;
    });

    builder.addCase(USER, (state, action: UserAction) => {
        state.user = action.user;
    });

    builder.addCase(SIGNIN_CALLBACK_ERROR, (state, action: SignInCallbackErrorAction) => {
        state.signInCallbackError = action.signInCallbackError;
    });

    builder.addCase(UNAUTHORIZED_USER_INFO, (state, action: UnauthorizedUserAction) => {
        state.authenticationRouterError = action.authenticationRouterError;
    });

    builder.addCase(LOGOUT_ERROR, (state, action: LogoutErrorAction) => {
        state.authenticationRouterError = action.authenticationRouterError;
    });

    builder.addCase(USER_VALIDATION_ERROR, (state, action: UserValidationErrorAction) => {
        state.authenticationRouterError = action.authenticationRouterError;
    });

    builder.addCase(RESET_AUTHENTICATION_ROUTER_ERROR, (state, action: AuthenticationRouterErrorAction) => {
        state.authenticationRouterError = null;
    });

    builder.addCase(SHOW_AUTH_INFO_LOGIN, (state, action: ShowAuthenticationRouterLoginAction) => {
        state.showAuthenticationRouterLogin = action.showAuthenticationRouterLogin;
    });

    builder.addCase(SELECT_COMPUTED_LANGUAGE, (state, action: ComputedLanguageAction) => {
        state.computedLanguage = action.computedLanguage;
    });
});
