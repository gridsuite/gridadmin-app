/*
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum UserQuotaNb {
    CASE = 'userQuotaCaseNb',
    BUILD = 'userQuotaBuildNb',
    LOADFLOW = 'userQuotaLoadflowNb',
    SECURITY = 'userQuotaSecurityNb',
    SENSITIVITY = 'userQuotaSensitivityNb',
    SHORTCIRCUIT = 'userQuotaShortcircuitNb',
    VOLTAGE_INIT = 'userQuotaVoltageInitNb',
    PCC_MIN = 'userQuotaPccminNb',
    STATE_ESTIMATION = 'userQuotaStateEstimationNb',
    BALANCE_ADJUSTEMENT = 'userQuotaBalanceAdjustementNb',
    DYNAMIC_SIMULATION_INIT = 'userQuotaDynamicSimulationInitNb',
    DYNAMIC_SECURITY_INIT = 'userQuotaDynamicSecurityInitNb',
    DYNAMIC_MARGIN_INIT = 'userQuotaDynamicMarginInitNb',
}
