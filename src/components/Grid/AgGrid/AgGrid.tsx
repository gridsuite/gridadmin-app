import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-alpine-no-font.min.css';
import 'ag-grid-community/styles/agGridMaterialFont.min.css';

import {
    ForwardedRef,
    forwardRef,
    FunctionComponent,
    JSXElementConstructor,
    PropsWithoutRef,
    ReactNode,
    RefAttributes,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import { Box, useTheme } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { CsvExportModule, ProcessCellForExportParams } from 'ag-grid-community';
import { useIntl } from 'react-intl';
import { AgGridProps } from './AgGrid.type';
import { LANG_ENGLISH, LANG_FRENCH } from '@gridsuite/commons-ui';
import {
    AG_GRID_LOCALE_EN,
    AgGridLocale,
} from '../../../translations/ag-grid/locale.en';
import { AG_GRID_LOCALE_FR } from '../../../translations/ag-grid/locale.fr';
import {
    ProcessGroupHeaderForExportParams,
    ProcessHeaderForExportParams,
    ProcessRowGroupForExportParams,
} from 'ag-grid-community/dist/lib/interfaces/exportParams';
import deepmerge from '@mui/utils/deepmerge/deepmerge';

const messages: Record<string, AgGridLocale> = {
    [LANG_ENGLISH]: AG_GRID_LOCALE_EN,
    [LANG_FRENCH]: AG_GRID_LOCALE_FR,
};

type AccessibleAgGridReact<TData> = Omit<
    AgGridReact<TData>,
    'apiListeners' | 'setGridApi' //private in class
>;
export type AgGridRef<TData, TContext extends {}> = Partial<
    AccessibleAgGridReact<TData>
> & {
    context?: TContext;
};

/*
 * Restore lost generics from `forwardRef()`<br/>
 * https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
 */
type ForwardRef<Props, Ref> = typeof forwardRef<Props, Ref>;
type ForwardRefComponent<Props, Ref> = ReturnType<ForwardRef<Props, Ref>>;
interface AgGridWithRef
    extends FunctionComponent<AgGridProps<unknown, any, any, any>> {
    <
        TData,
        TContext extends {},
        LdgCmpnt extends JSXElementConstructor<any>,
        NoCmpnt extends JSXElementConstructor<any>
    >(
        props: PropsWithoutRef<
            AgGridProps<TData, TContext, LdgCmpnt, NoCmpnt>
        > &
            RefAttributes<AgGridRef<TData, TContext>>
    ): ReturnType<
        ForwardRefComponent<
            AgGridProps<TData, TContext, LdgCmpnt, NoCmpnt>,
            AgGridRef<TData, TContext>
        >
    >;
}

//TODO @ag-grid-community/core
//TODO CsvExportModule
//TODO @ag-grid-community/react
//TODO ClientSideRowModelModule -> https://ag-grid.com/javascript-data-grid/client-side-model/
export const AgGrid: AgGridWithRef = forwardRef(function AgGrid<
    TData,
    TContext extends {} = {},
    LdgCmpnt extends JSXElementConstructor<any> = any,
    NoCmpnt extends JSXElementConstructor<any> = any
>(
    props: AgGridProps<TData, TContext, LdgCmpnt, NoCmpnt>,
    gridRef?: ForwardedRef<AgGridRef<TData, TContext>>
): ReactNode {
    const intl = useIntl();
    const theme = useTheme();

    const agGridRef = useRef<AgGridReact<TData>>(null);
    useImperativeHandle(
        gridRef,
        () => ({
            ...((agGridRef.current ?? {}) as AgGridReact<TData>),
            // destruct doesn't include functions, so we need to redeclare them
            //apiListeners: agGridRef.current?.apiListeners,
            registerApiListener: agGridRef.current?.registerApiListener,
            //setGridApi: agGridRef.current?.setGridApi,
            componentWillUnmount: agGridRef.current?.componentWillUnmount,
            render: agGridRef.current?.render,
            setState: agGridRef.current?.setState,
            forceUpdate: agGridRef.current?.forceUpdate,
            //...
            context: agGridRef.current?.context as AgGridRef<
                TData,
                TContext
            >['context'],
        }),
        []
    );

    const translations = useMemo(
        () => messages[intl.locale] ?? messages[intl.defaultLocale],
        [intl.locale, intl.defaultLocale]
    );

    const customTheme = useMemo(
        () =>
            deepmerge(
                {
                    width: '100%',
                    height: '100%',
                    //@media print -> page-break-inside: avoid
                },
                deepmerge(theme.agGridThemeOverride ?? {}, {
                    '--ag-icon-font-family': 'agGridMaterial !important',
                    '& *': {
                        '--ag-icon-font-family': 'agGridMaterial !important',
                    },
                })
            ),
        [theme.agGridThemeOverride]
    );
    /*const customContext = useMemo(
        () =>
            ({
                ...(props.context ?? ({} as TContext)),
                //TODO
            } as TContext),
        [props.context]
    );*/

    return (
        // wrapping container with theme & size
        <Box component="div" className={theme.agGridTheme} sx={customTheme}>
            <AgGridReact<TData>
                ref={agGridRef}
                modules={[
                    //ClientSideRowModelModule,
                    CsvExportModule,
                ]}
                localeText={translations}
                /*getLocaleText={(params) =>
                    intl.formatMessage(
                        { id: params.key, defaultMessage: params.defaultValue },
                        Array.reduce(
                            params.variableValues ?? [],
                            (acc, value, idx, array) => ({
                                ...acc,
                                [`var${idx}`]: value,
                            }),
                            {}
                        )
                    )
                }*/
                {...props} //destruct props to optimize react props change detection
                debug={
                    process.env.REACT_APP_DEBUG_AGGRID === 'true' || props.debug
                }
                //context={customContext}
                defaultCsvExportParams={useSecuredCsvExportParams(
                    props.defaultCsvExportParams
                )}
                reactiveCustomComponents //AG Grid: Using custom components without `reactiveCustomComponents = true` is deprecated.
            />
        </Box>
    );
});
export default AgGrid;
/*export default function AgGrid<TData, TContext = {}>({
    ref,
    ...props
}: AgGridProps<TData, TContext> & {
    ref: Ref<AgGridRef<TData>>;
}) {
    return <AgGridRef<TData, TContext> ref={ref} {...props} />;
}*/

function counterCsvInjection(value: string): string {
    return value ? value.replace(/^[+\-=@\t\r]/, '_') : value;
}

/*
 * https://www.ag-grid.com/react-data-grid/csv-export/#security-concerns
 */
function useSecuredCsvExportParams<TData, TContext extends {}>(
    defaultCsvExportParams: AgGridProps<
        TData,
        TContext
    >['defaultCsvExportParams']
) {
    const processCellCallback = defaultCsvExportParams?.processCellCallback;
    const customProcessCellCallback = useMemo(
        () =>
            (processCellCallback &&
                ((params: ProcessCellForExportParams<TData, TContext>) => {
                    let result = processCellCallback?.(params);
                    return result ? counterCsvInjection(result) : result;
                })) ||
            undefined,
        [processCellCallback]
    );

    const processHeaderCallback = defaultCsvExportParams?.processHeaderCallback;
    const customProcessHeaderCallback = useMemo(
        () =>
            (processHeaderCallback &&
                ((params: ProcessHeaderForExportParams<TData, TContext>) => {
                    let result = processHeaderCallback?.(params);
                    return result ? counterCsvInjection(result) : result;
                })) ||
            undefined,
        [processHeaderCallback]
    );

    const processGroupHeaderCallback =
        defaultCsvExportParams?.processGroupHeaderCallback;
    const customProcessGroupHeaderCallback = useMemo(
        () =>
            (processGroupHeaderCallback &&
                ((
                    params: ProcessGroupHeaderForExportParams<TData, TContext>
                ) => {
                    let result = processGroupHeaderCallback?.(params);
                    return result ? counterCsvInjection(result) : result;
                })) ||
            undefined,
        [processGroupHeaderCallback]
    );

    const processRowGroupCallback =
        defaultCsvExportParams?.processRowGroupCallback;
    const customProcessRowGroupCallback = useMemo(
        () =>
            (processRowGroupCallback &&
                ((params: ProcessRowGroupForExportParams<TData, TContext>) => {
                    let result = processRowGroupCallback?.(params);
                    return result ? counterCsvInjection(result) : result;
                })) ||
            undefined,
        [processRowGroupCallback]
    );

    return useMemo(
        () =>
            defaultCsvExportParams === undefined
                ? undefined
                : {
                      ...defaultCsvExportParams,
                      processCellCallback: customProcessCellCallback,
                      processHeaderCallback: customProcessHeaderCallback,
                      processGroupHeaderCallback:
                          customProcessGroupHeaderCallback,
                      processRowGroupCallback: customProcessRowGroupCallback,
                  },
        [
            customProcessCellCallback,
            customProcessGroupHeaderCallback,
            customProcessHeaderCallback,
            customProcessRowGroupCallback,
            defaultCsvExportParams,
        ]
    );
}
