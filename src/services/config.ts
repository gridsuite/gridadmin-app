/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GsLang, GsTheme } from '@gridsuite/commons-ui';
import { APP_NAME, getAppName, PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params';
import { backendFetch, backendFetchJson, getRestBase } from '../utils/api-rest';

const PREFIX_CONFIG_QUERIES = `${getRestBase()}/config`;

// https://github.com/gridsuite/config-server/blob/main/src/main/java/org/gridsuite/config/server/dto/ParameterInfos.java
export type ConfigParameter =
    | {
          readonly name: typeof PARAM_LANGUAGE;
          value: GsLang;
      }
    | {
          readonly name: typeof PARAM_THEME;
          value: GsTheme;
      };
export type ConfigParameters = ConfigParameter[];

export function fetchConfigParameters(appName: string = APP_NAME): Promise<ConfigParameters> {
    console.debug(`Fetching UI configuration params for app : ${appName}`);
    const fetchParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters`;
    return backendFetchJson(fetchParams) as Promise<ConfigParameters>;
}

export function fetchConfigParameter(name: string): Promise<ConfigParameter> {
    const appName = getAppName(name);
    console.debug(`Fetching UI config parameter '${name}' for app '${appName}'`);
    const fetchParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters/${name}`;
    return backendFetchJson(fetchParams) as Promise<ConfigParameter>;
}

export function updateConfigParameter(name: string, value: Parameters<typeof encodeURIComponent>[0]): Promise<void> {
    const appName = getAppName(name);
    console.debug(`Updating config parameter '${name}=${value}' for app '${appName}'`);
    const updateParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters/${name}?value=${encodeURIComponent(
        value
    )}`;
    return backendFetch(updateParams, {
        method: 'put',
    }) as Promise<unknown> as Promise<void>;
}
