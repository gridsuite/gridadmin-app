/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^.+\\.svg\\?react$': 'jest-svg-transformer',
        '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    // see https://github.com/react-dnd/react-dnd/issues/3443
    transformIgnorePatterns: ['node_modules/(?!react-dnd)/'],
    setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;
