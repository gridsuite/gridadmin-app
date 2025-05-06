/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Chip, Grid } from '@mui/material';
import { mergeSx } from '@gridsuite/commons-ui';

const CHIP_LIMIT_NUMBER: number = 5;

const chipStyles = {
    default: {
        marginTop: '16px',
        marginLeft: '8px',
        maxWidth: '50%',
    },
    withCounter: {
        '&.MuiChip-root': {
            fontWeight: 'bold',
        },
    },
};

export interface MultiChipCellRendererProps {
    value: string[];
}

const MultiChipCellRenderer = (props: MultiChipCellRendererProps) => {
    const values: string[] = props.value || [];

    const customChip = (label: string, index: number, chipsNumber: number) => {
        if (index < CHIP_LIMIT_NUMBER) {
            return <Chip key={label} label={label} size={'small'} sx={chipStyles.default} />;
        } else if (index === CHIP_LIMIT_NUMBER) {
            return (
                <Chip
                    size="small"
                    label={`+${chipsNumber - CHIP_LIMIT_NUMBER}`}
                    key={label}
                    sx={mergeSx(chipStyles.default, chipStyles.withCounter)}
                />
            );
        }
        return undefined;
    };

    return (
        <Grid container direction="row" spacing={1} wrap="nowrap" sx={{ overflow: 'auto hidden' }}>
            {values.map((label: string, index: number) => {
                return customChip(label, index, values.length);
            })}
        </Grid>
    );
};

export default MultiChipCellRenderer;
