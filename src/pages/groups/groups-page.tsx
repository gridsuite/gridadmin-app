/*
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback, useRef, useState } from 'react';
import { Grid } from '@mui/material';
import { GridTableRef } from '../../components/Grid';
import { GroupInfos } from '../../services';
import { RowClickedEvent } from 'ag-grid-community';
import GroupModificationDialog from './modification/group-modification-dialog';
import GroupsTable from './groups-table';
import AddGroupDialog from './add-group-dialog';

const GroupsPage: FunctionComponent = () => {
    const gridRef = useRef<GridTableRef<GroupInfos>>(null);
    const gridContext = gridRef.current?.context;
    const [openGroupModificationDialog, setOpenGroupModificationDialog] = useState(false);
    const [editingGroup, setEditingGroup] = useState<GroupInfos>();

    const [openAddGroupDialog, setOpenAddGroupDialog] = useState(false);

    const handleCloseGroupModificationDialog = useCallback(() => {
        setOpenGroupModificationDialog(false);
        setEditingGroup(undefined);
    }, []);

    const handleUpdateGroupModificationDialog = useCallback(() => {
        gridContext?.refresh?.();
        handleCloseGroupModificationDialog();
    }, [gridContext, handleCloseGroupModificationDialog]);

    const onRowClicked = useCallback((event: RowClickedEvent<GroupInfos>) => {
        if (event.data) {
            setEditingGroup(event.data);
            setOpenGroupModificationDialog(true);
        }
    }, []);

    return (
        <>
            <Grid item container direction="column" spacing={2} component="section" height={'100%'}>
                <Grid item container xs sx={{ width: 1 }}>
                    <GroupsTable
                        gridRef={gridRef}
                        onRowClicked={onRowClicked}
                        setOpenAddGroupDialog={setOpenAddGroupDialog}
                    />
                </Grid>
            </Grid>
            <AddGroupDialog gridRef={gridRef} open={openAddGroupDialog} setOpen={setOpenAddGroupDialog} />
            <GroupModificationDialog
                groupInfos={editingGroup}
                open={openGroupModificationDialog}
                onClose={handleCloseGroupModificationDialog}
                onUpdate={handleUpdateGroupModificationDialog}
            />
        </>
    );
};
export default GroupsPage;
