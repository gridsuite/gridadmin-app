/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import react from '@vitejs/plugin-react';
import { CommonServerOptions, defineConfig } from 'vite';
// @ts-expect-error See https://github.com/gxmari007/vite-plugin-eslint/issues/79
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

const serverSettings: CommonServerOptions = {
    port: 3002,
    proxy: {
        '/api/gateway': {
            target: 'http://localhost:9000',
            rewrite: (path: string) => path.replace(/^\/api\/gateway/, ''),
        },
        '/ws/gateway': {
            target: 'http://localhost:9000',
            rewrite: (path: string) => path.replace(/^\/ws\/gateway/, ''),
            ws: true,
        },
    },
};

export default defineConfig((config) => ({
    plugins: [
        react(),
        eslint({
            failOnWarning: config.mode !== 'development',
            lintOnStart: false,
        }),
        svgr(), // works on every import with the pattern "**/*.svg?react"
        tsconfigPaths(), // to resolve absolute path via tsconfig cf https://stackoverflow.com/a/68250175/5092999
    ],
    base: './',
    server: serverSettings, // for npm run start
    preview: serverSettings, // for npm run serve (use local build)
    build: {
        outDir: 'build',
    },
    resolve: {
        alias: {
            /* "@mui/x-date-pickers/AdapterDateFns/AdapterDateFns" do an import from 'date-fns/_lib/format/longFormatters'
             * which cause rollup error '[commonjs--resolver] Missing "./_lib/format/longFormatters" specifier in "date-fns" package'.
             *   - we fix the no default import with a shim that will fix that
             *   - we do a second alias to resolve the import to a non-exported file to date-fns/_lib/...
             */
            'date-fns/_lib/format/longFormatters': path.resolve(import.meta.dirname, 'vite.shim.x-date-pickers.js'),
            'virtual:date-fns/_lib/format/longFormatters': path.resolve(
                import.meta.dirname,
                'node_modules/date-fns/_lib/format/longFormatters'
            ),
        },
    },
}));
