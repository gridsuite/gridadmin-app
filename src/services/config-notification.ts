import ReconnectingWebSocket, { Event } from 'reconnecting-websocket';
import { APP_NAME } from '../utils/config-params';
import { getUrlWithToken, getWsBase } from '../utils/api-ws';

const PREFIX_CONFIG_NOTIFICATION_WS = `${process.env.REACT_APP_WS_GATEWAY}/config-notification`;

export function connectNotificationsWsUpdateConfig(): ReconnectingWebSocket {
    const webSocketUrl = `${getWsBase()}${PREFIX_CONFIG_NOTIFICATION_WS}/notify?appName=${APP_NAME.toLowerCase()}`;
    const reconnectingWebSocket = new ReconnectingWebSocket(
        () => getUrlWithToken(webSocketUrl),
        undefined,
        { debug: process.env.REACT_APP_DEBUG_REQUESTS === 'true' }
    );
    reconnectingWebSocket.onopen = function (event: Event) {
        console.info(`Connected Websocket update config ui: ${webSocketUrl}`);
    };
    return reconnectingWebSocket;
}