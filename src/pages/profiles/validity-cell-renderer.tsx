/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Cancel, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { ICellRendererParams } from 'ag-grid-community';
import { Box } from '@mui/material';

export const ValidityCellRenderer = (props: ICellRendererParams) => {
    let icon;

    if (props.value == null) {
        icon = <RadioButtonUnchecked fontSize="small" />;
    } else if (props.value === true) {
        icon = <CheckCircle fontSize="small" color="success" />;
    } else {
        icon = <Cancel fontSize="small" color="error" />;
    }

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {icon}
        </Box>
    );
};

export default ValidityCellRenderer;
