/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { User } from 'oidc-client';
import { AppState } from '../redux/reducer';
import { store } from '../redux/store';

export type Token = string;

export function getToken(user?: User): Token | null {
    return (user ?? getUser())?.id_token ?? null;
}

export function getUser(): User | null {
    const state: AppState = store.getState();
    return state.user;
}

export function extractUserSub(user: User | null): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const sub = user?.profile?.sub;
        if (!sub) {
            reject(new Error(`Fetching access for missing user.profile.sub : ${JSON.stringify(user)}`));
        } else {
            resolve(sub);
        }
    });
}

export function parseError(text: string) {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}
