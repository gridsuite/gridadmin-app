/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PARAM_LANGUAGE } from '../utils/config-params';
import { Action } from 'redux';

export const SELECT_THEME = 'SELECT_THEME';
export type ThemeAction = Readonly<Action<typeof SELECT_THEME>> & {
    theme: string;
};
export function selectTheme(theme: string): ThemeAction {
    return { type: SELECT_THEME, theme: theme };
}

export const SELECT_LANGUAGE = 'SELECT_LANGUAGE';
export type LanguageAction = Readonly<Action<typeof SELECT_LANGUAGE>> & {
    [PARAM_LANGUAGE]: string;
};
export function selectLanguage(language: string): LanguageAction {
    return { type: SELECT_LANGUAGE, [PARAM_LANGUAGE]: language };
}

export const SELECT_COMPUTED_LANGUAGE = 'SELECT_COMPUTED_LANGUAGE';
export type ComputedLanguageAction = Readonly<
    Action<typeof SELECT_COMPUTED_LANGUAGE>
> & {
    computedLanguage: string;
};
export function selectComputedLanguage(
    computedLanguage: string
): ComputedLanguageAction {
    return {
        type: SELECT_COMPUTED_LANGUAGE,
        computedLanguage: computedLanguage,
    };
}
