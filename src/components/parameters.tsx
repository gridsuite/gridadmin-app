/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConfigSrv } from '../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { AppState, AppStateKey } from '../redux/reducer';

export function useParameterState<K extends AppStateKey>(paramName: K): [AppState[K], (value: AppState[K]) => void] {
    const { snackError } = useSnackMessage();
    const paramGlobalState = useSelector((state: AppState) => state[paramName]);
    const [paramLocalState, setParamLocalState] = useState(paramGlobalState);

    useEffect(() => {
        setParamLocalState(paramGlobalState);
    }, [paramGlobalState]);

    const handleChangeParamLocalState = useCallback(
        (value: AppState[K]) => {
            setParamLocalState(value);
            ConfigSrv.updateConfigParameter(paramName, value as string) //TODO how to check/cast?
                .catch((error) => {
                    setParamLocalState(paramGlobalState);
                    snackError({
                        messageTxt: error.message,
                        headerId: 'paramsChangingError',
                    });
                });
        },
        [paramName, snackError, setParamLocalState, paramGlobalState]
    );

    return [paramLocalState, handleChangeParamLocalState];
}
