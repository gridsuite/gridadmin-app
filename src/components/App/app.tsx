/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, PropsWithChildren, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { CardErrorBoundary, useNotificationsListener, useSnackMessage } from '@gridsuite/commons-ui';
import { selectComputedLanguage, selectLanguage, selectTheme } from '../../redux/actions';
import { AppState } from '../../redux/reducer';
import { ConfigParameters, ConfigSrv } from '../../services';
import { APP_NAME, COMMON_APP_NAME, PARAM_LANGUAGE, PARAM_THEME } from '../../utils/config-params';
import { getComputedLanguage } from '../../utils/language';
import AppTopBar from './app-top-bar';
import { useDebugRender } from '../../utils/hooks';
import { AppDispatch } from '../../redux/store';
import { NOTIFICATIONS_URL_KEYS } from '../../utils/notifications-provider';

const App: FunctionComponent<PropsWithChildren<{}>> = (props, context) => {
    useDebugRender('app');
    const { snackError } = useSnackMessage();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: AppState) => state.user);

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
                ConfigSrv.fetchConfigParameter(eventData.headers.parameterName)
                    .then((param) => updateParams([param]))
                    .catch((error) => snackError({ messageTxt: error.message, headerId: 'paramsRetrievingError' }));
            }
        },
        [updateParams, snackError]
    );

    useNotificationsListener(NOTIFICATIONS_URL_KEYS.CONFIG, { listenerCallbackMessage: updateConfig });

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
        }
    }, [user, dispatch, updateParams, snackError]);

    return (
        <Grid
            container
            direction="column"
            spacing={0}
            justifyContent="flex-start"
            alignItems="stretch"
            sx={{ height: '100vh', width: '100vw' }}
        >
            <Grid item xs="auto" component={AppTopBar} />
            <Grid item container xs component="main">
                <CardErrorBoundary>{/*Router outlet ->*/ props.children}</CardErrorBoundary>
            </Grid>
        </Grid>
    );
};
export default App;
