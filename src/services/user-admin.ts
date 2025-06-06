/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { backendFetch, backendFetchJson, getRestBase } from '../utils/api-rest';
import { UUID } from 'crypto';

const USER_ADMIN_URL = `${getRestBase()}/user-admin/v1`;

export type UserInfosUpdate = {
    sub: string;
    profileName?: string;
    groups?: string[];
};
export type UserInfos = UserInfosUpdate & {
    maxAllowedCases?: number;
    numberCasesUsed?: number;
    maxAllowedBuilds?: number;
};

export function fetchUsers(): Promise<UserInfos[]> {
    console.debug(`Fetching list of users...`);
    return backendFetchJson<UserInfos[]>(`${USER_ADMIN_URL}/users`, {
        headers: {
            Accept: 'application/json',
            //'Content-Type': 'application/json; utf-8',
        },
        cache: 'default',
    }).catch((reason) => {
        console.error(`Error while fetching the servers data : ${reason}`);
        throw reason;
    });
}

export function updateUser(userInfos: UserInfosUpdate) {
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
    id: UUID;
    name: string;
    users: string[];
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

export function udpateGroup(groupInfos: GroupInfos) {
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

export enum AnnouncementSeverity {
    INFO = 'INFO',
    WARN = 'WARN',
}

export function sanitizeString(val: string | null | undefined) {
    const trimmedValue = val?.trim();
    return trimmedValue === '' ? null : trimmedValue;
}

export type NewAnnouncement = {
    startDate: string;
    endDate: string;
    message: string;
    severity: AnnouncementSeverity;
};
export type Announcement = NewAnnouncement & {
    id: UUID;
};

export async function addAnnouncement(announcement: NewAnnouncement) {
    console.debug(`Creating announcement ...`);
    return backendFetchJson<Announcement>(
        `${USER_ADMIN_URL}/announcements?startDate=${announcement.startDate}&endDate=${announcement.endDate}&severity=${announcement.severity}`,
        {
            method: 'put',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'text/plain',
            },
            body: sanitizeString(announcement.message),
        }
    ).catch((reason) => {
        console.error('Error while creating announcement:', reason);
        throw reason;
    });
}

export async function fetchAnnouncementList() {
    console.debug(`Fetching announcement ...`);
    try {
        return await backendFetchJson<Announcement[]>(`${USER_ADMIN_URL}/announcements`, { method: 'get' });
    } catch (reason) {
        console.error('Error while fetching announcement:', reason);
        throw reason;
    }
}

export async function deleteAnnouncement(announcementId: UUID): Promise<void> {
    console.debug(`Deleting announcement ${announcementId}...`);
    await backendFetch(`${USER_ADMIN_URL}/announcements/${announcementId}`, { method: 'delete' }).catch((reason) => {
        console.error('Error while deleting announcement:', reason);
        throw reason;
    });
}
