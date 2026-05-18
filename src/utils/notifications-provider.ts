/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import { getWsBase } from './api-ws';
import { APP_NAME } from './config-params';
import { NotificationsUrlKeys, PREFIX_CONFIG_NOTIFICATION_WS } from '@gridsuite/commons-ui';

export function useNotificationsUrlGenerator() {
    // The websocket API doesn't allow relative urls
    const wsBase = getWsBase();

    // return a mapper with NOTIFICATIONS_URL_KEYS value
    // it will be used to register listeners as soon as possible.
    return useMemo(
        () =>
            ({
                [NotificationsUrlKeys.CONFIG]: `${wsBase}${PREFIX_CONFIG_NOTIFICATION_WS}/notify?${new URLSearchParams({ appName: APP_NAME })}`,
                [NotificationsUrlKeys.GLOBAL_CONFIG]: `${wsBase}${PREFIX_CONFIG_NOTIFICATION_WS}/global`,
            }) satisfies Partial<Record<NotificationsUrlKeys, string>>,
        [wsBase]
    );
}
