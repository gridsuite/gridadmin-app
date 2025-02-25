/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { backendFetchJson, getRestBase } from '../utils/api-rest';
import { UUID } from 'crypto';
import { ElementAttributes } from '@gridsuite/commons-ui';

const EXPLORE_URL = `${getRestBase()}/explore/v1`;

export function fetchPath(elementUuid: UUID): Promise<ElementAttributes[]> {
    console.debug(`Fetching element and its parents info...`);
    return backendFetchJson(`${EXPLORE_URL}/explore/directories/elements/${elementUuid}/path`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'default',
    }).catch((reason) => {
        console.error(`Error while fetching the servers data : ${reason}`);
        throw reason;
    }) as Promise<ElementAttributes[]>;
}
