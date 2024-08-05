/*
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LiteralUnion } from 'type-fest';

export const COMMON_APP_NAME = 'common';
export const APP_NAME = 'admin';

export const PARAM_THEME = 'theme';
export const PARAM_LANGUAGE = 'language';

const COMMON_CONFIG_PARAMS_NAMES = new Set([PARAM_THEME, PARAM_LANGUAGE]);

export type AppConfigParameter = LiteralUnion<typeof PARAM_THEME | typeof PARAM_LANGUAGE, string>;

export type AppConfigType = typeof COMMON_APP_NAME | typeof APP_NAME;

/**
 * Permit knowing if a parameter is common/shared between webapps or is specific to this application.
 * @param paramName the parameter name/key
 */
export function getAppName(paramName: AppConfigParameter): AppConfigType {
    return COMMON_CONFIG_PARAMS_NAMES.has(paramName) ? COMMON_APP_NAME : APP_NAME;
}
