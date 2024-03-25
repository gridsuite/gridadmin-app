/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { backendFetchJson, getRestBase } from '../utils/api-rest';
import { UUID } from 'crypto';
import { ElementType } from '../components/parameter-selection';

const EXPLORE_URL = `${getRestBase()}/explore/v1`;

export type ElementAttributes = {
    elementUuid: UUID;
    elementName: string;
    type: string;
};

export function fetchElementsInfos(
    ids: UUID[],
    elementTypes: ElementType[]
): Promise<ElementAttributes[]> {
    console.info('Fetching elements metadata...');
    const tmp = ids?.filter((id) => id);
    const idsParams = tmp?.length ? tmp.map((id) => ['ids', id]) : [];
    const elementTypesParams = elementTypes?.length
        ? elementTypes.map((type) => ['elementTypes', type])
        : [];
    const params = [...idsParams, ...elementTypesParams];
    const urlSearchParams = new URLSearchParams(params).toString();
    return backendFetchJson(
        `${EXPLORE_URL}/explore/elements/metadata?${urlSearchParams}`,
        {
            headers: {
                Accept: 'application/json',
            },
            cache: 'default',
        }
    ).catch((reason) => {
        console.error(`Error while fetching the servers data : ${reason}`);
        throw reason;
    }) as Promise<ElementAttributes[]>;
}
