/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback, useRef, useState } from 'react';
import { Grid } from '@mui/material';
import { GridTableRef } from '../../components/Grid';
import { UserInfos } from '../../services';
import { RowClickedEvent } from 'ag-grid-community';
import UserModificationDialog from './modification/user-modification-dialog';
import UsersTable from './users-table';
import AddUserDialog from './add-user-dialog';

const UsersPage: FunctionComponent = () => {
    const gridRef = useRef<GridTableRef<UserInfos>>(null);
    const gridContext = gridRef.current?.context;
    const [openUserModificationDialog, setOpenUserModificationDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<UserInfos>();

    const [openAddUserDialog, setOpenAddUserDialog] = useState(false);

    const handleCloseUserModificationDialog = useCallback(() => {
        setOpenUserModificationDialog(false);
        setEditingUser(undefined);
    }, []);

    const handleUpdateUserModificationDialog = useCallback(() => {
        gridContext?.refresh?.();
        handleCloseUserModificationDialog();
    }, [gridContext, handleCloseUserModificationDialog]);

    const onRowClicked = useCallback((event: RowClickedEvent<UserInfos>) => {
        if (event.data) {
            setEditingUser(event.data);
            setOpenUserModificationDialog(true);
        }
    }, []);

    return (
        <>
            <Grid item container direction="column" spacing={2} component="section">
                <Grid item container xs sx={{ width: 1 }}>
                    <UsersTable
                        gridRef={gridRef}
                        onRowClicked={onRowClicked}
                        setOpenAddUserDialog={setOpenAddUserDialog}
                    />
                </Grid>
            </Grid>
            <AddUserDialog gridRef={gridRef} open={openAddUserDialog} setOpen={setOpenAddUserDialog} />
            <UserModificationDialog
                userInfos={editingUser}
                open={openUserModificationDialog}
                onClose={handleCloseUserModificationDialog}
                onUpdate={handleUpdateUserModificationDialog}
            />
        </>
    );
};
export default UsersPage;
