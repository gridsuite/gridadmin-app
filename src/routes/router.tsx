/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    FunctionComponent,
    PropsWithChildren,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import {
    AuthenticationRouter,
    getPreLoginPath,
    initializeAuthenticationProd,
} from '@gridsuite/commons-ui';
import {
    createBrowserRouter,
    Navigate,
    Outlet,
    RouteObject,
    RouterProvider,
    useLocation,
    useMatch,
    useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../redux/reducer';
import { AppsMetadataSrv, UserAdminSrv } from '../services';
import { App } from '../components/App';
import { Profiles, Users } from '../pages';
import ErrorPage from './ErrorPage';
import { updateUserManagerDestructured } from '../redux/actions';
import HomePage from './HomePage';
import { getErrorMessage } from '../utils/error';

export enum MainPaths {
    users = 'users',
    profiles = 'profiles',
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

const AuthRouter: FunctionComponent<{
    userManager: Parameters<typeof AuthenticationRouter>[0]['userManager'];
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
    PropsWithChildren<{ layout: App }>
> = (props, context) => {
    const AppRouterLayout = props.layout;
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
        // need subfunction when async as suggested by rule react-hooks/exhaustive-deps
        (async function initializeAuthentication() {
            try {
                dispatch(
                    updateUserManagerDestructured(
                        (await initializeAuthenticationProd(
                            dispatch,
                            initialMatchSilentRenewCallbackUrl != null,
                            AppsMetadataSrv.fetchIdpSettings,
                            UserAdminSrv.fetchValidateUser,
                            initialMatchSignInCallbackUrl != null
                        )) ?? null,
                        null
                    )
                );
            } catch (error: unknown) {
                dispatch(
                    updateUserManagerDestructured(null, getErrorMessage(error))
                );
            }
        })();
        // Note: initialize and initialMatchSilentRenewCallbackUrl & initialMatchSignInCallbackUrl won't change
    }, [
        dispatch,
        initialMatchSilentRenewCallbackUrl,
        initialMatchSignInCallbackUrl,
    ]);

    return <AppRouterLayout>{props.children}</AppRouterLayout>;
};

/**
 * Manage authentication and assure cohabitation of legacy router and new data router api
 */
export const AppWithAuthRouter: FunctionComponent<{
    basename: string;
    layout: App;
}> = (props, context) => {
    const user = useSelector((state: AppState) => state.user);
    const router = useMemo(
        () =>
            createBrowserRouter(
                user
                    ? [
                          /*new react-router v6 api*/
                          {
                              element: (
                                  <AppAuthStateWithRouterLayer
                                      layout={props.layout}
                                  >
                                      <Outlet />
                                  </AppAuthStateWithRouterLayer>
                              ),
                              children: appRoutes(),
                          },
                      ]
                    : ([
                          /*legacy component router*/
                          {
                              path: '*',
                              Component: () => (
                                  <LegacyAuthRouter layout={props.layout} />
                              ),
                          },
                      ] as RouteObject[]),
                { basename: props.basename }
            ),
        [props.basename, props.layout, user]
    );
    return <RouterProvider router={router} />;
};

const LegacyAuthRouter: FunctionComponent<{ layout: App }> = (props) => {
    const userManager = useSelector((state: AppState) => state.userManager);
    return (
        <AppAuthStateWithRouterLayer layout={props.layout}>
            <AuthRouter userManager={userManager} />
        </AppAuthStateWithRouterLayer>
    );
};
