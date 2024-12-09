/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
// from https://github.com/ag-grid/ag-grid/blob/latest/documentation/ag-grid-docs/src/content/docs/localisation/_examples/localisation/locale.en.js
/* eslint-disable no-template-curly-in-string */

export const AG_GRID_LOCALE_FR: Record<string, string> = {
    // Set Filter
    selectAll: '(Tout sélectionner)',
    selectAllSearchResults: '(Sélectionner tout les résultats)',
    addCurrentSelectionToFilter: 'Ajouter la sélection au filtre',
    searchOoo: 'Rechercher ...',
    blanks: '(Vide)',
    noMatches: 'Pas de correspondance',

    // Number Filter & Text Filter
    filterOoo: 'Filtre...',
    equals: 'Égal',
    notEqual: 'Pas égal à',
    blank: 'Vide',
    notBlank: 'Non vide',
    empty: 'Choix ...',

    // Number Filter
    lessThan: 'Moins que',
    greaterThan: 'Plus que',
    lessThanOrEqual: 'Moins ou égal à',
    greaterThanOrEqual: 'Plus ou égal à',
    inRange: 'Entre',
    inRangeStart: 'De',
    inRangeEnd: 'À',

    // Text Filter
    contains: 'Contient',
    notContains: 'Ne contient pas',
    startsWith: 'Commence par',
    endsWith: 'Se termine par',

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
    loadingOoo: 'Chargement ...',
    loadingError: 'ERR',
    noRowsToShow: 'Pas de lignes à montrer',
    enabled: 'Activer',

    // Enterprise Menu Aggregation and Status Bar
    to: 'à',
    of: 'de',
    page: 'Page',
    nextPage: 'Page suivante',
    lastPage: 'Dernière Page',
    firstPage: 'Première Page',
    previousPage: 'Page précédente',

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
    ariaRowToggleSelection: 'Appuyer sur Espace pour inverser les lignes sélectionnés',
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
    ariaLabelDialog: 'Dialogue',
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
