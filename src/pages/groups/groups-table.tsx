/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, RefObject, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { GroupAdd } from '@mui/icons-material';
import { GridButton, GridButtonDelete, GridTable, GridTableRef } from '../../components/Grid';
import { GroupInfos, UserAdminSrv, UserInfos } from '../../services';
import { ColDef, GetRowIdParams, RowClickedEvent, TextFilterParams } from 'ag-grid-community';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { useCsvExport } from '../common/use-csv-export';
import DeleteConfirmationDialog from '../common/delete-confirmation-dialog';
import { defaultColDef, defaultRowSelection } from '../common/table-config';
import MultiChipCellRenderer from '../common/multi-chip-cell-renderer';
import { useTableSelection } from '../../utils/hooks';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/reducer';

export interface GroupsTableProps {
    gridRef: RefObject<GridTableRef<GroupInfos> | null>;
    onRowClicked: (event: RowClickedEvent<GroupInfos>) => void;
    setOpenAddGroupDialog: (open: boolean) => void;
}

const GroupsTable: FunctionComponent<GroupsTableProps> = (props) => {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const { rowsSelection, onSelectionChanged, onFilterChanged } = useTableSelection<GroupInfos>();
    const [showDeletionDialog, setShowDeletionDialog] = useState(false);
    const language = useSelector((state: AppState) => state.computedLanguage);

    function getRowId(params: GetRowIdParams<GroupInfos>): string {
        return params.data.name;
    }

    const onAddButton = useCallback(() => props.setOpenAddGroupDialog(true), [props]);

    const deleteGroups = useCallback((): Promise<void> | undefined => {
        let groupNames = rowsSelection.map((group) => group.name);
        return UserAdminSrv.deleteGroups(groupNames)
            .catch((error) => {
                if (error.status === 422) {
                    snackError({
                        headerId: 'groups.table.integrity.error.delete',
                    });
                } else {
                    snackError({
                        messageTxt: error.message,
                        headerId: 'groups.table.error.delete',
                    });
                }
            })
            .then(() => props.gridRef?.current?.context?.refresh?.());
    }, [props.gridRef, rowsSelection, snackError]);

    const deleteGroupsDisabled = useMemo(() => rowsSelection.length <= 0, [rowsSelection.length]);

    const columns = useMemo(
        (): ColDef<GroupInfos>[] => [
            {
                field: 'name',
                cellDataType: 'text',
                flex: 2,
                lockVisible: true,
                filter: true,
                headerName: intl.formatMessage({ id: 'groups.table.id' }),
                headerTooltip: intl.formatMessage({
                    id: 'groups.table.id.description',
                }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<GroupInfos>,
                initialSort: 'asc',
                tooltipField: 'name',
            },
            {
                field: 'users',
                minWidth: 200,
                cellDataType: 'text',
                flex: 3,
                filter: true,
                headerName: intl.formatMessage({
                    id: 'groups.table.users',
                }),
                headerTooltip: intl.formatMessage({
                    id: 'groups.table.users.description',
                }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserInfos>,
                cellRenderer: MultiChipCellRenderer,
            },
        ],
        [intl]
    );

    const csvExportComponent = useCsvExport<GroupInfos>({
        gridRef: props.gridRef,
        columns,
        tableNameId: 'appBar.tabs.groups',
        intl,
        language,
    });

    return (
        <>
            <GridTable<GroupInfos, {}>
                ref={props.gridRef}
                dataLoader={UserAdminSrv.fetchGroups}
                columnDefs={columns}
                defaultColDef={defaultColDef}
                tooltipShowDelay={1000}
                gridId="table-groups"
                getRowId={getRowId}
                rowSelection={defaultRowSelection}
                onRowClicked={props.onRowClicked}
                onSelectionChanged={onSelectionChanged}
                onFilterChanged={onFilterChanged}
                alignedRightToolbarContent={csvExportComponent}
            >
                <GridButton
                    labelId="groups.table.toolbar.add.label"
                    textId="groups.table.toolbar.add"
                    startIcon={<GroupAdd fontSize="small" />}
                    color="primary"
                    onClick={onAddButton}
                />
                <GridButtonDelete onClick={() => setShowDeletionDialog(true)} disabled={deleteGroupsDisabled} />
            </GridTable>

            <DeleteConfirmationDialog
                open={showDeletionDialog}
                setOpen={setShowDeletionDialog}
                itemType={intl.formatMessage({ id: 'form.delete.dialog.group' })}
                itemNames={rowsSelection.map((user) => user.name)}
                deleteFunc={deleteGroups}
            />
        </>
    );
};
export default GroupsTable;
