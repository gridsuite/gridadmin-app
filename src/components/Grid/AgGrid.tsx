/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
import { AgGridReact } from 'ag-grid-react';
import { CustomAGGrid, type CustomAGGridProps } from '@gridsuite/commons-ui';
import { useDebugRender } from '../../utils/hooks';

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

interface AgGridWithRef extends FunctionComponent<CustomAGGridProps<unknown>> {
    <TData, TContext extends {} = {}>(
        props: PropsWithoutRef<CustomAGGridProps<TData>> & RefAttributes<AgGridRef<TData, TContext>>
    ): ReturnType<ForwardRefComponent<CustomAGGridProps<TData>, AgGridRef<TData, TContext>>>;
}

// TODO move&merge to commons-ui
const style = {
    // default overridable style
    width: '100%',
    height: '100%',
    '@media print': {
        pageBreakInside: 'avoid',
    },
};

// TODO move type generic restoration to commons-ui
// TODO move useDebug feature from env to commons-ui
export const AgGrid: AgGridWithRef = forwardRef(function AgGrid<TData, TContext extends {} = {}>(
    props: CustomAGGridProps<TData>,
    gridRef?: ForwardedRef<AgGridRef<TData, TContext>>
): ReactNode {
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
        <CustomAGGrid //TODO <TData>
            ref={agGridRef}
            {...props} //destruct props to optimize react props change detection
            debug={import.meta.env.VITE_DEBUG_AGGRID === 'true' || props.debug}
            sx={style}
        />
    );
});
export default AgGrid;
