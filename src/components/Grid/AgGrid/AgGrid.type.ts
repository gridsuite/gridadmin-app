import {
    ColDef,
    GridOptions,
    ICellEditorComp,
    ICellEditorParams,
    ICheckboxCellRendererParams,
    IDateCellEditorParams,
    IDateFilterParams,
    IDateStringCellEditorParams,
    IGroupCellRendererParams,
    ILargeTextEditorParams,
    INumberCellEditorParams,
    INumberFilterParams,
    INumberFloatingFilterParams,
    ISelectCellEditorParams,
    ITextCellEditorParams,
    ITextFilterParams,
    ITextFloatingFilterParams,
} from 'ag-grid-community';
import {
    GetRowIdParams,
    IsExternalFilterPresentParams,
    IsFullWidthRowParams,
    NavigateToNextCellParams,
    NavigateToNextHeaderParams,
    PaginationNumberFormatterParams,
    PostSortRowsParams,
    ProcessRowParams,
    ProcessUnpinnedColumnsParams,
    RowHeightParams,
    TabToNextCellParams,
    TabToNextHeaderParams,
} from 'ag-grid-community/dist/lib/interfaces/iCallbackParams';
import { Column } from 'ag-grid-community/dist/lib/entities/column';
import {
    LoadingCellRendererSelectorResult,
    RowClassParams,
    RowStyle,
} from 'ag-grid-community/dist/lib/entities/gridOptions';
import { HeaderPosition } from 'ag-grid-community/dist/lib/headerRendering/common/headerPosition';
import { CellPosition } from 'ag-grid-community/dist/lib/entities/cellPositionUtils';
import {
    AsyncTransactionsFlushed,
    BodyScrollEndEvent,
    BodyScrollEvent,
    CellClickedEvent,
    CellContextMenuEvent,
    CellDoubleClickedEvent,
    CellEditingStartedEvent,
    CellEditingStoppedEvent,
    CellEditRequestEvent,
    CellFocusedEvent,
    CellKeyDownEvent,
    CellMouseDownEvent,
    CellMouseOutEvent,
    CellMouseOverEvent,
    CellValueChangedEvent,
    ColumnEverythingChangedEvent,
    ColumnGroupOpenedEvent,
    ColumnHeaderClickedEvent,
    ColumnHeaderContextMenuEvent,
    ColumnHeaderMouseLeaveEvent,
    ColumnHeaderMouseOverEvent,
    ColumnMovedEvent,
    ColumnPinnedEvent,
    ColumnPivotChangedEvent,
    ColumnPivotModeChangedEvent,
    ColumnResizedEvent,
    ColumnValueChangedEvent,
    ColumnVisibleEvent,
    ComponentStateChangedEvent,
    DisplayedColumnsChangedEvent,
    DragStartedEvent,
    DragStoppedEvent,
    FilterChangedEvent,
    FilterModifiedEvent,
    FilterOpenedEvent,
    FirstDataRenderedEvent,
    FullWidthCellKeyDownEvent,
    GridColumnsChangedEvent,
    GridPreDestroyedEvent,
    GridReadyEvent,
    GridSizeChangedEvent,
    ModelUpdatedEvent,
    NewColumnsLoadedEvent,
    PaginationChangedEvent,
    PinnedRowDataChangedEvent,
    RedoEndedEvent,
    RedoStartedEvent,
    RowClickedEvent,
    RowDataUpdatedEvent,
    RowDoubleClickedEvent,
    RowDragEvent,
    RowEditingStartedEvent,
    RowEditingStoppedEvent,
    RowSelectedEvent,
    RowValueChangedEvent,
    SelectionChangedEvent,
    SortChangedEvent,
    StateUpdatedEvent,
    TooltipHideEvent,
    TooltipShowEvent,
    UndoEndedEvent,
    UndoStartedEvent,
    ViewportChangedEvent,
    VirtualColumnsChangedEvent,
    VirtualRowRemovedEvent,
} from 'ag-grid-community/dist/lib/events';
import { ColGroupDef } from 'ag-grid-community/dist/lib/entities/colDef';
import { RowModelType } from 'ag-grid-community/dist/lib/interfaces/iRowModel';
import { ILoadingCellRendererParams } from 'ag-grid-community/dist/lib/rendering/cellRenderers/loadingCellRenderer';
import { JSXElementConstructor } from 'react';
import {
    CustomLoadingOverlayProps,
    CustomNoRowsOverlayProps,
} from 'ag-grid-react';
import {
    ICellRenderer,
    ICellRendererParams,
} from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import { IComponent } from 'ag-grid-community/dist/lib/interfaces/iComponent';
import {
    IHeader,
    IHeaderParams,
} from 'ag-grid-community/dist/lib/headerRendering/cells/column/headerComp';
import { LiteralUnion } from '../../../utils/types';
import {
    IFilter,
    IFilterParams,
} from 'ag-grid-community/dist/lib/interfaces/iFilter';
import {
    IFloatingFilter,
    IFloatingFilterParams,
} from 'ag-grid-community/dist/lib/filter/floating/floatingFilter';
import { ITooltipParams } from 'ag-grid-community/dist/lib/rendering/tooltipComponent';

type JsxConstructorParameter<Cmpnt extends JSXElementConstructor<any>> =
    Cmpnt extends abstract new (...args: any) => any
        ? ConstructorParameters<Cmpnt>[0]
        : Cmpnt extends (...args: any) => any
        ? Parameters<Cmpnt>[0]
        : unknown;

type JsxConstructorReturnType<Cmpnt extends JSXElementConstructor<any>> =
    Cmpnt extends abstract new (...args: any) => any
        ? InstanceType<Cmpnt>
        : Cmpnt extends (...args: any) => any
        ? ReturnType<Cmpnt>
        : unknown;

/*
 * Override implicit "any" generics and remove deprecated & enterprise/paid options
 * https://www.ag-grid.com/react-data-grid/grid-options/
 * https://www.ag-grid.com/react-data-grid/grid-events/
 */
/**
 * Filtered & fixed version of GridOptions
 * @template TData the datatype of rows
 * @template TContext the context content given by user to the grid
 * @template LdgCmpnt the component use for the loading overlay
 * @template NoCmpnt the component use for the no-row overlay
 */
export interface AgGridProps<
    TData,
    TContext extends {},
    //TValue = any,
    LdgCmpnt extends JSXElementConstructor<any> = any,
    NoCmpnt extends JSXElementConstructor<any> = any
> extends Omit<
        GridOptions<TData>,
        // deprecated options
        | 'enterMovesDown'
        | 'enterMovesDownAfterEdit'
        | 'excludeHiddenColumnsFromQuickFilter'
        | 'advancedFilterModel'
        | 'enableChartToolPanelsButton'
        | 'suppressParentsInRowNodes'
        | 'suppressAsyncEvents'
        | 'suppressAggAtRootLevel'
        | 'cellFlashDelay'
        | 'cellFadeDelay'
        | 'suppressGroupMaintainValueType'
        | 'suppressServerSideInfiniteScroll'
        | 'serverSideFilterAllLevels'
        | 'serverSideSortOnServer'
        | 'serverSideFilterOnServer'
        | 'functionsPassive'
        | 'reactiveCustomComponents'
        | 'onColumnRowGroupChangeRequest'
        | 'onColumnPivotChangeRequest'
        | 'onColumnValueChangeRequest'
        | 'onColumnAggFuncChangeRequest'
        | 'api'
        | 'columnApi'
        // enterprise features...
        | 'statusBar'
        // enterprise features "Tool Panels"
        | 'sideBar'
        | 'onToolPanelVisibleChanged'
        | 'onToolPanelSizeChanged'
        // enterprise feature "Tool Panels: Context Menu"
        | 'getContextMenuItems'
        | 'suppressContextMenu'
        //| 'preventDefaultOnContextMenu'
        | 'allowContextMenuWithControlKey'
        | 'popupParent'
        // enterprise feature "Tool Panels: Column Menu"
        | 'getMainMenuItems'
        | 'columnMenu'
        | 'suppressMenuHide'
        | 'postProcessPopup'
        | 'onColumnMenuVisibleChanged'
        // enterprise feature "Clipboard"
        | 'copyHeadersToClipboard'
        | 'copyGroupHeadersToClipboard'
        | 'clipboardDelimiter'
        | 'suppressCutToClipboard'
        | 'suppressCopyRowsToClipboard'
        | 'suppressCopySingleCellRanges'
        | 'suppressLastEmptyLineOnPaste'
        | 'suppressClipboardPaste'
        | 'suppressClipboardApi'
        | 'processCellForClipboard'
        | 'processHeaderForClipboard'
        | 'processGroupHeaderForClipboard'
        | 'processCellFromClipboard'
        | 'sendToClipboard'
        | 'processDataFromClipboard'
        | 'enableCellTextSelection'
        | 'onCutStart'
        | 'onCutEnd'
        | 'onPasteStart'
        | 'onPasteEnd'
        // enterprise feature "Excel Export"
        | 'defaultExcelExportParams'
        | 'suppressExcelExport'
        | 'excelStyles'
        // enterprise feature "Tree Data"
        | 'excludeChildrenWhenTreeDataFiltering'
        // enterprise feature "Advanced Filter"
        | 'enableAdvancedFilter'
        | 'includeHiddenColumnsInAdvancedFilter'
        | 'advancedFilterParent'
        | 'advancedFilterBuilderParams'
        | 'onAdvancedFilterBuilderVisibleChanged'
        // enterprise feature "Integrated Charts"
        | 'enableCharts'
        | 'suppressChartToolPanelsButton'
        | 'getChartToolbarItems'
        | 'createChartContainer'
        | 'chartThemes'
        | 'customChartThemes'
        | 'chartThemeOverrides'
        | 'chartToolPanelsDef'
        | 'onChartCreated'
        | 'onChartRangeSelectionChanged'
        | 'onChartOptionsChanged'
        | 'onChartDestroyed'
        // enterprise feature "Master Detail"
        | 'masterDetail'
        | 'isRowMaster'
        | 'detailCellRenderer'
        | 'detailCellRendererParams'
        | 'detailRowHeight'
        | 'detailRowAutoHeight'
        | 'embedFullWidthRows'
        | 'keepDetailRows'
        | 'keepDetailRowsCount'
        // enterprise features "Pivot" and "Aggregation"
        | 'pivotMode'
        | 'pivotPanelShow'
        | 'pivotDefaultExpanded'
        | 'pivotColumnGroupTotals'
        | 'pivotRowTotals'
        | 'pivotSuppressAutoColumn'
        | 'processPivotResultColDef'
        | 'processPivotResultColGroupDef'
        | 'suppressExpandablePivotGroups'
        | 'functionsReadOnly'
        | 'aggFuncs'
        | 'getGroupRowAgg'
        | 'suppressAggFuncInHeader'
        | 'alwaysAggregateAtRootLevel'
        | 'aggregateOnlyChangedColumns'
        | 'suppressAggFilteredOnly'
        | 'groupAggFiltering'
        | 'removePivotHeaderRowWhenSingleValueColumn'
        // enterprise feature "Row Grouping"
        | 'groupDisplayType'
        | 'groupDefaultExpanded'
        | 'autoGroupColumnDef'
        | 'groupMaintainOrder'
        | 'groupSelectsChildren'
        | 'groupLockGroupColumns'
        | 'groupIncludeFooter'
        | 'groupIncludeTotalFooter'
        | 'groupSuppressBlankHeader'
        | 'groupSelectsFiltered'
        | 'showOpenedGroup'
        | 'isGroupOpenByDefault'
        | 'initialGroupOrderComparator'
        | 'groupRemoveSingleChildren'
        | 'groupRemoveLowestSingleChildren'
        | 'groupHideOpenParents'
        | 'groupAllowUnbalanced'
        | 'rowGroupPanelShow'
        | 'rowGroupPanelSuppressSort'
        | 'groupRowRenderer'
        | 'groupRowRendererParams'
        | 'suppressDragLeaveHidesColumns'
        | 'suppressGroupRowsSticky'
        | 'suppressRowGroupHidesColumns'
        | 'suppressMakeColumnVisibleAfterUnGroup'
        | 'treeData'
        | 'getDataPath'
        | 'onColumnRowGroupChanged'
        | 'onRowGroupOpened'
        | 'onExpandOrCollapseAll'
        // enterprise feature "RowModel: Server-Side"
        | 'serverSideDatasource'
        | 'cacheBlockSize'
        | 'maxBlocksInCache'
        | 'maxConcurrentDatasourceRequests'
        | 'blockLoadDebounceMillis'
        | 'purgeClosedRowNodes'
        | 'serverSidePivotResultFieldSeparator'
        | 'serverSideSortAllLevels'
        | 'serverSideEnableClientSideSort'
        | 'serverSideOnlyRefreshFilteredGroups'
        | 'serverSideInitialRowCount'
        | 'getChildCount'
        | 'getServerSideGroupLevelParams'
        | 'isServerSideGroupOpenByDefault'
        | 'isApplyServerSideTransaction'
        | 'isServerSideGroup'
        | 'getServerSideGroupKey'
        | 'onStoreRefreshed'
        // enterprise feature "RowModel: Viewport"
        | 'viewportDatasource'
        | 'viewportRowModelPageSize'
        | 'viewportRowModelBufferSize'
        // enterprise feature "Range selection"
        | 'suppressMultiRangeSelection'
        | 'enableRangeSelection'
        | 'enableRangeHandle'
        | 'enableFillHandle'
        | 'fillHandleDirection'
        | 'fillOperation'
        | 'suppressClearOnFillReduction'
        | 'onRangeDeleteStart'
        | 'onRangeDeleteEnd'
        | 'onRangeSelectionChanged'
        // managed by component
        | 'localeText'
        | 'getLocaleText'
        /*| 'overlayLoadingTemplate'
        | 'loadingOverlayComponent'
        | 'loadingOverlayComponentParams'
        | 'suppressLoadingOverlay'
        | 'overlayNoRowsTemplate'
        | 'noRowsOverlayComponent'
        | 'noRowsOverlayComponentParams'
        | 'suppressNoRowsOverlay'*/
    > {
    context?: TContext;

    loadingOverlayComponent?: (
        props: CustomLoadingOverlayProps<TData, TContext> &
            JsxConstructorParameter<LdgCmpnt>
    ) => JsxConstructorReturnType<LdgCmpnt>;
    loadingOverlayComponentParams?: JsxConstructorParameter<LdgCmpnt>;

    noRowsOverlayComponent?: (
        props: CustomNoRowsOverlayProps<TData, TContext> &
            JsxConstructorParameter<NoCmpnt>
    ) => JsxConstructorReturnType<NoCmpnt>;
    noRowsOverlayComponentParams?: JsxConstructorParameter<NoCmpnt>;

    /*
     * some modes are for enterprise features
     * https://www.ag-grid.com/react-data-grid/row-models/
     */
    rowModelType?: Exclude<RowModelType, 'serverSide' | 'viewport'>;

    /*
     * add missing <TValue>
     */
    //TODO manage TValue correctly

    columnDefs?:
        | (
              | AgColDef<TData, /*TValue=*/ any, TContext>
              | AgColGroupDef<TData, TContext>
          )[]
        | null;
    defaultColDef?: AgColDef<TData, /*TValue=*/ any, TContext>;
    autoGroupColumnDef?: AgColDef<TData, /*TValue=*/ any, TContext>;

    columnTypes?: {
        [key: string]: AgColTypeDef<TData, /*TValue=*/ any, TContext>;
    };

    processPivotResultColDef?: (
        colDef: AgColDef<TData, /*TValue=*/ any, TContext>
    ) => void;

    /*
     * add missing <TContext>
     */

    loadingCellRendererSelector?: (
        params: ILoadingCellRendererParams<TData, TContext>
    ) => LoadingCellRendererSelectorResult | undefined;
    rowClassRules?: {
        [cssClassName: string]:
            | ((params: RowClassParams<TData, TContext>) => boolean)
            | string;
    };
    getRowId?: (params: GetRowIdParams<TData, TContext>) => string;

    processUnpinnedColumns?: (
        params: ProcessUnpinnedColumnsParams<TData, TContext>
    ) => Column[];
    isExternalFilterPresent?: (
        params: IsExternalFilterPresentParams<TData, TContext>
    ) => boolean;
    navigateToNextHeader?: (
        params: NavigateToNextHeaderParams<TData, TContext>
    ) => HeaderPosition | null;
    tabToNextHeader?: (
        params: TabToNextHeaderParams<TData, TContext>
    ) => HeaderPosition | null;
    navigateToNextCell?: (
        params: NavigateToNextCellParams<TData, TContext>
    ) => CellPosition | null;
    tabToNextCell?: (
        params: TabToNextCellParams<TData, TContext>
    ) => CellPosition | null;
    paginationNumberFormatter?: (
        params: PaginationNumberFormatterParams<TData, TContext>
    ) => string;
    processRowPostCreate?: (params: ProcessRowParams<TData, TContext>) => void;
    postSortRows?: (params: PostSortRowsParams<TData, TContext>) => void;
    getRowStyle?: (
        params: RowClassParams<TData, TContext>
    ) => RowStyle | undefined;
    getRowClass?: (
        params: RowClassParams<TData, TContext>
    ) => string | string[] | undefined;
    getRowHeight?: (
        params: RowHeightParams<TData, TContext>
    ) => number | undefined | null;
    isFullWidthRow?: (params: IsFullWidthRowParams<TData, TContext>) => boolean;

    // TODO remove enterprise related events
    onColumnVisible?(event: ColumnVisibleEvent<TData, TContext>): void;
    onColumnPinned?(event: ColumnPinnedEvent<TData, TContext>): void;
    onColumnResized?(event: ColumnResizedEvent<TData, TContext>): void;
    onColumnMoved?(event: ColumnMovedEvent<TData, TContext>): void;
    onColumnValueChanged?(
        event: ColumnValueChangedEvent<TData, TContext>
    ): void;
    onColumnPivotModeChanged?(
        event: ColumnPivotModeChangedEvent<TData, TContext>
    ): void;
    onColumnPivotChanged?(
        event: ColumnPivotChangedEvent<TData, TContext>
    ): void;
    onColumnGroupOpened?(event: ColumnGroupOpenedEvent<TData, TContext>): void;
    onNewColumnsLoaded?(event: NewColumnsLoadedEvent<TData, TContext>): void;
    onGridColumnsChanged?(
        event: GridColumnsChangedEvent<TData, TContext>
    ): void;
    onDisplayedColumnsChanged?(
        event: DisplayedColumnsChangedEvent<TData, TContext>
    ): void;
    onVirtualColumnsChanged?(
        event: VirtualColumnsChangedEvent<TData, TContext>
    ): void;
    onColumnEverythingChanged?(
        event: ColumnEverythingChangedEvent<TData, TContext>
    ): void;
    onColumnHeaderMouseOver?(
        event: ColumnHeaderMouseOverEvent<TData, TContext>
    ): void;
    onColumnHeaderMouseLeave?(
        event: ColumnHeaderMouseLeaveEvent<TData, TContext>
    ): void;
    onColumnHeaderClicked?(
        event: ColumnHeaderClickedEvent<TData, TContext>
    ): void;
    onColumnHeaderContextMenu?(
        event: ColumnHeaderContextMenuEvent<TData, TContext>
    ): void;
    onComponentStateChanged?(
        event: ComponentStateChangedEvent<TData, TContext>
    ): void;
    onCellValueChanged?(event: CellValueChangedEvent<TData, TContext>): void;
    onCellEditRequest?(event: CellEditRequestEvent<TData, TContext>): void;
    onRowValueChanged?(event: RowValueChangedEvent<TData, TContext>): void;
    onCellEditingStarted?(
        event: CellEditingStartedEvent<TData, TContext>
    ): void;
    onCellEditingStopped?(
        event: CellEditingStoppedEvent<TData, TContext>
    ): void;
    onRowEditingStarted?(event: RowEditingStartedEvent<TData, TContext>): void;
    onRowEditingStopped?(event: RowEditingStoppedEvent<TData, TContext>): void;
    onUndoStarted?(event: UndoStartedEvent<TData, TContext>): void;
    onUndoEnded?(event: UndoEndedEvent<TData, TContext>): void;
    onRedoStarted?(event: RedoStartedEvent<TData, TContext>): void;
    onRedoEnded?(event: RedoEndedEvent<TData, TContext>): void;
    onFilterOpened?(event: FilterOpenedEvent<TData, TContext>): void;
    onFilterChanged?(event: FilterChangedEvent<TData, TContext>): void;
    onFilterModified?(event: FilterModifiedEvent<TData, TContext>): void;
    onCellKeyDown?(
        event:
            | CellKeyDownEvent<TData, TContext>
            | FullWidthCellKeyDownEvent<TData, TContext>
    ): void;
    onGridReady?(event: GridReadyEvent<TData, TContext>): void;
    onGridPreDestroyed?(event: GridPreDestroyedEvent<TData, TContext>): void;
    onFirstDataRendered?(event: FirstDataRenderedEvent<TData, TContext>): void;
    onGridSizeChanged?(event: GridSizeChangedEvent<TData, TContext>): void;
    onModelUpdated?(event: ModelUpdatedEvent<TData, TContext>): void;
    onVirtualRowRemoved?(event: VirtualRowRemovedEvent<TData, TContext>): void;
    onViewportChanged?(event: ViewportChangedEvent<TData, TContext>): void;
    onBodyScroll?(event: BodyScrollEvent<TData, TContext>): void;
    onBodyScrollEnd?(event: BodyScrollEndEvent<TData, TContext>): void;
    onDragStarted?(event: DragStartedEvent<TData, TContext>): void;
    onDragStopped?(event: DragStoppedEvent<TData, TContext>): void;
    onStateUpdated?(event: StateUpdatedEvent<TData, TContext>): void;
    onPaginationChanged?(event: PaginationChangedEvent<TData, TContext>): void;
    onRowDragEnter?(event: RowDragEvent<TData, TContext>): void;
    onRowDragMove?(event: RowDragEvent<TData, TContext>): void;
    onRowDragLeave?(event: RowDragEvent<TData, TContext>): void;
    onRowDragEnd?(event: RowDragEvent<TData, TContext>): void;
    onPinnedRowDataChanged?(
        event: PinnedRowDataChangedEvent<TData, TContext>
    ): void;
    onRowDataUpdated?(event: RowDataUpdatedEvent<TData, TContext>): void;
    onAsyncTransactionsFlushed?(event: AsyncTransactionsFlushed<TData>): void;
    onCellClicked?(event: CellClickedEvent<TData, TContext>): void;
    onCellDoubleClicked?(event: CellDoubleClickedEvent<TData, TContext>): void;
    onCellFocused?(event: CellFocusedEvent<TData, TContext>): void;
    onCellMouseOver?(event: CellMouseOverEvent<TData, TContext>): void;
    onCellMouseOut?(event: CellMouseOutEvent<TData, TContext>): void;
    onCellMouseDown?(event: CellMouseDownEvent<TData, TContext>): void;
    onRowClicked?(event: RowClickedEvent<TData, TContext>): void;
    onRowDoubleClicked?(event: RowDoubleClickedEvent<TData, TContext>): void;
    onRowSelected?(event: RowSelectedEvent<TData, TContext>): void;
    onSelectionChanged?(event: SelectionChangedEvent<TData, TContext>): void;
    onCellContextMenu?(event: CellContextMenuEvent<TData, TContext>): void;
    onTooltipShow?(event?: TooltipShowEvent<TData, TContext>): void;
    onTooltipHide?(event?: TooltipHideEvent<TData, TContext>): void;
    onSortChanged?(event: SortChangedEvent<TData, TContext>): void;
}

export declare type AgColTypeDef<TData, TValue = any, TContext = any> = Omit<
    AgColDef<TData, TValue, TContext>,
    'type'
>;

export interface AgColGroupDef<TData, TContext> extends ColGroupDef<TData> {
    children: (
        | AgColDef<TData, /*TValue=*/ any, TContext>
        | AgColGroupDef<TData, TContext>
    )[];

    tooltipComponent?: string | ITooltipComp<TData, /*TValue=*/ any, TContext>;
    tooltipComponentParams?: ITooltipParams<
        TData,
        /*TValue=*/ any,
        TContext
    > & {
        [key: string]: any;
    };
}
export interface ITooltipComp<TData = any, TValue = any, TContext = any>
    extends IComponent<ITooltipParams<TData, TValue, TContext>> {}

/*
 * Remove deprecated & enterprise/paid options
 * https://www.ag-grid.com/react-data-grid/column-properties/
 */
export interface AgColDef<TData, TValue = any, TContext = any>
    extends Omit<
        ColDef<TData, TValue>,
        // deprecated options
        | 'columnsMenuParams'
        | 'suppressMenu'
        // enterprise feature "Range selection"
        | 'suppressFillHandle'
        // enterprise feature "Context Menu"
        | 'contextMenuItems'
        | 'menuTabs'
        | 'columnChooserParams'
        | 'mainMenuItems'
        | 'suppressHeaderMenuButton'
        | 'suppressHeaderFilterButton'
        | 'suppressHeaderContextMenu'
        // enterprise feature "Integrated Charts"
        | 'chartDataType'
        // enterprise features "Pivot" and "Aggregation"
        | 'pivot'
        | 'pivotIndex'
        //| 'pivotKeys'
        | 'pivotComparator'
        //| 'pivotValueColumn'
        //| 'pivotTotalColumnIds'
        | 'enablePivot'
        | 'initialPivot'
        | 'initialPivotIndex'
        // enterprise feature "Row Grouping"
        | 'rowGroup'
        | 'initialRowGroup'
        | 'rowGroupIndex'
        | 'initialRowGroupIndex'
        | 'enableRowGroup'
        | 'showRowGroup'
        | 'enableValue'
        | 'aggFunc'
        | 'initialAggFunc'
        | 'allowedAggFuncs'
        | 'defaultAggFunc'
    > {
    cellEditor?:
        | LiteralUnion<
              | 'agTextCellEditor'
              | 'agSelectCellEditor'
              | 'agLargeTextCellEditor'
              | 'agNumberCellEditor'
              | 'agDateCellEditor'
              | 'agDateStringCellEditor'
              | 'agCheckboxCellEditor'
          >
        | ICellEditorComp<TData, TValue, TContext>;
    //TODO discriminative conditional type on cellEditor value
    cellEditorParams?:
        | (ICellEditorParams<TData, TValue, TContext> & { [key: string]: any })
        | ITextCellEditorParams<TData, TValue, TContext>
        | ISelectCellEditorParams<TValue>
        | ILargeTextEditorParams
        | INumberCellEditorParams<TData, TContext>
        | IDateCellEditorParams<TData, TContext>
        | IDateStringCellEditorParams<TData, TContext>
        | ICheckboxCellRendererParams<TData, TContext>;

    headerComponent?: string | IHeaderComp<TData, TContext>;
    headerComponentParams?: IHeaderParams<TData, TContext> & {
        [key: string]: any;
    };

    cellRenderer?:
        | LiteralUnion<
              | 'agAnimateShowChangeCellRenderer'
              | 'agAnimateSlideCellRenderer'
              | 'agGroupCellRenderer'
              | 'agCheckboxCellRenderer'
          >
        | ICellRendererComp<TData, TValue, TContext>
        | ICellRendererFunc<TData, TValue, TContext>;
    //TODO discriminative conditional type on cellRenderer value
    cellRendererParams?:
        | (Partial<ICellRendererParams<TData, TValue, TContext>> & { [key: string]: any })
        | IGroupCellRendererParams<TData, TValue>
        | ICheckboxCellRendererParams<TData, TContext>;

    cellDataType?:
        | boolean
        | LiteralUnion<
              'text' | 'number' | 'boolean' | 'date' | 'dateString' | 'object'
          >;

    tooltipComponent?: string | ITooltipComp<TData, TValue, TContext>;
    tooltipComponentParams?: ITooltipParams<TData, TValue, TContext> & {
        [key: string]: any;
    };

    filter?:
        | true
        | LiteralUnion<
              | 'agNumberColumnFilter'
              | 'agTextColumnFilter'
              | 'agDateColumnFilter'
          >
        | IFilterComp<TData, TContext>;
    //TODO discriminative conditional type on filter value
    filterParams?:
        | (IFilterParams<TData, TContext> & { [key: string]: any })
        | INumberFilterParams
        | ITextFilterParams
        | IDateFilterParams;

    floatingFilterComponent?:
        | true
        | LiteralUnion<
              | 'agTextColumnFloatingFilter'
              | 'agNumberColumnFloatingFilter'
              | 'agDateColumnFloatingFilter'
          >
        | IFloatingFilterComp<any, TData, TContext>;
    //TODO discriminative conditional type on floatingFilterComponent value
    floatingFilterComponentParams?:
        | (IFloatingFilterParams & { [key: string]: any })
        | ITextFloatingFilterParams
        | INumberFloatingFilterParams;
}
interface ICellRendererComp<TData = any, TValue = any, TContext = any>
    extends IComponent<ICellRendererParams<TData, TValue, TContext>>,
        ICellRenderer<TData> {}
type ICellRendererFunc<TData = any, TValue = any, TContext = any> = (
    params: ICellRendererParams<TData, TValue, TContext>
) => HTMLElement | string;
interface IHeaderComp<TData = any, TContext = any>
    extends IHeader,
        IComponent<IHeaderParams<TData, TContext>> {}
export interface IFilterComp<TData, TContext>
    extends IComponent<IFilterParams<TData, TContext>>,
        IFilter {}
export interface IFloatingFilterComp<P = any, TData = any, TContext = any>
    extends IFloatingFilter<P>,
        IComponent<IFloatingFilterParams<P, TData, TContext>> {}
