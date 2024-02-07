/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    Dispatch,
    FunctionComponent,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Box, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import {
    AuthenticationRouter,
    getPreLoginPath,
    initializeAuthenticationProd,
} from '@gridsuite/commons-ui';
import { Router } from '@remix-run/router';
import { AppTopBarProps } from '../components/app-top-bar';
import {
    BrowserRouter,
    createBrowserRouter,
    Navigate,
    Outlet,
    RouteObject,
    RouterProvider,
    useLocation,
    useMatch,
    useNavigate,
} from 'react-router-dom';
import { UserManager } from 'oidc-client';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../redux/reducer';
import { UserAdminSrv, AppsMetadataSrv } from '../services';
import App from '../components/app';
import { Users } from '../components/users';
import { Connections } from '../components/connections';
import ErrorPage from './ErrorPage';

const pathUsers = 'users';
const pathConnections = 'connections';
export const UrlPaths = {
    users: `/${pathUsers}`,
    connections: `/${pathConnections}`,
};

export function appRoutes(): RouteObject[] {
    return [
        {
            path: '/',
            children: [
                {
                    index: true,
                    element: (
                        <Box mt={20}>
                            <Typography
                                variant="h3"
                                color="textPrimary"
                                align="center"
                            >
                                <FormattedMessage id="connected" />
                            </Typography>
                        </Box>
                    ),
                },
                { path: pathUsers, element: <Users /> },
                { path: pathConnections, element: <Connections /> },
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
            element: <FormattedMessage tagName="h1" id="PageNotFound" />,
            errorElement: <ErrorPage />,
        },
    ];
}

const AuthRouter: FunctionComponent<{
    userManager: (typeof AuthenticationRouter)['userManager'];
}> = (props, context) => {
    const signInCallbackError = useSelector(
        (state: AppState) => state.signInCallbackError
    );
    const authenticationRouterError = useSelector(
        (state: AppState) => state.authenticationRouterError
    );
    const showAuthenticationRouterLogin = useSelector(
        (state: AppState) => state.showAuthenticationRouterLogin
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <AuthenticationRouter
            userManager={props.userManager}
            signInCallbackError={signInCallbackError}
            authenticationRouterError={authenticationRouterError}
            showAuthenticationRouterLogin={showAuthenticationRouterLogin}
            dispatch={dispatch}
            navigate={navigate}
            location={location}
        />
    );
};

/**
 * Manage authentication state.
 * <br/>Sub-component because `useMatch` must be under router context.
 */
const AppAuthStateWithRouterLayer: FunctionComponent<
    PropsWithChildren<{
        userManagerState: [
            AppTopBarProps['userManager'],
            Dispatch<SetStateAction<AppTopBarProps['userManager']>>
        ];
        layout: FunctionComponent<Parameters<typeof App>[0]>;
    }>
> = (props, context) => {
    const AppWrapperRouterLayout = props.layout;
    const [userManager, setUserManager] = props.userManagerState;
    const dispatch = useDispatch();

    // Can't use lazy initializer because useMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useMatch({
            path: '/silent-renew-callback',
        })
    );
    const [initialMatchSignInCallbackUrl] = useState(
        useMatch({
            path: '/sign-in-callback',
        })
    );

    useEffect(() => {
        AppsMetadataSrv.fetchAuthorizationCodeFlowFeatureFlag()
            .then((authorizationCodeFlowEnabled) =>
                initializeAuthenticationProd(
                    dispatch,
                    initialMatchSilentRenewCallbackUrl != null,
                    fetch('idpSettings.json'),
                    UserAdminSrv.fetchValidateUser,
                    authorizationCodeFlowEnabled,
                    initialMatchSignInCallbackUrl != null
                )
            )
            .then((userManager: UserManager | undefined) => {
                setUserManager({ instance: userManager ?? null, error: null });
            })
            .catch((error: any) => {
                setUserManager({ instance: null, error: error.message });
            });
        // Note: initialize and initialMatchSilentRenewCallbackUrl & initialMatchSignInCallbackUrl won't change
    }, [
        dispatch,
        setUserManager,
        initialMatchSilentRenewCallbackUrl,
        initialMatchSignInCallbackUrl,
    ]);

    return (
        <AppWrapperRouterLayout userManager={userManager}>
            {props.children}
        </AppWrapperRouterLayout>
    );
};

/**
 * Manage authentication and assure cohabitation of legacy and new router api
 */
export const AppWithAuthRouter: FunctionComponent<{
    basename: string;
    layout: FunctionComponent<Parameters<typeof App>[0]>;
}> = (props, context) => {
    const [userManager, setUserManager] = useState<
        AppTopBarProps['userManager']
    >({ instance: null, error: null });

    const user = useSelector((state: AppState) => state.user);
    const router: NullableRouter = useMemo((): NullableRouter => {
        if (user === null) {
            return null;
        } else {
            return createBrowserRouter(
                [
                    {
                        element: (
                            <AppAuthStateWithRouterLayer
                                userManagerState={[userManager, setUserManager]}
                                layout={props.layout}
                            >
                                <Outlet />
                            </AppAuthStateWithRouterLayer>
                        ),
                        children: appRoutes(),
                    },
                ],
                { basename: props.basename }
            );
        }
    }, [user, userManager, props.layout, props.basename]);

    return router !== null ? (
        /*new react-router v6 api*/ <RouterProvider router={router} />
    ) : (
        /*legacy component router*/ <BrowserRouter basename={props.basename}>
            <AppAuthStateWithRouterLayer
                userManagerState={[userManager, setUserManager]}
                layout={props.layout}
            >
                <AuthRouter userManager={userManager} />
            </AppAuthStateWithRouterLayer>
        </BrowserRouter>
    );
};
type NullableRouter = Router | null;
