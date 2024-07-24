/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ConfigComSvc } from '@gridsuite/commons-ui';
import { APP_NAME } from '../utils/config-params';
import { getUser } from '../redux/store';

export default class ConfigSvc extends ConfigComSvc<typeof APP_NAME> {
    public constructor() {
        super(APP_NAME, getUser);
    }
}
