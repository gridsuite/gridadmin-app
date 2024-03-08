/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AppState } from '../redux/reducer';
import { store } from '../redux/store';

export type Token = string;

export function getToken(): Token | null {
    const state: AppState = store.getState();
    return state.user?.id_token ?? null;
}

export function parseError(text: string) {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}
