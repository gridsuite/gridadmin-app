/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { APP_NAME } from './config-params';
import { store } from '../redux/store';
import ReconnectingWebSocket, { Event } from 'reconnecting-websocket';
import { AppState } from '../redux/reducer';

export interface ErrorWithStatus extends Error {
    status?: number;
}

export type Url = Exclude<Parameters<typeof fetch>[0], Request>; //string | URL;
export type InitRequest = Partial<Parameters<typeof fetch>[1]>; //Partial<RequestInit>;
export type Token = string;
export type ReqResponse = Awaited<ReturnType<typeof fetch>>;

const PREFIX_CONFIG_NOTIFICATION_WS = `${process.env.REACT_APP_WS_GATEWAY}/${process.env.REACT_APP_SRV_CONFIG_NOTIF_URI}`;

export function connectNotificationsWsUpdateConfig(): ReconnectingWebSocket {
    const webSocketBaseUrl = document.baseURI
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');
    const webSocketUrl = `${webSocketBaseUrl}${PREFIX_CONFIG_NOTIFICATION_WS}/notify?appName=${APP_NAME}`;

    const reconnectingWebSocket = new ReconnectingWebSocket(
        () => `${webSocketUrl}&access_token=${getToken()}`
    );
    reconnectingWebSocket.onopen = function (event: Event) {
        console.info(
            `Connected Websocket update config ui ${webSocketUrl} ...`
        );
    };
    return reconnectingWebSocket;
}

function getToken(): Token {
    const state: AppState = store.getState();
    return state.user?.id_token;
}

function parseError(text: string): any {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}

function handleError(response: ReqResponse): Promise<never> {
    return response.text().then((text: string) => {
        const errorName = 'HttpResponseError : ';
        let error: ErrorWithStatus;
        const errorJson = parseError(text);
        if (errorJson?.status && errorJson?.error && errorJson?.message) {
            error = new Error(
                `${errorName}${errorJson.status} ${errorJson.error}, message : ${errorJson.message}`
            ) as ErrorWithStatus;
            error.status = errorJson.status;
        } else {
            error = new Error(
                `${errorName}${response.status} ${response.statusText}`
            ) as ErrorWithStatus;
            error.status = response.status;
        }
        throw error;
    });
}

function prepareRequest(init?: InitRequest, token?: Token): RequestInit {
    if (!(typeof init === 'undefined' || typeof init === 'object')) {
        throw new TypeError(
            `Argument 2 of backendFetch is not an object ${typeof init}`
        );
    }
    const initCopy: RequestInit = { ...init };
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token || getToken();
    initCopy.headers.append('Authorization', `Bearer ${tokenCopy}`);
    return initCopy;
}

function safeFetch(url: Url, initCopy?: InitRequest): ReturnType<typeof fetch> {
    return fetch(url, initCopy).then((response: ReqResponse) =>
        response.ok ? response : handleError(response)
    );
}

export function backendFetch(
    url: Url,
    init?: InitRequest,
    token?: Token
): ReturnType<typeof safeFetch> {
    return safeFetch(url, prepareRequest(init, token));
}

export function backendFetchText(
    url: Url,
    init?: InitRequest,
    token?: Token
): ReturnType<Body['text']> {
    return backendFetch(url, init, token).then((safeResponse: ReqResponse) =>
        safeResponse.text()
    );
}

export function backendFetchJson(
    url: Url,
    init?: InitRequest,
    token?: Token
): ReturnType<Body['json']> {
    return backendFetch(url, init, token).then((safeResponse: ReqResponse) =>
        safeResponse.json()
    );
}
