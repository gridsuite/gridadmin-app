/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { backendFetch } from '../utils/api-rest';
import { User } from '../utils/auth';

const USER_ADMIN_URL = `${process.env.REACT_APP_API_GATEWAY}/user-admin`;

export function fetchValidateUser(user: User): Promise<boolean> {
    const sub = user?.profile?.sub;
    if (!sub) {
        return Promise.reject(
            new Error(
                `Error : Fetching access for missing user.profile.sub : ${JSON.stringify(
                    user
                )}`
            )
        );
    }

    console.info(`Fetching access for user...`);
    const CheckAccessUrl = `${USER_ADMIN_URL}/v1/users/${sub}`;
    console.debug(CheckAccessUrl);

    return backendFetch(CheckAccessUrl, { method: 'head' }, user?.id_token)
        .then((response: Response) => {
            //if the response is ok, the responseCode will be either 200 or 204 otherwise it's an HTTP error and it will be caught
            return response.status === 200;
        })
        .catch((error) => {
            if (error.status === 403) {
                return false;
            } else {
                throw error;
            }
        });
}
