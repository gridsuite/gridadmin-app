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
import './index.css';
import './configure-yup-init';
import AppWrapper from './components/App/AppWrapper';
import SilentRenewApp from '../silent-renew-app';

const container = document.getElementById('root');
const root = createRoot(container!);

if (window.location.pathname.endsWith('/silent-renew-callback')) {
    root.render(<SilentRenewApp />);
} else {
    root.render(<AppWrapper />);
}
