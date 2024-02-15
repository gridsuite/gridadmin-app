import { getAppName } from '../utils/config-params';
import { backendFetch, backendFetchJson } from '../utils/api-rest';

const PREFIX_CONFIG_QUERIES = `${process.env.REACT_APP_API_GATEWAY}/config`;

export type ConfigParameter = {
    //TODO check with config-server swagger
    name: string;
    value: any;
    [propertiesName: string]: unknown; //temporary
};
export type ConfigParameters = Array<ConfigParameter>;
export function fetchConfigParameters(
    appName: string
): Promise<ConfigParameters> {
    console.info(`Fetching UI configuration params for app : ${appName}`);
    const fetchParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters`;
    return backendFetchJson(fetchParams);
}

export function fetchConfigParameter(
    name: string
): ReturnType<typeof backendFetchJson> {
    const appName = getAppName(name);
    console.info(`Fetching UI config parameter '${name}' for app '${appName}'`);
    const fetchParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters/${name}`;
    return backendFetchJson(fetchParams);
}

export function updateConfigParameter(
    name: string,
    value: Parameters<typeof encodeURIComponent>[0]
): ReturnType<typeof backendFetch> {
    const appName = getAppName(name);
    console.info(
        `Updating config parameter '${name}=${value}' for app '${appName}'`
    );
    const updateParams = `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters/${name}?value=${encodeURIComponent(
        value
    )}`;
    return backendFetch(updateParams, { method: 'put' });
}
