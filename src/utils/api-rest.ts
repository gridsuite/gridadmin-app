/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function getRestBase(): string {
    // We use the `baseURI` (from `<base/>` in index.html) to build the URL, which is corrected by httpd/nginx
    return document.baseURI.replace(/\/+$/, '') + import.meta.env.VITE_API_GATEWAY;
}
