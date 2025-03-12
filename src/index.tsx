/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'core-js/es/array/flat-map';
import 'typeface-roboto';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { polyfillIntl } from '@gridsuite/commons-ui';
import './index.css';
import { AppWrapper } from './components/App';

const container = document.getElementById('root');
if (container) {
    polyfillIntl(['en', 'en-GB', 'fr'], import.meta.env.VITE_DEFAULT_TIMEZONE).finally(() => {
        const root = createRoot(container);
        root.render(<AppWrapper />);
    });
} else {
    document.write("<b>Can't start the application...</b>");
    throw new Error('No root container found');
}
