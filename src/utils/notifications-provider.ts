/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../redux/reducer';
import { getUrlWithToken, getWsBase } from './api-ws';
import { APP_NAME } from './config-params';

export enum NOTIFICATIONS_URL_KEYS {
    CONFIG = 'CONFIG',
}

export const PREFIX_CONFIG_NOTIFICATION_WS = '/config-notification';

export function useNotificationsUrlGenerator() {
    // The websocket API doesn't allow relative urls
    const wsBase = getWsBase();
    const tokenId = useSelector((state: AppState) => state.user?.id_token);

    // return a mapper with NOTIFICATIONS_URL_KEYS and undefined value if URL is not yet buildable (tokenId)
    // it will be used to register listeners as soon as possible.
    return useMemo(
        () =>
            ({
                [NOTIFICATIONS_URL_KEYS.CONFIG]: tokenId
                    ? getUrlWithToken(
                          `${wsBase}${PREFIX_CONFIG_NOTIFICATION_WS}/notify?${new URLSearchParams({
                              appName: APP_NAME,
                          })}`
                      )
                    : undefined,
            } satisfies Record<NOTIFICATIONS_URL_KEYS, string | undefined>),
        [wsBase, tokenId]
    );
}
