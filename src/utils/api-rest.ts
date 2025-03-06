/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getToken, parseError, Token } from './api';

export type { Token } from './api';

export interface ErrorWithStatus extends Error {
    status?: number;
}

export type Url = string | URL;
export type InitRequest = Partial<RequestInit>;

export function getRestBase(): string {
    // We use the `baseURI` (from `<base/>` in index.html) to build the URL, which is corrected by httpd/nginx
    return document.baseURI.replace(/\/+$/, '') + import.meta.env.VITE_API_GATEWAY;
}

function handleError(response: Response): Promise<never> {
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
                `${errorName}${response.status} ${response.statusText}, message : ${text}`
            ) as ErrorWithStatus;
            error.status = response.status;
        }
        throw error;
    });
}

function prepareRequest(init?: InitRequest, token?: Token): RequestInit {
    if (!(typeof init === 'undefined' || typeof init === 'object')) {
        throw new TypeError(`Argument 2 of backendFetch is not an object ${typeof init}`);
    }
    const initCopy: RequestInit = { ...init };
    initCopy.headers = new Headers(initCopy.headers || {});
    const tokenCopy = token || getToken();
    initCopy.headers.append('Authorization', `Bearer ${tokenCopy}`);
    return initCopy;
}

function safeFetch(url: Url, initCopy?: InitRequest) {
    return fetch(url, initCopy).then((response: Response) => (response.ok ? response : handleError(response)));
}

export function backendFetch(url: Url, init?: InitRequest, token?: Token): Promise<Response> {
    return safeFetch(url, prepareRequest(init, token));
}

export function backendFetchText(url: Url, init?: InitRequest, token?: Token): Promise<string> {
    return backendFetch(url, init, token).then((safeResponse: Response) => safeResponse.text());
}

export function backendFetchJson(url: Url, init?: InitRequest, token?: Token): Promise<unknown> {
    return backendFetch(url, init, token).then((safeResponse: Response) => safeResponse.json());
}
