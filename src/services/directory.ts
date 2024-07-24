/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UUID } from 'crypto';
import { DirectoryComSvc, ElementAttributes } from '@gridsuite/commons-ui';
import { getUser } from '../redux/store';

export default class DirectorySvc extends DirectoryComSvc {
    public constructor() {
        super(getUser);
    }

    public async fetchPath(elementUuid: UUID) {
        console.debug('Fetching element and its parents info...');
        return this.backendFetchJson<ElementAttributes[]>(
            `${this.getPrefix(1)}/elements/${elementUuid}/path`
        );
    }
}
