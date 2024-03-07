// from https://github.com/ag-grid/ag-grid/blob/latest/documentation/ag-grid-docs/src/content/docs/localisation/_examples/localisation/locale.en.js
/* eslint-disable no-template-curly-in-string */

export type AgGridLocale = Partial<Record<AgGridLocaleKeys, string>>;

/* eslint-disable prettier/prettier */
export type AgGridLocaleKeys =
    // Set Filter
    | 'selectAll' | 'selectAllSearchResults' | 'addCurrentSelectionToFilter' | 'searchOoo' | 'blanks' | 'noMatches'
    // Number Filter & Text Filter
    | 'filterOoo' | 'equals' | 'notEqual' | 'blank' | 'notBlank' | 'empty'
    // Number Filter
    | 'lessThan' | 'greaterThan' | 'lessThanOrEqual' | 'greaterThanOrEqual' | 'inRange' | 'inRangeStart' | 'inRangeEnd'
    // Text Filter
    | 'contains' | 'notContains' | 'startsWith' | 'endsWith'
    // Date Filter
    | 'dateFormatOoo' | 'before' | 'after'
    // Filter Conditions
    | 'andCondition' | 'orCondition'
    // Filter Buttons
    | 'applyFilter' | 'resetFilter' | 'clearFilter' | 'cancelFilter'
    // Filter Titles
    | 'textFilter' | 'numberFilter' | 'dateFilter' | 'setFilter'
    // Group Column Filter
    | 'groupFilterSelect'
    // Advanced Filter
    | 'advancedFilterContains' | 'advancedFilterNotContains' | 'advancedFilterTextEquals' | 'advancedFilterTextNotEqual' | 'advancedFilterStartsWith' | 'advancedFilterEndsWith' | 'advancedFilterBlank' | 'advancedFilterNotBlank' | 'advancedFilterEquals' | 'advancedFilterNotEqual' | 'advancedFilterGreaterThan' | 'advancedFilterGreaterThanOrEqual' | 'advancedFilterLessThan' | 'advancedFilterLessThanOrEqual' | 'advancedFilterTrue' | 'advancedFilterFalse'
    | 'advancedFilterAnd' | 'advancedFilterOr' | 'advancedFilterApply' | 'advancedFilterBuilder' | 'advancedFilterValidationMissingColumn' | 'advancedFilterValidationMissingOption' | 'advancedFilterValidationMissingValue' | 'advancedFilterValidationInvalidColumn' | 'advancedFilterValidationInvalidOption' | 'advancedFilterValidationMissingQuote' | 'advancedFilterValidationNotANumber' | 'advancedFilterValidationInvalidDate' | 'advancedFilterValidationMissingCondition'
    | 'advancedFilterValidationJoinOperatorMismatch' | 'advancedFilterValidationInvalidJoinOperator' | 'advancedFilterValidationMissingEndBracket' | 'advancedFilterValidationExtraEndBracket' | 'advancedFilterValidationMessage' | 'advancedFilterValidationMessageAtEnd' | 'advancedFilterBuilderTitle' | 'advancedFilterBuilderApply' | 'advancedFilterBuilderCancel' | 'advancedFilterBuilderAddButtonTooltip' | 'advancedFilterBuilderRemoveButtonTooltip' | 'advancedFilterBuilderMoveUpButtonTooltip'
    | 'advancedFilterBuilderMoveDownButtonTooltip' | 'advancedFilterBuilderAddJoin' | 'advancedFilterBuilderAddCondition' | 'advancedFilterBuilderSelectColumn' | 'advancedFilterBuilderSelectOption' | 'advancedFilterBuilderEnterValue' | 'advancedFilterBuilderValidationAlreadyApplied' | 'advancedFilterBuilderValidationIncomplete' | 'advancedFilterBuilderValidationSelectColumn' | 'advancedFilterBuilderValidationSelectOption' | 'advancedFilterBuilderValidationEnterValue'
    // Side Bar
    | 'columns' | 'filters'
    // columns tool panel
    | 'pivotMode' | 'groups' | 'rowGroupColumnsEmptyMessage' | 'values' | 'valueColumnsEmptyMessage' | 'pivots' | 'pivotColumnsEmptyMessage'
    // Header of the Default Group Column
    | 'group'
    // Row Drag
    | 'rowDragRow' | 'rowDragRows'
    // Other
    | 'loadingOoo' | 'loadingError' | 'noRowsToShow' | 'enabled'
    // Menu
    | 'pinColumn' | 'pinLeft' | 'pinRight' | 'noPin' | 'valueAggregation' | 'noAggregation' | 'autosizeThiscolumn' | 'autosizeAllColumns' | 'groupBy' | 'ungroupBy' | 'ungroupAll' | 'addToValues' | 'removeFromValues' | 'addToLabels' | 'removeFromLabels' | 'resetColumns' | 'expandAll' | 'collapseAll' | 'copy' | 'ctrlC' | 'ctrlX' | 'copyWithHeaders' | 'copyWithGroupHeaders' | 'cut' | 'paste' | 'ctrlV' | 'export' | 'csvExport' | 'excelExport' | 'columnFilter' | 'columnChooser' | 'sortAscending' | 'sortDescending' | 'sortUnSort'
    // Enterprise Menu Aggregation and Status Bar
    | 'sum' | 'first' | 'last' | 'min' | 'max' | 'none' | 'count' | 'avg' | 'filteredRows' | 'selectedRows' | 'totalRows' | 'totalAndFilteredRows' | 'more' | 'to' | 'of' | 'page' | 'pageLastRowUnknown' | 'nextPage' | 'lastPage' | 'firstPage' | 'previousPage' | 'pageSizeSelectorLabel' | 'footerTotal'
    // Pivoting
    | 'pivotColumnGroupTotals'
    // Enterprise Menu (Charts)
    | 'pivotChartAndPivotMode' | 'pivotChart' | 'chartRange' | 'columnChart' | 'groupedColumn' | 'stackedColumn' | 'normalizedColumn' | 'barChart' | 'groupedBar' | 'stackedBar' | 'normalizedBar' | 'pieChart' | 'pie' | 'donut' | 'line' | 'xyChart' | 'scatter' | 'bubble' | 'areaChart' | 'area' | 'stackedArea' | 'normalizedArea' | 'histogramChart' | 'histogramFrequency' | 'polarChart' | 'radarLine' | 'radarArea' | 'nightingale' | 'radialColumn' | 'radialBar' | 'statisticalChart' | 'boxPlot'
    | 'rangeBar' | 'rangeArea' | 'hierarchicalChart' | 'treemap' | 'sunburst' | 'specializedChart' | 'waterfall' | 'heatmap' | 'combinationChart' | 'columnLineCombo' | 'AreaColumnCombo'
    // Charts
    | 'pivotChartTitle' | 'rangeChartTitle' | 'settings' | 'data' | 'format' | 'categories' | 'defaultCategory' | 'series' | 'xyValues' | 'paired' | 'axis' | 'radiusAxis' | 'navigator' | 'color' | 'thickness' | 'preferredLength' | 'xType' | 'automatic' | 'category' | 'number' | 'time' | 'autoRotate' | 'xRotation' | 'yRotation' | 'labelRotation' | 'circle' | 'polygon' | 'orientation' | 'fixed' | 'parallel' | 'perpendicular' | 'radiusAxisPosition' | 'ticks' | 'width' | 'height' | 'length' | 'padding' | 'spacing'
    | 'chart' | 'title' | 'titlePlaceholder' | 'background' | 'font' | 'top' | 'right' | 'bottom' | 'left' | 'labels' | 'calloutLabels' | 'sectorLabels' | 'positionRatio' | 'size' | 'shape' | 'minSize' | 'maxSize' | 'legend' | 'position' | 'markerSize' | 'markerStroke' | 'markerPadding' | 'itemSpacing' | 'itemPaddingX' | 'itemPaddingY' | 'layoutHorizontalSpacing' | 'layoutVerticalSpacing' | 'strokeWidth' | 'offset' | 'offsets' | 'tooltips' | 'callout' | 'markers' | 'shadow' | 'blur' | 'xOffset' | 'yOffset'
    | 'lineWidth' | 'lineDash' | 'lineDashOffset' | 'normal' | 'bold' | 'italic' | 'boldItalic' | 'predefined' | 'fillOpacity' | 'strokeColor' | 'strokeOpacity' | 'histogramBinCount' | 'connectorLine' | 'seriesItems' | 'seriesItemType' | 'seriesItemPositive' | 'seriesItemNegative' | 'seriesItemLabels' | 'columnGroup' | 'barGroup' | 'pieGroup' | 'lineGroup' | 'scatterGroup' | 'areaGroup' | 'polarGroup' | 'statisticalGroup' | 'hierarchicalGroup' | 'specializedGroup' | 'combinationGroup' | 'groupedColumnTooltip'
    | 'stackedColumnTooltip' | 'normalizedColumnTooltip' | 'groupedBarTooltip' | 'stackedBarTooltip' | 'normalizedBarTooltip' | 'pieTooltip' | 'donutTooltip' | 'lineTooltip' | 'groupedAreaTooltip' | 'stackedAreaTooltip' | 'normalizedAreaTooltip' | 'scatterTooltip' | 'bubbleTooltip' | 'histogramTooltip' | 'radialColumnTooltip' | 'radialBarTooltip' | 'radarLineTooltip' | 'radarAreaTooltip' | 'nightingaleTooltip' | 'rangeBarTooltip' | 'rangeAreaTooltip' | 'boxPlotTooltip' | 'treemapTooltip' | 'sunburstTooltip'
    | 'waterfallTooltip' | 'heatmapTooltip' | 'columnLineComboTooltip' | 'areaColumnComboTooltip' | 'customComboTooltip' | 'innerRadius' | 'startAngle' | 'endAngle' | 'reverseDirection' | 'groupPadding' | 'seriesPadding' /*| 'group'*/ | 'tile' | 'whisker' | 'cap' | 'capLengthRatio' | 'labelPlacement' | 'inside' | 'outside' | 'noDataToChart' | 'pivotChartRequiresPivotMode' | 'chartSettingsToolbarTooltip' | 'chartLinkToolbarTooltip' | 'chartUnlinkToolbarTooltip' | 'chartDownloadToolbarTooltip'
    | 'seriesChartType' | 'seriesType' | 'secondaryAxis'
    // ARIA
    | 'ariaAdvancedFilterBuilderItem' | 'ariaAdvancedFilterBuilderItemValidation' | 'ariaAdvancedFilterBuilderList' | 'ariaAdvancedFilterBuilderFilterItem' | 'ariaAdvancedFilterBuilderGroupItem' | 'ariaAdvancedFilterBuilderColumn' | 'ariaAdvancedFilterBuilderOption' | 'ariaAdvancedFilterBuilderValueP' | 'ariaAdvancedFilterBuilderJoinOperator' | 'ariaAdvancedFilterInput' | 'ariaChecked' | 'ariaColumn' | 'ariaColumnGroup' | 'ariaColumnFiltered' | 'ariaColumnSelectAll'
    | 'ariaDateFilterInput' | 'ariaDefaultListName' | 'ariaFilterColumnsInput' | 'ariaFilterFromValue' | 'ariaFilterInput' | 'ariaFilterList' | 'ariaFilterToValue' | 'ariaFilterValue' | 'ariaFilterMenuOpen' | 'ariaFilteringOperator' | 'ariaHidden' | 'ariaIndeterminate' | 'ariaInputEditor' | 'ariaMenuColumn' | 'ariaFilterColumn' | 'ariaRowDeselect' | 'ariaRowSelectAll' | 'ariaRowToggleSelection' | 'ariaRowSelect' | 'ariaSearch' | 'ariaSortableColumn' | 'ariaToggleVisibility'
    | 'ariaToggleCellValue' | 'ariaUnchecked' | 'ariaVisible' | 'ariaSearchFilterValues' | 'ariaPageSizeSelectorLabel'
    // ARIA Labels for Drop Zones
    | 'ariaRowGroupDropZonePanelLabel' | 'ariaValuesDropZonePanelLabel' | 'ariaPivotDropZonePanelLabel' | 'ariaDropZoneColumnComponentDescription' | 'ariaDropZoneColumnValueItemDescription' | 'ariaDropZoneColumnGroupItemDescription'
    // used for aggregate drop zone, format: {aggregation}{ariaDropZoneColumnComponentAggFuncSeparator}{column name}
    | 'ariaDropZoneColumnComponentAggFuncSeparator' | 'ariaDropZoneColumnComponentSortAscending' | 'ariaDropZoneColumnComponentSortDescending'
    // ARIA Labels for Dialogs
    | 'ariaLabelColumnMenu' | 'ariaLabelColumnFilter' | 'ariaLabelCellEditor' | 'ariaLabelDialog' | 'ariaLabelSelectField' | 'ariaLabelRichSelectField' | 'ariaLabelTooltip' | 'ariaLabelContextMenu' | 'ariaLabelSubMenu' | 'ariaLabelAggregationFunction' | 'ariaLabelAdvancedFilterAutocomplete' | 'ariaLabelAdvancedFilterBuilderAddField' | 'ariaLabelAdvancedFilterBuilderColumnSelectField' | 'ariaLabelAdvancedFilterBuilderOptionSelectField' | 'ariaLabelAdvancedFilterBuilderJoinSelectField'
    // ARIA Labels for the Side Bar
    | 'ariaColumnPanelList' | 'ariaFilterPanelList'
    // Number Format (Status Bar, Pagination Panel)
    | 'thousandSeparator' | 'decimalSeparator'
    // Data types
    | 'true' | 'false' | 'invalidDate' | 'invalidNumber' | 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';
/* eslint-enable prettier/prettier */

export const AG_GRID_LOCALE_FR: AgGridLocale = {
    // Set Filter
    selectAll: '(Select All)',
    selectAllSearchResults: '(Select All Search Results)',
    addCurrentSelectionToFilter: 'Add current selection to filter',
    searchOoo: 'Search...',
    blanks: '(Blanks)',
    noMatches: 'No matches',

    // Number Filter & Text Filter
    filterOoo: 'Filter...',
    equals: 'Equals',
    notEqual: 'Does not equal',
    blank: 'Blank',
    notBlank: 'Not blank',
    empty: 'Choose one',

    // Number Filter
    lessThan: 'Less than',
    greaterThan: 'Greater than',
    lessThanOrEqual: 'Less than or equal to',
    greaterThanOrEqual: 'Greater than or equal to',
    inRange: 'Between',
    inRangeStart: 'From',
    inRangeEnd: 'To',

    // Text Filter
    contains: 'Contains',
    notContains: 'Does not contain',
    startsWith: 'Begins with',
    endsWith: 'Ends with',

    // Date Filter
    dateFormatOoo: 'yyyy/mm/dd',
    before: 'Avant',
    after: 'Après',

    // Filter Conditions
    andCondition: 'ET',
    orCondition: 'OU',

    // Filter Buttons
    applyFilter: 'Appliquer',
    resetFilter: 'Réinitialiser',
    clearFilter: 'Nettoyer',
    cancelFilter: 'Annuler',

    // Header of the Default Group Column
    group: 'Groupe',

    // Other
    loadingOoo: 'Loading...',
    loadingError: 'ERR',
    noRowsToShow: 'No Rows To Show',
    enabled: 'Enabled',

    // Enterprise Menu Aggregation and Status Bar
    to: 'to',
    of: 'of',
    page: 'Page',
    nextPage: 'Next Page',
    lastPage: 'Last Page',
    firstPage: 'First Page',
    previousPage: 'Previous Page',

    // ARIA
    ariaChecked: 'coché',
    ariaColumn: 'Colonne',
    ariaColumnGroup: 'Groupe colonne',
    ariaColumnFiltered: 'Colonne Filtrée',
    ariaColumnSelectAll: 'Sélectionner toutes les colonnes',
    ariaDateFilterInput: 'Champ filtrage de date',
    ariaDefaultListName: 'Liste',
    ariaFilterFromValue: 'Filter from value',
    ariaFilterInput: 'Filtre Champ',
    ariaFilterList: 'Filtre Liste',
    ariaFilterValue: 'Filtre Valeur',
    ariaFilterMenuOpen: 'Ouvrir Menu Filtre',
    ariaFilteringOperator: 'Opérateur filtrage',
    ariaHidden: 'caché',
    ariaIndeterminate: 'indéterminé',
    ariaMenuColumn: 'Appuyer sur ALT+BAS pour ouvrir le menu de colonne',
    ariaFilterColumn: 'Appuyer sur CTRL+ENTRER pour ouvrir les filtres',
    ariaRowDeselect: 'Appuyer sur ESPACE pour désélectionner cette ligne',
    ariaRowSelectAll: 'Appuyer sur ESPACE pour sélectionner toutes les lignes',
    ariaRowToggleSelection:
        'Appuyer sur Espace pour inverser les lignes sélectionnés',
    ariaRowSelect: 'Appuyer sur ESPACE pour sélectionner cette ligne',
    ariaSearch: 'Rechercher',
    ariaSortableColumn: 'Appuyer sur ENTRER pour trier',
    ariaToggleVisibility: 'Appuyer sur ESPACE pour changer la visibilité',
    ariaUnchecked: 'désélectionner',
    ariaVisible: 'visible',
    ariaSearchFilterValues: 'Recherché valeurs filtrées',

    // ARIA Labels for Dialogs
    ariaLabelColumnMenu: 'Menu de colonne',
    ariaLabelColumnFilter: 'Column Filter',
    ariaLabelDialog: 'Dialog',
    ariaLabelSelectField: 'Sélectionner Champ',
    ariaLabelTooltip: 'Tooltip',

    // Number Format (Status Bar, Pagination Panel)
    thousandSeparator: '.',
    decimalSeparator: ',',

    // Data types
    true: 'Vrai',
    false: 'Faux',
    invalidDate: 'Date invalide',
    invalidNumber: 'Nombre invalide',
    january: 'Janvier',
    february: 'Février',
    march: 'Mars',
    april: 'Avril',
    may: 'Mai',
    june: 'Juin',
    july: 'Juillet',
    august: 'Août',
    september: 'Septembre',
    october: 'Octobre',
    november: 'Novembre',
    december: 'Décembre',
};
