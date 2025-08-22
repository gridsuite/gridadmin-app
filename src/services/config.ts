/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GsLang, GsTheme } from '@gridsuite/commons-ui';
import { PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params';

// https://github.com/gridsuite/config-server/blob/main/src/main/java/org/gridsuite/config/server/dto/ParameterInfos.java
export type ConfigParameter =
    | {
          readonly name: typeof PARAM_LANGUAGE;
          value: GsLang;
      }
    | {
          readonly name: typeof PARAM_THEME;
          value: GsTheme;
      };
export type ConfigParameters = ConfigParameter[];
