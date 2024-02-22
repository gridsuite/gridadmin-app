import { ReqResponse } from '../utils/api-rest';

export type EnvJson = typeof import('../../public/env.json');

function fetchEnv(): Promise<EnvJson> {
    return fetch('/env.json').then((res: ReqResponse) => res.json());
}

export function fetchAuthorizationCodeFlowFeatureFlag(): Promise<boolean> {
    console.info(`Fetching authorization code flow feature flag...`);
    return fetchEnv()
        .then((env: EnvJson) =>
            fetch(`${env.appsMetadataServerUrl}/authentication.json`)
        )
        .then((res: ReqResponse) => res.json())
        .then((res: Record<string, any>) => {
            console.log(
                `Authorization code flow is ${
                    res.authorizationCodeFlowFeatureFlag
                        ? 'enabled'
                        : 'disabled'
                }`
            );
            return res.authorizationCodeFlowFeatureFlag;
        })
        .catch((error) => {
            console.error(error);
            console.warn(
                `Something wrong happened when retrieving authentication.json: authorization code flow will be disabled`
            );
            return false;
        });
}

export function fetchVersion(): Promise<Record<string, any>> {
    console.info(`Fetching global metadata...`);
    return fetchEnv()
        .then((env: EnvJson) =>
            fetch(`${env.appsMetadataServerUrl}/version.json`)
        )
        .then((response: ReqResponse) => response.json())
        .catch((reason) => {
            console.error(`Error while fetching the version : ${reason}`);
            return reason;
        });
}

export function fetchAppsAndUrls(): Promise<Array<Record<string, any>>> {
    console.info(`Fetching apps and urls...`);
    return fetchEnv()
        .then((env: EnvJson) =>
            fetch(`${env.appsMetadataServerUrl}/apps-metadata.json`)
        )
        .then((response: ReqResponse) => response.json());
}
