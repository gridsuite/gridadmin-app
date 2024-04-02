/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { FunctionComponent } from 'react';
import {
    Announcement,
    DATE,
    DAYS,
    DURATION,
    HOURS,
    ID,
    MESSAGE,
    MINUTES,
} from './utils';
import { Cancel, Message, ScheduleSend, Timelapse } from '@mui/icons-material';
import { UserAdminSrv } from '../../services';

export const ListItemAnnouncement: FunctionComponent<Announcement> = (
    announcement
) => {
    return (
        <ListItem
            key={announcement[ID]}
            secondaryAction={
                <IconButton
                    onClick={() =>
                        UserAdminSrv.deleteAnnouncement(announcement[ID])
                    }
                    edge="end"
                    aria-label="delete"
                >
                    <Cancel />
                </IconButton>
            }
            sx={{ minHeight: 100 }}
        >
            <ListItemIcon>
                <Message />
            </ListItemIcon>
            <ListItemText
                sx={{ width: 550, marginRight: 10 }}
                primary={announcement[MESSAGE]}
            />
            <ListItemIcon>
                <ScheduleSend />
            </ListItemIcon>
            <ListItemText sx={{ width: 180 }} primary={announcement[DATE]} />
            <ListItemIcon>
                <Timelapse />
            </ListItemIcon>
            <ListItemText
                sx={{ width: 10 }}
                primary={
                    (announcement[DURATION][DAYS]
                        ? announcement[DURATION][DAYS] + ' d '
                        : '') +
                    (announcement[DURATION][HOURS]
                        ? announcement[DURATION][HOURS] + ' h '
                        : '') +
                    (announcement[DURATION][MINUTES]
                        ? announcement[DURATION][MINUTES] + ' m '
                        : '')
                }
            />
        </ListItem>
    );
};
