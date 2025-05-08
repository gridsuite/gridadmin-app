/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getToken } from './api';

export type * from './api';

export const getWsBase = () => document.baseURI.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://');

export function getUrlWithToken(baseUrl: string): string {
    const querySymbol = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${querySymbol}access_token=${getToken()}`;
}
