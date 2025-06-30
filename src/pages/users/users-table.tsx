/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { type FunctionComponent, type RefObject, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { PersonAdd } from '@mui/icons-material';
import { GridButton, GridButtonDelete, GridTable, type GridTableRef } from '../../components/Grid';
import { type GroupInfos, UserAdminSrv, type UserInfos } from '../../services';
import type { ColDef, GetRowIdParams, RowClickedEvent, TextFilterParams } from 'ag-grid-community';
import { useSnackMessage } from '@gridsuite/commons-ui';
import DeleteConfirmationDialog from '../common/delete-confirmation-dialog';
import { defaultColDef, defaultRowSelection } from '../common/table-config';
import MultiChipCellRenderer from '../common/multi-chip-cell-renderer';
import { useTableSelection } from '../../utils/hooks';
import { CsvExport } from '@gridsuite/commons-ui';
import { useSelector } from 'react-redux';

export interface UsersTableProps {
    gridRef: RefObject<GridTableRef<UserInfos>>;
    onRowClicked: (event: RowClickedEvent<UserInfos>) => void;
    setOpenAddUserDialog: (open: boolean) => void;
}

const UsersTable: FunctionComponent<UsersTableProps> = (props) => {
    const intl = useIntl();
    const { snackError } = useSnackMessage();

    const { rowsSelection, onSelectionChanged, onFilterChanged } = useTableSelection<UserInfos>();
    const [showDeletionDialog, setShowDeletionDialog] = useState(false);
    const language = useSelector((state: AppState) => state.computedLanguage);

    function getRowId(params: GetRowIdParams<UserInfos>): string {
        return params.data.sub ?? '';
    }

    const onAddButton = useCallback(() => props.setOpenAddUserDialog(true), [props]);

    const deleteUsers = useCallback(() => {
        let subs = rowsSelection.map((user) => user.sub);
        return UserAdminSrv.deleteUsers(subs)
            .catch((error) =>
                snackError({
                    messageTxt: error.message,
                    headerId: 'users.table.error.delete',
                })
            )
            .then(() => props.gridRef?.current?.context?.refresh?.());
    }, [props.gridRef, rowsSelection, snackError]);

    const deleteUsersDisabled = useMemo(() => rowsSelection.length <= 0, [rowsSelection.length]);

    const columns = useMemo(
        (): ColDef<UserInfos>[] => [
            {
                field: 'sub',
                cellDataType: 'text',
                flex: 1,
                lockVisible: true,
                filter: true,
                headerName: intl.formatMessage({ id: 'users.table.id' }),
                headerTooltip: intl.formatMessage({ id: 'users.table.id.description' }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserInfos>,
                initialSort: 'asc',
                tooltipField: 'sub',
            },
            {
                field: 'profileName',
                cellDataType: 'text',
                flex: 2,
                filter: true,
                headerName: intl.formatMessage({ id: 'users.table.profileName' }),
                headerTooltip: intl.formatMessage({ id: 'users.table.profileName.description' }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<UserInfos>,
                tooltipField: 'profileName',
            },
            {
                field: 'groups',
                minWidth: 200,
                cellDataType: 'text',
                flex: 4,
                filter: true,
                headerName: intl.formatMessage({ id: 'users.table.groups' }),
                headerTooltip: intl.formatMessage({ id: 'users.table.groups.description' }),
                filterParams: {
                    caseSensitive: false,
                    trimInput: true,
                } as TextFilterParams<GroupInfos>,
                cellRenderer: MultiChipCellRenderer,
            },
        ],
        [intl]
    );

    const csvExportComponent = useMemo(
        () => (
            <CsvExport
                gridRef={props.gridRef}
                columns={columns}
                tableName={intl.formatMessage({ id: 'appBar.tabs.users' })}
                disabled={false}
                skipColumnHeaders={false}
                language={language}
                exportDataAsCsv={(params) => props.gridRef?.current?.aggrid?.api?.exportDataAsCsv(params)}
            />
        ),
        [props.gridRef, columns, intl, language]
    );

    return (
        <>
            <GridTable<UserInfos, {}>
                ref={props.gridRef}
                dataLoader={UserAdminSrv.fetchUsers}
                columnDefs={columns}
                defaultColDef={defaultColDef}
                gridId="table-users"
                getRowId={getRowId}
                rowSelection={defaultRowSelection}
                onRowClicked={props.onRowClicked}
                onSelectionChanged={onSelectionChanged}
                onFilterChanged={onFilterChanged}
                tooltipShowDelay={1000}
                alignedRightToolbarContent={csvExportComponent}
            >
                <GridButton
                    labelId="users.table.toolbar.add.label"
                    textId="users.table.toolbar.add"
                    startIcon={<PersonAdd fontSize="small" />}
                    color="primary"
                    onClick={onAddButton}
                />
                <GridButtonDelete onClick={() => setShowDeletionDialog(true)} disabled={deleteUsersDisabled} />
            </GridTable>

            <DeleteConfirmationDialog
                open={showDeletionDialog}
                setOpen={setShowDeletionDialog}
                itemType={intl.formatMessage({ id: 'form.delete.dialog.user' })}
                itemNames={rowsSelection.map((user) => user.sub)}
                deleteFunc={deleteUsers}
            />
        </>
    );
};
export default UsersTable;
