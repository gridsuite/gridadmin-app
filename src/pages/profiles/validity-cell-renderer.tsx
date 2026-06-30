/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Cancel, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { ICellRendererParams } from 'ag-grid-community';

export const ValidityCellRenderer = (props: ICellRendererParams) => {
    if (props.value == null) {
        return <RadioButtonUnchecked fontSize="small" />;
    }
    if (props.value === true) {
        return <CheckCircle fontSize="small" color="success" />;
    }

    return <Cancel fontSize="small" color="error" />;
};

export default ValidityCellRenderer;
