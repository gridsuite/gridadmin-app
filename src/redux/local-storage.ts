/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DARK_THEME, LANG_SYSTEM } from '@gridsuite/commons-ui';
import { getComputedLanguage } from '../utils/language';
import { APP_NAME } from '../utils/config-params';
import { AppState } from './reducer';

const LOCAL_STORAGE_THEME_KEY = (APP_NAME + '_THEME').toUpperCase();
const LOCAL_STORAGE_LANGUAGE_KEY = (APP_NAME + '_LANGUAGE').toUpperCase();

export function getLocalStorageTheme(): string {
    return localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || DARK_THEME;
}

export function saveLocalStorageTheme(theme: string): void {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
}

export function getLocalStorageLanguage(): AppState['language'] {
    return localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) || LANG_SYSTEM;
}

export function saveLocalStorageLanguage(language: AppState['language']): void {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
}

export function getLocalStorageComputedLanguage(): AppState['computedLanguage'] {
    return getComputedLanguage(getLocalStorageLanguage());
}
