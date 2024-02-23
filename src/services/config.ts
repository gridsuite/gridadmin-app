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
    appName = appName.toLowerCase();
    console.debug(`Fetching UI configuration params for app : ${appName}`);
    return backendFetchJson(
        `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters`
    );
}

export function fetchConfigParameter(
    name: string
): ReturnType<typeof backendFetchJson> {
    const appName = getAppName(name).toLowerCase();
    console.debug(
        `Fetching UI config parameter '${name}' for app '${appName}'`
    );
    return backendFetchJson(
        `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters/${name}`
    );
}

export function updateConfigParameter(
    name: string,
    value: Parameters<typeof encodeURIComponent>[0]
): ReturnType<typeof backendFetch> {
    const appName = getAppName(name).toLowerCase();
    console.debug(
        `Updating config parameter '${name}=${value}' for app '${appName}'`
    );
    return backendFetch(
        `${PREFIX_CONFIG_QUERIES}/v1/applications/${appName}/parameters/${name}?value=${encodeURIComponent(
            value
        )}`,
        { method: 'put' }
    );
}
