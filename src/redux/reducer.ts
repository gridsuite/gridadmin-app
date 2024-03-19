/*
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
import { LanguageParameters, SupportedLanguages } from '../utils/language';
import { User } from '../utils/auth';
import { UserManagerState } from '../routes';

export type AppState = {
    computedLanguage: SupportedLanguages;
    [PARAM_THEME]: string;
    [PARAM_LANGUAGE]: LanguageParameters;

    userManager: UserManagerState;
    user: User | null; //TODO use true definition when commons-ui passed to typescript
    signInCallbackError: unknown;
    authenticationRouterError: unknown;
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
    (builder) => {
        builder.addCase(
            SELECT_THEME,
            (state: Draft<AppState>, action: ThemeAction) => {
                state.theme = action.theme;
                saveLocalStorageTheme(state.theme);
            }
        );

        builder.addCase(
            UPDATE_USER_MANAGER_STATE,
            (state: Draft<AppState>, action: UserManagerAction) => {
                state.userManager = action.userManager;
            }
        );

        builder.addCase(
            UPDATE_USER_MANAGER_INSTANCE,
            (state: Draft<AppState>, action: UserManagerInstanceAction) => {
                state.userManager.instance = action.instance;
            }
        );

        builder.addCase(
            UPDATE_USER_MANAGER_ERROR,
            (state: Draft<AppState>, action: UserManagerErrorAction) => {
                state.userManager.error = action.error;
            }
        );

        builder.addCase(USER, (state: Draft<AppState>, action: AnyAction) => {
            state.user = action.user;
        });

        builder.addCase(
            SIGNIN_CALLBACK_ERROR,
            (state: Draft<AppState>, action: AnyAction) => {
                state.signInCallbackError = action.signInCallbackError;
            }
        );

        builder.addCase(
            UNAUTHORIZED_USER_INFO,
            (state: Draft<AppState>, action: AnyAction) => {
                state.authenticationRouterError =
                    action.authenticationRouterError;
            }
        );

        builder.addCase(
            LOGOUT_ERROR,
            (state: Draft<AppState>, action: AnyAction) => {
                state.authenticationRouterError =
                    action.authenticationRouterError;
            }
        );

        builder.addCase(
            USER_VALIDATION_ERROR,
            (state: Draft<AppState>, action: AnyAction) => {
                state.authenticationRouterError =
                    action.authenticationRouterError;
            }
        );

        builder.addCase(
            RESET_AUTHENTICATION_ROUTER_ERROR,
            (state: Draft<AppState>, action: AnyAction) => {
                state.authenticationRouterError = null;
            }
        );

        builder.addCase(
            SHOW_AUTH_INFO_LOGIN,
            (state: Draft<AppState>, action: AnyAction) => {
                state.showAuthenticationRouterLogin =
                    action.showAuthenticationRouterLogin;
            }
        );

        builder.addCase(
            SELECT_COMPUTED_LANGUAGE,
            (state: Draft<AppState>, action: ComputedLanguageAction) => {
                state.computedLanguage = action.computedLanguage;
            }
        );
    }
);
