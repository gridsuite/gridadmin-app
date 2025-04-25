/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useIntl } from 'react-intl';
import { Box, Tooltip } from '@mui/material';

export type DateCellRendererProps = { value: string };

export function DateCellRenderer({ value }: Readonly<DateCellRendererProps>) {
    const intl = useIntl();

    const dateValue = new Date(value);
    if (!Number.isNaN(dateValue.getDate())) {
        const time = new Intl.DateTimeFormat(intl.locale, {
            timeStyle: 'medium',
            hour12: false,
        }).format(dateValue);
        const displayedDate =
            intl.locale === 'en' ? dateValue.toISOString().substring(0, 10) : dateValue.toLocaleDateString(intl.locale);

        const cellText = displayedDate + ' ' + time;

        const fullDate = new Intl.DateTimeFormat(intl.locale, {
            dateStyle: 'long',
            timeStyle: 'long',
            hour12: false,
        }).format(dateValue);

        return (
            <Box>
                <Tooltip title={fullDate} placement="right">
                    <span>{cellText}</span>
                </Tooltip>
            </Box>
        );
    }
}
