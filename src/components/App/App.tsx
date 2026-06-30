/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid2 as Grid } from '@mui/material';
import {
    AnnouncementNotification,
    AuthenticationRouter,
    CardErrorBoundary,
    fetchConfigParameter,
    fetchConfigParameters,
    getComputedLanguage,
    getPreLoginPath,
    initializeAuthenticationProd,
    NotificationsUrlKeys,
    PARAM_LANGUAGE,
    PARAM_THEME,
    snackWithFallback,
    useNotificationsListener,
    UserManagerState,
    useSnackMessage,
} from '@gridsuite/commons-ui';
import { selectComputedLanguage, selectLanguage, selectTheme } from '../../redux/actions';
import { AppState } from '../../redux/reducer';
import { AppsMetadataSrv, ConfigParameters } from '../../services';
import { APP_NAME, COMMON_APP_NAME } from '../../utils/config-params';
import AppTopBar from './AppTopBar';
import { useDebugRender } from '../../utils/hooks';
import { AppDispatch } from '../../redux/store';
import { Navigate, Route, Routes, useLocation, useMatch, useNavigate } from 'react-router';
import PageNotFound from './PageNotFound';
import { FormattedMessage } from 'react-intl';
import { MainPaths } from './utils';
import { Announcements, Groups, Profiles, Users } from '../../pages';
import HomePage from './HomePage';

export default function App() {
    useDebugRender('app');
    const { snackError } = useSnackMessage();
    const dispatch = useDispatch<AppDispatch>();
    const userProfile = useSelector(
        (state: AppState) => state.user?.profile ?? null,
        (a, b) =>
            a === b || (a?.sub === b?.sub && a?.name === b?.name && a?.email === b?.email && a?.profile === b?.profile)
    );
    const updateParams = useCallback(
        (params: ConfigParameters) => {
            console.groupCollapsed('received UI parameters');
            console.table(params);
            console.groupEnd();
            params.forEach((param) => {
                switch (param.name) {
                    case PARAM_THEME:
                        dispatch(selectTheme(param.value));
                        break;
                    case PARAM_LANGUAGE:
                        dispatch(selectLanguage(param.value));
                        dispatch(selectComputedLanguage(getComputedLanguage(param.value)));
                        break;
                    default:
                        break;
                }
            });
        },
        [dispatch]
    );

    const updateConfig = useCallback(
        (event: MessageEvent) => {
            const eventData = JSON.parse(event.data);
            if (eventData?.headers?.parameterName) {
                fetchConfigParameter(APP_NAME, eventData.headers.parameterName)
                    .then((param) => updateParams([param]))
                    .catch((error) => snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' }));
            }
        },
        [updateParams, snackError]
    );

    useNotificationsListener(NotificationsUrlKeys.CONFIG, { listenerCallbackMessage: updateConfig });

    useEffect(() => {
        if (userProfile !== null) {
            fetchConfigParameters(COMMON_APP_NAME)
                .then((params) => updateParams(params))
                .catch((error) => snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' }));

            fetchConfigParameters(APP_NAME)
                .then((params) => updateParams(params))
                .catch((error) => snackWithFallback(snackError, error, { headerId: 'paramsRetrievingError' }));
        }
    }, [userProfile, dispatch, updateParams, snackError]);

    const signInCallbackError = useSelector((state: AppState) => state.signInCallbackError);
    const authenticationRouterError = useSelector((state: AppState) => state.authenticationRouterError);
    const showAuthenticationRouterLogin = useSelector((state: AppState) => state.showAuthenticationRouterLogin);
    const [userManager, setUserManager] = useState<UserManagerState>({
        instance: null,
        error: null,
    });
    const navigate = useNavigate();
    const location = useLocation();

    // Can't use lazy initializer because useRouteMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useMatch({
            path: '/silent-renew-callback',
        })
    );

    const [initialMatchSigninCallbackUrl] = useState(
        useMatch({
            path: '/sign-in-callback',
        })
    );

    useEffect(() => {
        // need subfunction when async as suggested by rule react-hooks/exhaustive-deps
        (async function initializeAuthentication() {
            try {
                setUserManager({
                    instance: await initializeAuthenticationProd(
                        dispatch,
                        initialMatchSilentRenewCallbackUrl != null,
                        AppsMetadataSrv.fetchIdpSettings,
                        initialMatchSigninCallbackUrl != null
                    ),
                    error: null,
                });
            } catch (error: any) {
                setUserManager({ instance: null, error: error.message });
            }
        })();
        // Note: initialMatchSilentRenewCallbackUrl and dispatch don't change
    }, [initialMatchSilentRenewCallbackUrl, dispatch, initialMatchSigninCallbackUrl]);

    return (
        <Grid
            container
            direction="column"
            spacing={0}
            justifyContent="flex-start"
            alignItems="stretch"
            sx={{ height: '100vh', width: '100vw' }}
        >
            <Grid size="auto">
                <AppTopBar userManagerInstance={userManager.instance} />
            </Grid>
            <Grid size="auto">
                <AnnouncementNotification userProfile={userProfile} />
            </Grid>
            <Grid component="main" container sx={{ flexGrow: 1, height: '100%', width: '100%' }}>
                <CardErrorBoundary>
                    <div
                        className="singlestretch-parent"
                        style={{
                            flexGrow: 1,
                        }}
                    >
                        {userProfile !== null ? (
                            <Routes>
                                <Route path={'/'} element={<HomePage />} />
                                <Route path={`/${MainPaths.users}`} element={<Users />} />
                                <Route path={`/${MainPaths.profiles}`} element={<Profiles />} />
                                <Route path={`/${MainPaths.groups}`} element={<Groups />} />
                                <Route path={`/${MainPaths.announcements}`} element={<Announcements />} />
                                <Route
                                    path="/sign-in-callback"
                                    element={<Navigate replace to={getPreLoginPath() || '/'} />}
                                />
                                <Route
                                    path="/logout-callback"
                                    element={<h1>Error: logout failed; you are still logged in.</h1>}
                                />
                                <Route
                                    path="*"
                                    element={<PageNotFound message={<FormattedMessage id="PageNotFound" />} />}
                                />
                            </Routes>
                        ) : (
                            <AuthenticationRouter
                                userManager={userManager}
                                signInCallbackError={signInCallbackError}
                                authenticationRouterError={authenticationRouterError}
                                showAuthenticationRouterLogin={showAuthenticationRouterLogin}
                                dispatch={dispatch}
                                navigate={navigate}
                                location={location}
                            />
                        )}
                    </div>
                </CardErrorBoundary>
            </Grid>
        </Grid>
    );
}
