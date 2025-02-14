/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Chip, Grid } from '@mui/material';

export interface MultiChipCellRendererProps {
    value: string[];
}

const MultiChipsRendererComponent = (props: MultiChipCellRendererProps) => {
    const values: string[] = props.value || [];

    return (
        <Grid container direction="row" spacing={1}>
            {values.map((val: string) => (
                <Chip key={val} label={val} sx={{ marginTop: '12px', marginRight: '5px' }} />
            ))}
        </Grid>
    );
};

export default MultiChipsRendererComponent;
