/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PARAM_LANGUAGE } from '../utils/config-params';
import { Action } from 'redux';
import { AppState } from './reducer';
import { UserManagerState } from '../routes';

export const UPDATE_USER_MANAGER_STATE = 'UPDATE_USER_MANAGER_STATE';
export type UserManagerAction = Readonly<
    Action<typeof UPDATE_USER_MANAGER_STATE>
> & {
    userManager: UserManagerState;
};
export function updateUserManager(
    userManager: UserManagerState
): UserManagerAction {
    return { type: UPDATE_USER_MANAGER_STATE, userManager };
}
export function updateUserManagerDestructured(
    instance: UserManagerState['instance'],
    error: UserManagerState['error']
): UserManagerAction {
    return updateUserManager({ instance, error });
}

export const UPDATE_USER_MANAGER_INSTANCE = 'UPDATE_USER_MANAGER_INSTANCE';
export type UserManagerInstanceAction = Readonly<
    Action<typeof UPDATE_USER_MANAGER_INSTANCE>
> & { instance: UserManagerState['instance'] };
export function updateUserManagerInstance(
    instance: UserManagerState['instance']
): UserManagerInstanceAction {
    return { type: UPDATE_USER_MANAGER_INSTANCE, instance };
}

export const UPDATE_USER_MANAGER_ERROR = 'UPDATE_USER_MANAGER_ERROR';
export type UserManagerErrorAction = Readonly<
    Action<typeof UPDATE_USER_MANAGER_ERROR>
> & { error: UserManagerState['error'] };
export function updateUserManagerError(
    error: UserManagerState['error']
): UserManagerErrorAction {
    return { type: UPDATE_USER_MANAGER_ERROR, error };
}

export const SELECT_THEME = 'SELECT_THEME';
export type ThemeAction = Readonly<Action<typeof SELECT_THEME>> & {
    theme: string;
};
export function selectTheme(theme: string): ThemeAction {
    return { type: SELECT_THEME, theme: theme };
}

export const SELECT_LANGUAGE = 'SELECT_LANGUAGE';
export type LanguageAction = Readonly<Action<typeof SELECT_LANGUAGE>> & {
    [PARAM_LANGUAGE]: AppState['language'];
};
export function selectLanguage(language: AppState['language']): LanguageAction {
    return { type: SELECT_LANGUAGE, [PARAM_LANGUAGE]: language };
}

export const SELECT_COMPUTED_LANGUAGE = 'SELECT_COMPUTED_LANGUAGE';
export type ComputedLanguageAction = Readonly<
    Action<typeof SELECT_COMPUTED_LANGUAGE>
> & {
    computedLanguage: AppState['computedLanguage'];
};
export function selectComputedLanguage(
    computedLanguage: AppState['computedLanguage']
): ComputedLanguageAction {
    return {
        type: SELECT_COMPUTED_LANGUAGE,
        computedLanguage: computedLanguage,
    };
}
