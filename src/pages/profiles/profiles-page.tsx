/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback, useRef, useState } from 'react';
import { Grid } from '@mui/material';
import { GridTableRef } from '../../components/Grid';
import { UserProfile } from '../../services';
import { RowDoubleClickedEvent } from 'ag-grid-community';
import ProfileModificationDialog from './modification/profile-modification-dialog';
import { UUID } from 'crypto';
import ProfilesTable from './profiles-table';
import AddProfileDialog from './add-profile-dialog';

const ProfilesPage: FunctionComponent = () => {
    const gridRef = useRef<GridTableRef<UserProfile>>(null);
    const gridContext = gridRef.current?.context;
    const [openProfileModificationDialog, setOpenProfileModificationDialog] = useState(false);
    const [editingProfileId, setEditingProfileId] = useState<UUID>();

    const [openAddProfileDialog, setOpenAddProfileDialog] = useState(false);

    const handleCloseProfileModificationDialog = useCallback(() => {
        setOpenProfileModificationDialog(false);
        setEditingProfileId(undefined);
    }, []);

    const handleUpdateProfileModificationDialog = useCallback(() => {
        gridContext?.refresh?.();
        handleCloseProfileModificationDialog();
    }, [gridContext, handleCloseProfileModificationDialog]);

    const onRowDoubleClicked = useCallback((event: RowDoubleClickedEvent<UserProfile>) => {
        if (event.data) {
            setEditingProfileId(event.data.id);
            setOpenProfileModificationDialog(true);
        }
    }, []);

    return (
        <Grid item container direction="column" spacing={2} component="section">
            <Grid item container xs sx={{ width: 1 }}>
                <ProfileModificationDialog
                    profileId={editingProfileId}
                    open={openProfileModificationDialog}
                    onClose={handleCloseProfileModificationDialog}
                    onUpdate={handleUpdateProfileModificationDialog}
                />
                <ProfilesTable
                    gridRef={gridRef}
                    onRowDoubleClicked={onRowDoubleClicked}
                    setOpenAddProfileDialog={setOpenAddProfileDialog}
                />
                <AddProfileDialog gridRef={gridRef} open={openAddProfileDialog} setOpen={setOpenAddProfileDialog} />
            </Grid>
        </Grid>
    );
};
export default ProfilesPage;
