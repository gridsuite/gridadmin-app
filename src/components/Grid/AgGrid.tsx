/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {
    ForwardedRef,
    forwardRef,
    FunctionComponent,
    PropsWithoutRef,
    ReactNode,
    RefAttributes,
    useId,
    useImperativeHandle,
    useRef,
} from 'react';
import { Box, useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { useIntl } from 'react-intl';
import { LANG_FRENCH } from '@gridsuite/commons-ui';
import { AG_GRID_LOCALE_FR } from '../../translations/ag-grid/locales';
import { GridOptions } from 'ag-grid-community';
import { useDebugRender } from '../../utils/hooks';

const messages: Record<string, Record<string, string>> = {
    [LANG_FRENCH]: AG_GRID_LOCALE_FR,
};

type AccessibleAgGridReact<TData> = Omit<
    AgGridReact<TData>,
    'apiListeners' | 'setGridApi' //private in class
>;
export type AgGridRef<TData, TContext extends {}> = {
    aggrid: AccessibleAgGridReact<TData> | null;
    context: TContext | null;
};

/*
 * Restore lost generics from `forwardRef()`<br/>
 * https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
 */
type ForwardRef<Props, Ref> = typeof forwardRef<Props, Ref>;
type ForwardRefComponent<Props, Ref> = ReturnType<ForwardRef<Props, Ref>>;

interface AgGridWithRef extends FunctionComponent<GridOptions<unknown>> {
    <TData, TContext extends {}>(
        props: PropsWithoutRef<GridOptions<TData>> & RefAttributes<AgGridRef<TData, TContext>>
    ): ReturnType<ForwardRefComponent<GridOptions<TData>, AgGridRef<TData, TContext>>>;
}

const style = {
    // default overridable style
    width: '100%',
    height: '100%',
    '@media print': {
        pageBreakInside: 'avoid',
    },
};

export const AgGrid: AgGridWithRef = forwardRef(function AgGrid<TData, TContext extends {} = {}>(
    props: GridOptions<TData>,
    gridRef?: ForwardedRef<AgGridRef<TData, TContext>>
): ReactNode {
    const intl = useIntl();
    const theme = useTheme();

    const id = useId();
    useDebugRender(`ag-grid(${id}) ${props.gridId}`);

    const agGridRef = useRef<AgGridReact<TData>>(null);
    const agGridRefContent = agGridRef.current;
    useImperativeHandle(
        gridRef,
        () => ({
            aggrid: agGridRefContent,
            context: props.context ?? null,
        }),
        [agGridRefContent, props.context]
    );

    return (
        // wrapping container with theme & size
        <Box component="div" className={theme.agGridTheme} sx={style}>
            <AgGridReact<TData>
                ref={agGridRef}
                localeText={messages[intl.locale] ?? messages[intl.defaultLocale] ?? undefined}
                {...props} //destruct props to optimize react props change detection
                debug={import.meta.env.VITE_DEBUG_AGGRID === 'true' || props.debug}
            />
        </Box>
    );
});
export default AgGrid;
