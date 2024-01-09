/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { APP_NAME, getAppName } from './config-params';
import { store } from '../redux/store';
import ReconnectingWebSocket from 'reconnecting-websocket';

const PREFIX_USER_ADMIN_SERVER_QUERIES =
    process.env.REACT_APP_API_GATEWAY + '/user-admin';

// If you want to use user-admin-server in dev mode you must avoid passing through gateway
// and use the user-admin-server directly. SetupProxy should allow this.
// const PREFIX_USER_ADMIN_SERVER_QUERIES =
//     process.env.REACT_APP_API_PREFIX +
//     (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
//         ? process.env.REACT_APP_API_GATEWAY + '/user-admin'
//         : process.env.REACT_APP_USER_ADMIN_URI);

const PREFIX_CONFIG_QUERIES = process.env.REACT_APP_API_GATEWAY + '/config';
const PREFIX_CONFIG_NOTIFICATION_WS =
    process.env.REACT_APP_WS_GATEWAY + '/config-notification';

function getToken() {
    const state = store.getState();
    return state.user.id_token;
}

export function connectNotificationsWsUpdateConfig() {
    const webSocketBaseUrl = document.baseURI
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');
    const webSocketUrl =
        webSocketBaseUrl +
        PREFIX_CONFIG_NOTIFICATION_WS +
        '/notify?appName=' +
        APP_NAME;

    const reconnectingWebSocket = new ReconnectingWebSocket(
        () => webSocketUrl + '&access_token=' + getToken()
    );
    reconnectingWebSocket.onopen = function (event) {
        console.info(
            'Connected Websocket update config ui ' + webSocketUrl + ' ...'
        );
    };
    return reconnectingWebSocket;
}

function parseError(text) {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}

function handleError(response) {
    return response.text().then((text) => {
        const errorName = 'HttpResponseError : ';
        let error;
        const errorJson = parseError(text);
        if (
            errorJson &&
            errorJson.status &&
            errorJson.error &&
            errorJson.message
        ) {
            error = new Error(
                errorName +
                    errorJson.status +
                    ' ' +
                    errorJson.error +
                    ', message : ' +
                    errorJson.message
            );
            error.status = errorJson.status;
        } else {
            error = new Error(
                errorName + response.status + ' ' + response.statusText
            );
            error.status = response.status;
        }
        throw error;
    });
}

function prepareRequest(init, token) {
    if (!(typeof init == 'undefined' || typeof init == 'object')) {
        throw new TypeError(
            'Argument 2 of backendFetch is not an object' + typeof init
        );
    }
    const initCopy = Object.assign({}, init);
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token ? token : getToken();
    initCopy.headers.append('Authorization', 'Bearer ' + tokenCopy);
    return initCopy;
}

function safeFetch(url, initCopy) {
    return fetch(url, initCopy).then((response) =>
        response.ok ? response : handleError(response)
    );
}

export function backendFetch(url, init, token) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy);
}

export function backendFetchText(url, init, token) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => safeResponse.text());
}

export function backendFetchJson(url, init, token) {
    const initCopy = prepareRequest(init, token);
    return safeFetch(url, initCopy).then((safeResponse) => safeResponse.json());
}

export function fetchValidateUser(user) {
    const sub = user?.profile?.sub;
    if (!sub) {
        return Promise.reject(
            new Error(
                'Error : Fetching access for missing user.profile.sub : ' + user
            )
        );
    }

    console.info(`Fetching access for user...`);
    const CheckAccessUrl =
        PREFIX_USER_ADMIN_SERVER_QUERIES + `/v1/users/${sub}`;
    console.debug(CheckAccessUrl);

    return backendFetch(
        CheckAccessUrl,
        {
            method: 'head',
        },
        user?.id_token
    )
        .then((response) => {
            //if the response is ok, the responseCode will be either 200 or 204 otherwise it's a Http error and it will be caught
            return response.status === 200;
        })
        .catch((error) => {
            if (error.status === 403) {
                return false;
            }
            throw error;
        });
}

function fetchEnv() {
    return fetch('env.json').then((res) => res.json());
}

export function fetchAuthorizationCodeFlowFeatureFlag() {
    console.info(`Fetching authorization code flow feature flag...`);
    return fetchEnv()
        .then((res) =>
            fetch(res.appsMetadataServerUrl + '/authentication.json')
        )
        .then((res) => res.json())
        .then((res) => {
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

export function fetchVersion() {
    console.info(`Fetching global metadata...`);
    return fetchEnv()
        .then((env) => fetch(env.appsMetadataServerUrl + '/version.json'))
        .then((response) => response.json())
        .catch((reason) => {
            console.error('Error while fetching the version : ' + reason);
            return reason;
        });
}

export function fetchAppsAndUrls() {
    console.info(`Fetching apps and urls...`);
    return fetchEnv()
        .then((res) => fetch(res.appsMetadataServerUrl + '/apps-metadata.json'))
        .then((response) => response.json());
}

export function fetchConfigParameters(appName) {
    console.info('Fetching UI configuration params for app : ' + appName);
    const fetchParams =
        PREFIX_CONFIG_QUERIES + `/v1/applications/${appName}/parameters`;
    return backendFetchJson(fetchParams);
}

export function fetchConfigParameter(name) {
    const appName = getAppName(name);
    console.info(
        "Fetching UI config parameter '%s' for app '%s' ",
        name,
        appName
    );
    const fetchParams =
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters/${name}`;
    return backendFetchJson(fetchParams);
}

export function updateConfigParameter(name, value) {
    const appName = getAppName(name);
    console.info(
        "Updating config parameter '%s=%s' for app '%s' ",
        name,
        value,
        appName
    );
    const updateParams =
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters/${name}?value=` +
        encodeURIComponent(value);
    return backendFetch(updateParams, { method: 'put' });
}
