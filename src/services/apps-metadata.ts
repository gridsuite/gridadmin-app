/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Env } from '@gridsuite/commons-ui';
import { getErrorMessage } from '../utils/error';
import { Url } from '../utils/api-rest';

// TODO remove when exported in commons-ui (src/utils/AuthService.ts)
type IdpSettings = {
    authority: string;
    client_id: string;
    redirect_uri: string;
    post_logout_redirect_uri: string;
    silent_redirect_uri: string;
    scope: string;
    maxExpiresIn?: number;
};

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

export type MetadataCommon = {
    name: string;
    url: Url;
    appColor: string;
    hiddenInAppsMenu: boolean;
};

export type MetadataStudy = MetadataCommon & {
    readonly name: 'Study';
    resources?: {
        types: string[];
        path: string;
    }[];
    predefinedEquipmentProperties?: {
        substation?: {
            region?: string[];
            tso?: string[];
            totallyFree?: unknown[];
            Demo?: string[];
        };
        load?: {
            codeOI?: string[];
        };
    };
    defaultParametersValues?: {
        fluxConvention?: string;
        enableDeveloperMode?: string; //maybe 'true'|'false' type?
        mapManualRefresh?: string; //maybe 'true'|'false' type?
    };
};

// https://github.com/gridsuite/deployment/blob/main/docker-compose/docker-compose.base.yml
// https://github.com/gridsuite/deployment/blob/main/k8s/resources/common/config/apps-metadata.json
export type MetadataJson = MetadataCommon | MetadataStudy;

export function fetchAppsAndUrls(): Promise<MetadataJson[]> {
    console.debug('Fetching apps and urls...');
    return fetchEnv()
        .then((env: EnvJson) => fetch(`${env.appsMetadataServerUrl}/apps-metadata.json`))
        .then((response: Response) => response.json());
}
