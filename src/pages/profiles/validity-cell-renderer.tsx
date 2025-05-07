/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Grid } from '@mui/material';
import { Cancel, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { ICellRendererParams } from 'ag-grid-community';

export const ValidityCellRenderer = (props: ICellRendererParams) => {
    return (
        <Grid container>
            {props.value == null && <RadioButtonUnchecked fontSize="small" />}
            {props.value === true && <CheckCircle fontSize="small" color="success" />}
            {props.value === false && <Cancel fontSize="small" color="error" />}
        </Grid>
    );
};

export default ValidityCellRenderer;
