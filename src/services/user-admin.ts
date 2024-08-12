/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { UserAdminComSvc } from '@gridsuite/commons-ui';
import { getUser } from '../redux/store';

export type UserInfos = {
    sub: string;
    profileName: string;
    isAdmin: boolean;
};

export type UserProfile = {
    id?: UUID;
    name: string;
    allParametersLinksValid?: boolean;
    loadFlowParameterId?: UUID;
    maxAllowedCases?: number;
    maxAllowedBuilds?: number;
};

export default class UserAdminSvc extends UserAdminComSvc {
    public constructor() {
        super(getUser);
    }
    public async fetchUsers() {
        console.debug('Fetching list of users...');
        return this.backendFetchJson<UserInfos[]>(`${this.getPrefix(1)}/users`);
    }

    public async updateUser(userInfos: UserInfos) {
        console.debug('Updating a user...');
        await this.backendSend(`${this.getPrefix(1)}/users/${userInfos.sub}`, 'PUT', JSON.stringify(userInfos));
    }

    public async deleteUsers(subs: string[]) {
        const jsonSubs = JSON.stringify(subs);
        console.debug(`Deleting sub users "${jsonSubs}"...`);
        await this.backendSend(`${this.getPrefix(1)}/users`, 'DELETE', jsonSubs);
    }

    public async addUser(sub: string) {
        console.debug(`Creating sub user "${sub}"...`);
        await this.backendFetch(`${this.getPrefix(1)}/users/${sub}`, 'POST');
    }

    public async fetchProfiles() {
        console.debug('Fetching list of profiles...');
        return this.backendFetchJson<UserProfile[]>(`${this.getPrefix(1)}/profiles`);
    }

    public async fetchProfilesWithoutValidityCheck() {
        console.debug(`Fetching list of profiles...`);
        return this.backendFetchJson<UserProfile[]>(`${this.getPrefix(1)}/profiles?checkLinksValidity=false`);
    }

    public async getProfile(profileId: UUID) {
        console.debug(`Fetching a profile...`);
        return this.backendFetchJson<UserProfile>(`${this.getPrefix(1)}/profiles/${profileId}`);
    }

    public async modifyProfile(profileData: UserProfile) {
        console.debug(`Updating a profile...`);
        await this.backendSend(`${this.getPrefix(1)}/profiles/${profileData.id}`, 'PUT', JSON.stringify(profileData));
    }

    public async addProfile(profileData: UserProfile) {
        console.debug(`Creating user profile "${profileData.name}"...`);
        await this.backendSend(`${this.getPrefix(1)}/profiles`, 'POST', JSON.stringify(profileData));
    }

    public async deleteProfiles(names: string[]) {
        console.debug(`Deleting profiles "${JSON.stringify(names)}"...`);
        await this.backendSend(`${this.getPrefix(1)}/profiles`, 'DELETE', JSON.stringify(names));
    }
}
