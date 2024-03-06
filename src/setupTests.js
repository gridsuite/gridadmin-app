/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

global.IS_REACT_ACT_ENVIRONMENT = true;

// jest.config.js
module.exports = {
    transform: {
        '^.+\\.(ts|tsx|js|jsx|mjs|cjs)$': [
            'babel-jest', // or "ts-test" or whichever transformer you're using
        ],
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(@ag-grid-community|@ag-grid-enterprise)/)',
    ],
};

// see https://www.ag-grid.com/react-data-grid/testing/
