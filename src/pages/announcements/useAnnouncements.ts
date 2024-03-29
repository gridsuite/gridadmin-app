/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Announcement, fromBackToFront } from './utils';
import { UserAdminSrv } from '../../services';
import { getUrlWithToken, getWsBase } from '../../utils/api-ws';

const PREFIX_CONFIG_NOTIFICATION_WS = `${getWsBase()}/config-notification`;
const webSocketUrl = `${PREFIX_CONFIG_NOTIFICATION_WS}/global`;

export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        function getAnnouncements() {
            UserAdminSrv.getAnnouncements().then((announcements) =>
                setAnnouncements(
                    announcements.map((announcement) =>
                        fromBackToFront(announcement)
                    )
                )
            );
        }

        const rws = new ReconnectingWebSocket(() =>
            getUrlWithToken(webSocketUrl)
        );

        rws.addEventListener('open', () => {
            console.info('WebSocket for announcements is connected');
            // We retrieve the announcements at start
            getAnnouncements();
        });

        rws.addEventListener('message', (event) => {
            // When new message, we just fetch back the latest list of announcements
            getAnnouncements();
        });

        rws.addEventListener('error', (event) => {
            console.error('Unexpected announcements WebSocket error : ', event);
        });

        return () => rws.close();
    }, []);

    return announcements;
}
