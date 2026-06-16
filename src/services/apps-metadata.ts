/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type Env, IdpSettings } from '@gridsuite/commons-ui';
import { getErrorMessage } from '../utils/error';

export type EnvJson = Env & typeof import('../../public/env.json');
const IDP_SETTINGS_CACHE_KEY = 'gridsuite-idp-settings';
function fetchEnv(): Promise<EnvJson> {
    return fetch('env.json').then((res: Response) => res.json());
}

// Always hits the network: picks up config changes on each full app load
// AND refreshes the cache read by the silent-renew iframe.
export function fetchIdpSettings(): Promise<IdpSettings> {
    return fetch('idpSettings.json')
        .then((res) => res.json())
        .then((settings: IdpSettings) => {
            localStorage.setItem(IDP_SETTINGS_CACHE_KEY, JSON.stringify(settings));
            return settings;
        });
}

// Used only on the silent-renew path: reads the cache (no network),
// falls back to a real fetch if the cache is missing/corrupted.
export function getCachedIdpSettings(): Promise<IdpSettings> {
    const cached = localStorage.getItem(IDP_SETTINGS_CACHE_KEY);
    if (cached) {
        try {
            return Promise.resolve(JSON.parse(cached) as IdpSettings);
        } catch {
            // corrupted cache -> fall back to a fresh fetch
        }
    }
    return fetchIdpSettings();
}

export type VersionJson = {
    deployVersion?: string;
};

export function fetchVersion(): Promise<VersionJson> {
    console.debug(`Fetching global metadata...`);
    return fetchEnv()
        .then((env: EnvJson) => fetch(`${env.appsMetadataServerUrl}/version.json`))
        .then((response: Response) => response.json())
        .catch((error) => {
            console.error(`Error while fetching the version: ${getErrorMessage(error)}`);
            throw error;
        });
}
