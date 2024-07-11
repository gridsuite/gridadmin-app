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
    // transform from ESM
    transformIgnorePatterns: [
        // if need to test with AG Grid, see https://www.ag-grid.com/react-data-grid/testing/
        '/node_modules/(?!@gridsuite/commons-ui)',
        // also a problem with rect-dnd: https://github.com/react-dnd/react-dnd/issues/3443
        '/node_modules/(?!react-dnd|@react-dnd|dnd-core|core-dnd|react-dnd-html5-backend)',
    ],
    moduleDirectories: ['node_modules', 'src'], // to allow absolute path from ./src
    setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;
