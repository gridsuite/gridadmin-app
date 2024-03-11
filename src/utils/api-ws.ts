/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getToken } from './api';

export type * from './api';

export function getWsBase(): string {
    return (
        document.baseURI
            .replace(/^http(s?):\/\//, 'ws$1://')
            .replace(/\/+$/, '') + process.env.REACT_APP_WS_GATEWAY
    );
}

export function getUrlWithToken(baseUrl: string): string {
    const querySymbol = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${querySymbol}access_token=${getToken()}`;
}
