/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { backendFetchJson } from '../utils/rest-api';

const API_URL =
    '/api/' +
    (process.env.REACT_APP_USE_AUTHENTICATION === 'true'
        ? process.env.REACT_APP_API_GATEWAY + '/study/v1'
        : process.env.REACT_APP_SRV_STUDY_URI + '/v1');

export function getServersInfos(token) {
    return backendFetchJson(
        `${API_URL}/servers/about`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
        },
        token
    ).catch((reason) => {
        console.error('Error while fetching the servers infos : ' + reason);
        return reason;
    });
}
