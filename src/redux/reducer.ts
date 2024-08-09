/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createReducer, Draft } from '@reduxjs/toolkit';
import {
    ComputedLanguageAction,
    LanguageAction,
    SELECT_COMPUTED_LANGUAGE,
    SELECT_THEME,
    ThemeAction,
    UPDATE_USER_MANAGER_ERROR,
    UPDATE_USER_MANAGER_INSTANCE,
    UPDATE_USER_MANAGER_STATE,
    UserManagerAction,
    UserManagerErrorAction,
    UserManagerInstanceAction,
} from './actions';
import {
    AuthenticationActions,
    AuthenticationRouterErrorAction,
    AuthenticationRouterErrorState,
    getLocalStorageComputedLanguage,
    getLocalStorageLanguage,
    getLocalStorageTheme,
    GsLang,
    GsLangUser,
    GsTheme,
    LOGOUT_ERROR,
    LogoutErrorAction,
    PARAM_LANGUAGE,
    PARAM_THEME,
    RESET_AUTHENTICATION_ROUTER_ERROR,
    saveLocalStorageTheme,
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
import { ReducerWithInitialState } from '@reduxjs/toolkit/dist/createReducer';
import { User } from 'oidc-client';
import { APP_NAME } from '../utils/config-params';

export type AppState = {
    user?: User;
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
    user: undefined,
    signInCallbackError: null,
    authenticationRouterError: null,
    showAuthenticationRouterLogin: false,

    // params
    [PARAM_THEME]: getLocalStorageTheme(APP_NAME),
    [PARAM_LANGUAGE]: getLocalStorageLanguage(APP_NAME),
    computedLanguage: getLocalStorageComputedLanguage(APP_NAME),
};

export type Actions =
    | AuthenticationActions
    | UserManagerAction
    | UserManagerInstanceAction
    | UserManagerErrorAction
    | ThemeAction
    | LanguageAction
    | ComputedLanguageAction;

export type AppStateKey = keyof AppState;

export const reducer: ReducerWithInitialState<AppState> = createReducer(initialState, (builder) => {
    builder.addCase(SELECT_THEME, (state: Draft<AppState>, action: ThemeAction) => {
        state.theme = action.theme;
        saveLocalStorageTheme(APP_NAME, state.theme);
    });

    builder.addCase(UPDATE_USER_MANAGER_STATE, (state: Draft<AppState>, action: UserManagerAction) => {
        state.userManager = action.userManager;
    });

    builder.addCase(UPDATE_USER_MANAGER_INSTANCE, (state: Draft<AppState>, action: UserManagerInstanceAction) => {
        state.userManager.instance = action.instance;
    });

    builder.addCase(UPDATE_USER_MANAGER_ERROR, (state: Draft<AppState>, action: UserManagerErrorAction) => {
        state.userManager.error = action.error;
    });

    builder.addCase(USER, (state: Draft<AppState>, action: UserAction) => {
        state.user = action.user;
    });

    builder.addCase(SIGNIN_CALLBACK_ERROR, (state: Draft<AppState>, action: SignInCallbackErrorAction) => {
        state.signInCallbackError = action.signInCallbackError;
    });

    builder.addCase(UNAUTHORIZED_USER_INFO, (state: Draft<AppState>, action: UnauthorizedUserAction) => {
        state.authenticationRouterError = action.authenticationRouterError;
    });

    builder.addCase(LOGOUT_ERROR, (state: Draft<AppState>, action: LogoutErrorAction) => {
        state.authenticationRouterError = action.authenticationRouterError;
    });

    builder.addCase(USER_VALIDATION_ERROR, (state: Draft<AppState>, action: UserValidationErrorAction) => {
        state.authenticationRouterError = action.authenticationRouterError;
    });

    builder.addCase(
        RESET_AUTHENTICATION_ROUTER_ERROR,
        (state: Draft<AppState>, action: AuthenticationRouterErrorAction) => {
            state.authenticationRouterError = null;
        }
    );

    builder.addCase(SHOW_AUTH_INFO_LOGIN, (state: Draft<AppState>, action: ShowAuthenticationRouterLoginAction) => {
        state.showAuthenticationRouterLogin = action.showAuthenticationRouterLogin;
    });

    builder.addCase(SELECT_COMPUTED_LANGUAGE, (state: Draft<AppState>, action: ComputedLanguageAction) => {
        state.computedLanguage = action.computedLanguage;
    });
});
