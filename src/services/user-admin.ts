/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { backendFetch, backendFetchJson, getRestBase } from '../utils/api-rest';
import { extractUserSub, getToken, getUser } from '../utils/api';
import { User } from '../utils/auth';

const USER_ADMIN_URL = `${getRestBase()}/user-admin/v1`;

export function getUserSub(): Promise<unknown> {
    return extractUserSub(getUser());
}

/*
 * fetchValidateUser is call from commons-ui AuthServices to validate user infos before setting state.user!
 */
export function fetchValidateUser(user: User): Promise<boolean> {
    return extractUserSub(user)
        .then((sub) => {
            console.debug(`Fetching access for user "${sub}"...`);
            return backendFetch(
                `${USER_ADMIN_URL}/users/${sub}`,
                { method: 'head' },
                getToken(user) ?? undefined
            );
        })
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

export type UserInfos = {
    sub: string;
    isAdmin: boolean;
};

export function fetchUsers(): Promise<UserInfos[]> {
    console.debug(`Fetching list of users...`);
    return backendFetchJson(`${USER_ADMIN_URL}/users`, {
        headers: {
            Accept: 'application/json',
            //'Content-Type': 'application/json; utf-8',
        },
        cache: 'default',
    }).catch((reason) => {
        console.error(`Error while fetching the servers data : ${reason}`);
        throw reason;
    }) as Promise<UserInfos[]>;
}

export function deleteUser(sub: string): Promise<void> {
    console.debug(`Deleting sub user "${sub}"...`);
    return backendFetch(`${USER_ADMIN_URL}/users/${sub}`, { method: 'delete' })
        .then((response: Response) => undefined)
        .catch((reason) => {
            console.error(`Error while deleting the servers data : ${reason}`);
            throw reason;
        });
}

export function deleteUsers(subs: string[]): Promise<void> {
    console.debug(`Deleting sub users "${JSON.stringify(subs)}"...`);
    return backendFetch(`${USER_ADMIN_URL}/users`, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subs),
    })
        .then((response: Response) => undefined)
        .catch((reason) => {
            console.error(`Error while deleting the servers data : ${reason}`);
            throw reason;
        });
}

export function addUser(sub: string): Promise<void> {
    console.debug(`Creating sub user "${sub}"...`);
    return backendFetch(`${USER_ADMIN_URL}/users/${sub}`, { method: 'post' })
        .then((response: Response) => undefined)
        .catch((reason) => {
            console.error(`Error while pushing the data : ${reason}`);
            throw reason;
        });
}
