/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import {
    ColTypeDef,
    ValueFormatterFunc,
    ValueFormatterParams,
} from 'ag-grid-community/dist/lib/entities/colDef';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { Chip, ChipProps } from '@mui/material';
import { Check, Close, QuestionMark } from '@mui/icons-material';
import { ICellRendererFunc, IDateFilterParams } from 'ag-grid-community';

export enum GridColumnTypes {
    // default of ag-grid
    // ...
    // custom components
    Timestamp = 'timestamp',
    BoolIcons = 'boolIcons',
}

function timestampFormatter(
    intl: IntlShape,
    params: ValueFormatterParams<any, string | number | Date | null | undefined>
): string {
    if (params.value !== null && params.value !== undefined) {
        let val = params.value;
        if (!(val instanceof Date)) {
            val = new Date(val);
        }
        return intl.formatDate(val);
    } else {
        return '∅';
    }
}

const BoolValue: FunctionComponent<{
    value: boolean | null | undefined;
}> = (props, context) => {
    const conf = ((value: unknown): Partial<ChipProps> => {
        switch (value) {
            case true:
                return {
                    label: <FormattedMessage id="table.bool.yes" />,
                    icon: <Check fontSize="small" color="success" />,
                    color: 'success',
                };
            case false:
                return {
                    label: <FormattedMessage id="table.bool.no" />,
                    icon: <Close fontSize="small" color="error" />,
                    color: 'error',
                };
            default:
                return {
                    label: <FormattedMessage id="table.bool.unknown" />,
                    icon: <QuestionMark fontSize="small" />,
                };
        }
    })(props.value);
    return <Chip variant="outlined" size="small" {...conf} />;
};

export function useColumnTypes<TData>(): Record<
    GridColumnTypes,
    ColTypeDef<TData>
> {
    const intl = useIntl();
    const timestampFormat: ValueFormatterFunc<
        TData,
        string | number | Date | null | undefined
    > = useCallback((params) => timestampFormatter(intl, params), [intl]);

    //https://www.ag-grid.com/react-data-grid/components/
    return useMemo(
        () => ({
            [GridColumnTypes.BoolIcons]: {
                //filter: 'agNumberColumnFilter' / 'agTextColumnFilter'
                //align: 'left',
                cellRenderer: ((params) =>
                    (
                        <BoolValue value={params.value} />
                    ) as unknown as HTMLElement) as ICellRendererFunc,
            },
            [GridColumnTypes.Timestamp]: {
                cellDataType: 'dateString',
                filter: 'agDateColumnFilter',
                filterParams: {
                    debounceMs: 150,
                } as IDateFilterParams,
                valueFormatter: timestampFormat,
            },
        }),
        [timestampFormat]
    );
}
