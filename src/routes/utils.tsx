/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Navigate, RouteObject } from 'react-router-dom';
import { Profiles, Users, Groups } from '../pages';
import ErrorPage from './ErrorPage';
import HomePage from './HomePage';
import { getPreLoginPath } from '@gridsuite/commons-ui';
import { FormattedMessage } from 'react-intl';

export enum MainPaths {
    users = 'users',
    profiles = 'profiles',
    groups = 'groups',
}

export function appRoutes(): RouteObject[] {
    return [
        {
            path: '/',
            errorElement: <ErrorPage />,
            children: [
                {
                    index: true,
                    element: <HomePage />,
                },
                {
                    path: `/${MainPaths.users}`,
                    element: <Users />,
                    handle: {
                        appBar_tab: MainPaths.users,
                    },
                },
                {
                    path: `/${MainPaths.profiles}`,
                    element: <Profiles />,
                    handle: {
                        appBar_tab: MainPaths.profiles,
                    },
                },
                {
                    path: `/${MainPaths.groups}`,
                    element: <Groups />,
                    handle: {
                        appBar_tab: MainPaths.groups,
                    },
                },
            ],
        },
        {
            path: '/sign-in-callback',
            element: <Navigate replace to={getPreLoginPath() || '/'} />,
        },
        {
            path: '/logout-callback',
            element: <FormattedMessage tagName="h1" id="logoutFailed" />,
        },
        {
            path: '*',
            element: <FormattedMessage tagName="h1" id="pageNotFound" />,
            errorElement: <ErrorPage />,
        },
    ];
}
