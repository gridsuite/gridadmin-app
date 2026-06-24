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
export const SILENT_RENEW_CALLBACK_PATH = '/silent-renew-callback';
function fetchEnv(): Promise<EnvJson> {
    return fetch('env.json').then((res: Response) => res.json());
}

// Always hits the network: picks up config changes on each full app load
// AND refreshes the cache read by the silent-renew iframe.
export function fetchIdpSettings(): Promise<IdpSettings> {
    return fetch('idpSettings.json')
        .then((res) => res.json())
        .then((settings: IdpSettings) => {
            try {
                localStorage.setItem(IDP_SETTINGS_CACHE_KEY, JSON.stringify(settings));
            } catch (e) {
                console.warn('Failed to cache IdP settings:', e);
            }
            return settings;
        });
}

// Used only on the silent-renew path: reads the cache (no network),
// falls back to a real fetch if the cache is missing/corrupted.
export function getCachedIdpSettings(): Promise<IdpSettings> {
    try {
        const cached = localStorage.getItem(IDP_SETTINGS_CACHE_KEY);
        if (cached) {
            return Promise.resolve(JSON.parse(cached) as IdpSettings);
        }
    } catch (e) {
        // localStorage unavailable, or cache corrupted -> fall back to fresh fetch
        console.warn('Failed to read cached IdP settings:', e);
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
