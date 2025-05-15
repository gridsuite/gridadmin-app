/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import type { UUID } from 'crypto';
import { useCallback } from 'react';
import { IconButton, type IconButtonProps, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

export type CancelButtonCellRendererProps = { value: UUID; onClickHandler: (value: UUID) => void };

export default function CancelCellRenderer({ value, onClickHandler }: Readonly<CancelButtonCellRendererProps>) {
    const handleClick = useCallback<NonNullable<IconButtonProps['onClick']>>(() => {
        onClickHandler(value);
    }, [onClickHandler, value]);
    return (
        <Tooltip title={<FormattedMessage id="announcements.table.cancel" />}>
            <IconButton disableRipple color="secondary" onClick={handleClick}>
                <Delete fontSize="medium" />
            </IconButton>
        </Tooltip>
    );
}
