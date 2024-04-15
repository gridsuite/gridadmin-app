/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ReconnectingWebSocket, { Event } from 'reconnecting-websocket';
import { APP_NAME } from '../utils/config-params';
import { getUrlWithToken, getWsBase } from '../utils/api-ws';

const PREFIX_CONFIG_NOTIFICATION_WS = `${getWsBase()}/config-notification`;

export function connectNotificationsWsUpdateConfig(): ReconnectingWebSocket {
    const webSocketUrl = `${PREFIX_CONFIG_NOTIFICATION_WS}/notify?appName=${APP_NAME}`;
    const reconnectingWebSocket = new ReconnectingWebSocket(
        () => getUrlWithToken(webSocketUrl),
        undefined,
        { debug: import.meta.env.VITE_DEBUG_REQUESTS === 'true' }
    );
    reconnectingWebSocket.onopen = function (event: Event) {
        console.info(`Connected Websocket update config ui: ${webSocketUrl}`);
    };
    return reconnectingWebSocket;
}
