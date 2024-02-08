/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AnyAction, createReducer, Draft } from '@reduxjs/toolkit';

import {
    getLocalStorageComputedLanguage,
    getLocalStorageLanguage,
    getLocalStorageTheme,
    saveLocalStorageTheme,
} from './local-storage';

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
    LOGOUT_ERROR,
    RESET_AUTHENTICATION_ROUTER_ERROR,
    SHOW_AUTH_INFO_LOGIN,
    SIGNIN_CALLBACK_ERROR,
    UNAUTHORIZED_USER_INFO,
    USER,
    USER_VALIDATION_ERROR,
} from '@gridsuite/commons-ui';
import { PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params';
import { ReducerWithInitialState } from '@reduxjs/toolkit/dist/createReducer';
import { UserManagerState } from '../routes';

export type AppState = {
    computedLanguage: ReturnType<typeof getLocalStorageComputedLanguage>;
    [PARAM_THEME]: ReturnType<typeof getLocalStorageTheme>;
    [PARAM_LANGUAGE]: ReturnType<typeof getLocalStorageLanguage>;

    userManager: UserManagerState;
    user: Record<string, any> | null;
    signInCallbackError: any;
    authenticationRouterError: any;
    showAuthenticationRouterLogin: boolean;
};

const initialState: AppState = {
    computedLanguage: getLocalStorageComputedLanguage(),
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
};

export type Actions =
    | AnyAction
    | UserManagerAction
    | UserManagerInstanceAction
    | UserManagerErrorAction
    | ThemeAction
    | LanguageAction
    | ComputedLanguageAction;

export type AppStateKey = keyof AppState;

export const reducer: ReducerWithInitialState<AppState> = createReducer(
    initialState,
    {
        [SELECT_THEME]: (state: Draft<AppState>, action: ThemeAction) => {
            state.theme = action.theme;
            saveLocalStorageTheme(state.theme);
        },

        [UPDATE_USER_MANAGER_STATE]: (
            state: Draft<AppState>,
            action: UserManagerAction
        ) => {
            state.userManager = action.userManager;
        },
        [UPDATE_USER_MANAGER_INSTANCE]: (
            state: Draft<AppState>,
            action: UserManagerInstanceAction
        ) => {
            state.userManager.instance = action.instance;
        },
        [UPDATE_USER_MANAGER_ERROR]: (
            state: Draft<AppState>,
            action: UserManagerErrorAction
        ) => {
            state.userManager.error = action.error;
        },

        [USER]: (state: Draft<AppState>, action: AnyAction) => {
            state.user = action.user;
        },

        [SIGNIN_CALLBACK_ERROR]: (
            state: Draft<AppState>,
            action: AnyAction
        ) => {
            state.signInCallbackError = action.signInCallbackError;
        },

        [UNAUTHORIZED_USER_INFO]: (
            state: Draft<AppState>,
            action: AnyAction
        ) => {
            state.authenticationRouterError = action.authenticationRouterError;
        },

        [LOGOUT_ERROR]: (state: Draft<AppState>, action: AnyAction) => {
            state.authenticationRouterError = action.authenticationRouterError;
        },

        [USER_VALIDATION_ERROR]: (
            state: Draft<AppState>,
            action: AnyAction
        ) => {
            state.authenticationRouterError = action.authenticationRouterError;
        },

        [RESET_AUTHENTICATION_ROUTER_ERROR]: (
            state: Draft<AppState>,
            action: AnyAction
        ) => {
            state.authenticationRouterError = null;
        },

        [SHOW_AUTH_INFO_LOGIN]: (state: Draft<AppState>, action: AnyAction) => {
            state.showAuthenticationRouterLogin =
                action.showAuthenticationRouterLogin;
        },

        [SELECT_COMPUTED_LANGUAGE]: (
            state: Draft<AppState>,
            action: ComputedLanguageAction
        ) => {
            state.computedLanguage = action.computedLanguage;
        },
    }
);
