/*
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GsLang, GsLangUser, LANG_ENGLISH, LANG_FRENCH, LANG_SYSTEM } from '@gridsuite/commons-ui';

const supportedLanguages: string[] = [LANG_FRENCH, LANG_ENGLISH];

export function getSystemLanguage(): GsLangUser {
    const systemLanguage = navigator.language.split(/[-_]/)[0];
    return supportedLanguages.includes(systemLanguage) ? (systemLanguage as GsLangUser) : LANG_ENGLISH;
}

export function getComputedLanguage(language: GsLang): GsLangUser {
    return language === LANG_SYSTEM ? getSystemLanguage() : language;
}
