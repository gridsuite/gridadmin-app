/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getErrorMessage } from '../utils/error';
import { Url } from '../utils/api-rest';

export type EnvJson = typeof import('../../public/env.json') & {
    // https://github.com/gridsuite/deployment/blob/main/docker-compose/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-dev/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/azure-integ/env.json
    // https://github.com/gridsuite/deployment/blob/main/k8s/live/local/env.json
    appsMetadataServerUrl?: Url;
    mapBoxToken?: string;
    //[key: string]: string;
};

function fetchEnv(): Promise<EnvJson> {
    return fetch('env.json').then((res: Response) => res.json());
}

export function fetchAuthorizationCodeFlowFeatureFlag(): Promise<boolean> {
    console.info(`Fetching authorization code flow feature flag...`);
    return fetchEnv()
        .then((env: EnvJson) =>
            fetch(`${env.appsMetadataServerUrl}/authentication.json`)
        )
        .then((res: Response) => res.json())
        .then((res: { authorizationCodeFlowFeatureFlag: boolean }) => {
            console.log(
                `Authorization code flow is ${
                    res.authorizationCodeFlowFeatureFlag
                        ? 'enabled'
                        : 'disabled'
                }`
            );
            return res.authorizationCodeFlowFeatureFlag || false;
        })
        .catch((error) => {
            console.error(error);
            console.warn(
                `Something wrong happened when retrieving authentication.json: authorization code flow will be disabled`
            );
            return false;
        });
}

export type VersionJson = {
    deployVersion?: string;
};

export function fetchVersion(): Promise<VersionJson> {
    console.info(`Fetching global metadata...`);
    return fetchEnv()
        .then((env: EnvJson) =>
            fetch(`${env.appsMetadataServerUrl}/version.json`)
        )
        .then((response: Response) => response.json())
        .catch((error) => {
            console.error(
                `Error while fetching the version : ${getErrorMessage(error)}`
            );
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
    console.info(`Fetching apps and urls...`);
    return fetchEnv()
        .then((env: EnvJson) =>
            fetch(`${env.appsMetadataServerUrl}/apps-metadata.json`)
        )
        .then((response: Response) => response.json());
}
