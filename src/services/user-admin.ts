/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { User } from 'oidc-client';
import { backendFetch, backendFetchJson, getRestBase } from '../utils/api-rest';
import { extractUserSub, getToken, getUser } from '../utils/api';
import { UUID } from 'crypto';

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
            return backendFetch(`${USER_ADMIN_URL}/users/${sub}`, { method: 'head' }, getToken(user) ?? undefined);
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
    profileName: string;
    isAdmin: boolean;
    groups: GroupInfos[];
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

export type UpdateUserInfos = {
    sub: string;
    profileName?: string;
    isAdmin?: boolean;
    groups: string[];
};

export function udpateUser(userInfos: UpdateUserInfos) {
    console.debug(`Updating a user...`);

    return backendFetch(`${USER_ADMIN_URL}/users/${userInfos.sub}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfos),
    })
        .then(() => undefined)
        .catch((reason) => {
            console.error(`Error while updating user : ${reason}`);
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
        .then(() => undefined)
        .catch((reason) => {
            console.error(`Error while deleting the servers data : ${reason}`);
            throw reason;
        });
}

export function addUser(sub: string): Promise<void> {
    console.debug(`Creating sub user "${sub}"...`);
    return backendFetch(`${USER_ADMIN_URL}/users/${sub}`, { method: 'post' })
        .then(() => undefined)
        .catch((reason) => {
            console.error(`Error while adding user : ${reason}`);
            throw reason;
        });
}

export type UserProfile = {
    id?: UUID;
    name: string;
    allLinksValid?: boolean;
    loadFlowParameterId?: UUID;
    securityAnalysisParameterId?: UUID;
    sensitivityAnalysisParameterId?: UUID;
    shortcircuitParameterId?: UUID;
    voltageInitParameterId?: UUID;
    maxAllowedCases?: number;
    maxAllowedBuilds?: number;
    spreadsheetConfigCollectionId?: UUID;
    networkVisualizationParameterId?: UUID;
};

export function fetchProfiles(): Promise<UserProfile[]> {
    console.debug(`Fetching list of profiles...`);
    return backendFetchJson(`${USER_ADMIN_URL}/profiles`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'default',
    }).catch((reason) => {
        console.error(`Error while fetching list of profiles : ${reason}`);
        throw reason;
    }) as Promise<UserProfile[]>;
}

export function fetchProfilesWithoutValidityCheck(): Promise<UserProfile[]> {
    console.debug(`Fetching list of profiles...`);
    return backendFetchJson(`${USER_ADMIN_URL}/profiles?checkLinksValidity=false`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'default',
    }).catch((reason) => {
        console.error(`Error while fetching list of profiles (without check) : ${reason}`);
        throw reason;
    }) as Promise<UserProfile[]>;
}

export function getProfile(profileId: UUID): Promise<UserProfile> {
    console.debug(`Fetching a profile...`);
    return backendFetchJson(`${USER_ADMIN_URL}/profiles/${profileId}`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'default',
    }).catch((reason) => {
        console.error(`Error while fetching profile : ${reason}`);
        throw reason;
    }) as Promise<UserProfile>;
}

export function modifyProfile(profileData: UserProfile) {
    console.debug(`Updating a profile...`);

    return backendFetch(`${USER_ADMIN_URL}/profiles/${profileData.id}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    })
        .then(() => undefined)
        .catch((reason) => {
            console.error(`Error while updating the data : ${reason}`);
            throw reason;
        });
}

export function addProfile(profileData: UserProfile): Promise<void> {
    console.debug(`Creating user profile "${profileData.name}"...`);
    return backendFetch(`${USER_ADMIN_URL}/profiles`, {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    })
        .then(() => undefined)
        .catch((reason) => {
            console.error(`Error while pushing adding profile : ${reason}`);
            throw reason;
        });
}

export function deleteProfiles(names: string[]): Promise<void> {
    console.debug(`Deleting profiles "${JSON.stringify(names)}"...`);
    return backendFetch(`${USER_ADMIN_URL}/profiles`, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(names),
    })
        .then(() => undefined)
        .catch((reason) => {
            console.error(`Error while deleting profiles : ${reason}`);
            throw reason;
        });
}

export type GroupInfos = {
    id?: UUID;
    name: string;
    users: UserInfos[];
};

export function fetchGroups(): Promise<GroupInfos[]> {
    console.debug(`Fetching list of groups...`);
    return backendFetchJson(`${USER_ADMIN_URL}/groups`, {
        headers: {
            Accept: 'application/json',
            //'Content-Type': 'application/json; utf-8',
        },
        cache: 'default',
    }).catch((reason) => {
        console.error(`Error while fetching the servers data : ${reason}`);
        throw reason;
    }) as Promise<GroupInfos[]>;
}

export type UpdateGroupInfos = {
    id: UUID;
    name: string;
    users: string[];
};

export function udpateGroup(groupInfos: UpdateGroupInfos) {
    console.debug(`Updating a group...`);

    return backendFetch(`${USER_ADMIN_URL}/groups/${groupInfos.id}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupInfos),
    })
        .then(() => undefined)
        .catch((reason) => {
            console.error(`Error while updating group : ${reason}`);
            throw reason;
        });
}

export function deleteGroups(groups: string[]): Promise<void> {
    console.debug(`Deleting groups "${JSON.stringify(groups)}"...`);
    return backendFetch(`${USER_ADMIN_URL}/groups`, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(groups),
    })
        .then(() => undefined)
        .catch((reason) => {
            console.error(`Error while deleting the servers data : ${reason}`);
            throw reason;
        });
}

export function addGroup(group: string): Promise<void> {
    console.debug(`Creating group "${group}"...`);
    return backendFetch(`${USER_ADMIN_URL}/groups/${group}`, { method: 'post' })
        .then(() => undefined)
        .catch((reason) => {
            console.error(`Error while adding group : ${reason}`);
            throw reason;
        });
}
