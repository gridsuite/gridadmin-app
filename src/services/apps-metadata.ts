/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type Env, IdpSettings } from '@gridsuite/commons-ui';
import { getErrorMessage } from '../utils/error';

export type EnvJson = Env & typeof import('../../public/env.json');

function fetchEnv(): Promise<EnvJson> {
    return fetch('env.json').then((res: Response) => res.json());
}

export function fetchIdpSettings(): Promise<IdpSettings> {
    return fetch('idpSettings.json').then((res) => res.json());
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
