/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    FunctionComponent,
    PropsWithChildren,
    useCallback,
    useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardErrorBoundary, useSnackMessage } from '@gridsuite/commons-ui';
import {
    selectComputedLanguage,
    selectLanguage,
    selectTheme,
} from '../redux/actions';
import { AppState } from '../redux/reducer';
import { ConfigParameter, ConfigParameters, ConfigSrv } from '../services';
import { connectNotificationsWsUpdateConfig } from '../utils/rest-api';
import {
    APP_NAME,
    COMMON_APP_NAME,
    PARAM_LANGUAGE,
    PARAM_THEME,
} from '../utils/config-params';
import { getComputedLanguage } from '../utils/language';
import AppTopBar, { AppTopBarProps } from './app-top-bar';
import ReconnectingWebSocket from 'reconnecting-websocket';

const App: FunctionComponent<
    PropsWithChildren<{ userManager: AppTopBarProps['userManager'] }>
> = (props, context) => {
    const { snackError } = useSnackMessage();
    const dispatch = useDispatch();
    const user = useSelector((state: AppState) => state.user);

    const updateParams: (p: ConfigParameters) => void = useCallback(
        (params: ConfigParameters) => {
            console.debug('received UI parameters : ', params);
            params.forEach((param: ConfigParameter) => {
                switch (param.name) {
                    case PARAM_THEME:
                        dispatch(selectTheme(param.value));
                        break;
                    case PARAM_LANGUAGE:
                        dispatch(selectLanguage(param.value));
                        dispatch(
                            selectComputedLanguage(
                                getComputedLanguage(param.value)
                            )
                        );
                        break;
                    default:
                }
            });
        },
        [dispatch]
    );

    const connectNotificationsUpdateConfig: () => ReconnectingWebSocket =
        useCallback(() => {
            const ws = connectNotificationsWsUpdateConfig();
            ws.onmessage = function (event) {
                let eventData = JSON.parse(event.data);
                if (eventData?.headers?.parameterName) {
                    ConfigSrv.fetchConfigParameter(
                        eventData.headers.parameterName
                    )
                        .then((param) => updateParams([param]))
                        .catch((error) =>
                            snackError({
                                messageTxt: error.message,
                                headerId: 'paramsRetrievingError',
                            })
                        );
                }
            };
            ws.onerror = function (event) {
                console.error('Unexpected Notification WebSocket error', event);
            };
            return ws;
        }, [updateParams, snackError]);

    useEffect(() => {
        if (user !== null) {
            ConfigSrv.fetchConfigParameters(COMMON_APP_NAME)
                .then((params) => updateParams(params))
                .catch((error) =>
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsRetrievingError',
                    })
                );

            ConfigSrv.fetchConfigParameters(APP_NAME)
                .then((params) => updateParams(params))
                .catch((error) =>
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsRetrievingError',
                    })
                );

            const ws = connectNotificationsUpdateConfig();
            return () => ws.close();
        }
    }, [
        user,
        dispatch,
        updateParams,
        snackError,
        connectNotificationsUpdateConfig,
    ]);

    return (
        <>
            <AppTopBar user={user} userManager={props.userManager} />
            <CardErrorBoundary>
                {/*Router outlet ->*/ props.children}
            </CardErrorBoundary>
        </>
    );
};
export default App;
