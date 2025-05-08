/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'crypto';
import { useCallback } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

export type CancelButtonCellRendererProps = { value: UUID; onClickHandler: Function };

export default function CancelCellRenderer({ value, onClickHandler }: Readonly<CancelButtonCellRendererProps>) {
    return (
        <Tooltip title={<FormattedMessage id="announcements.table.cancel" />}>
            <IconButton
                disableRipple
                color="secondary"
                onClick={useCallback(() => {
                    onClickHandler(value);
                }, [onClickHandler, value])}
            >
                <Delete fontSize="medium" />
            </IconButton>
        </Tooltip>
    );
}
