/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Box, IconButton } from '@mui/material';
import { DisabledByDefault } from '@mui/icons-material';
import { UUID } from 'crypto';

export type CancelButtonCellRendererProps = { value: UUID; onClickHandler: Function };

export function CancelButtonCellRenderer({ value, onClickHandler }: Readonly<CancelButtonCellRendererProps>) {
    return (
        <Box>
            <IconButton
                sx={{ color: 'red' }}
                disableRipple
                onClick={() => {
                    onClickHandler(value);
                }}
            >
                <DisabledByDefault fontSize="medium" />
            </IconButton>
        </Box>
    );
}
