/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ColDef, RowSelectionOptions } from 'ag-grid-community';

export const defaultColDef: ColDef = {
    editable: false,
    resizable: true,
    minWidth: 50,
    cellRenderer: 'agAnimateSlideCellRenderer',
    rowDrag: false,
    sortable: true,
};

export const defaultRowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    enableClickSelection: false,
    checkboxes: true,
    headerCheckbox: true,
    hideDisabledCheckboxes: false,
};
