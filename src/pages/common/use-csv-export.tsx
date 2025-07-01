/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useMemo, RefObject } from 'react';
import { CsvExport, GsLang } from '@gridsuite/commons-ui';
import { IntlShape } from 'react-intl';
import { GridTableRef } from '../../components/Grid';
import { ColDef } from 'ag-grid-community';

export function useCsvExport<TData>({
    gridRef,
    columns,
    tableNameId,
    intl,
    language,
}: {
    gridRef: RefObject<GridTableRef<TData>>;
    columns: ColDef[];
    tableNameId: string;
    intl: IntlShape;
    language: GsLang;
}) {
    return useMemo(
        () => (
            <CsvExport
                columns={columns}
                tableName={intl.formatMessage({ id: tableNameId })}
                disabled={false}
                skipColumnHeaders={false}
                language={language}
                exportDataAsCsv={(params) => gridRef?.current?.aggrid?.api?.exportDataAsCsv(params)}
            />
        ),
        [gridRef, columns, intl, language, tableNameId]
    );
}
