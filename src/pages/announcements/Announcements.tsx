/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import { Button, Grid, List } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { CreateAnnouncementDialog } from './CreateAnnouncementDialog';
import { useAnnouncements } from './useAnnouncements';
import { ListItemAnnouncement } from './ListItemAnnouncement';
import { CustomToolbar } from '../utils/CustomToolbar';
import { ID } from './utils';

const Announcements: FunctionComponent = () => {
    const intl = useIntl();
    const [openDialog, setOpenDialog] = useState(false);
    const announcements = useAnnouncements();

    return (
        <Grid item container spacing={2} direction="column">
            <Grid item>
                <CustomToolbar>
                    <Button
                        onClick={() => setOpenDialog(true)}
                        variant="outlined"
                        startIcon={<AddCircleOutline />}
                        size="small"
                    >
                        {intl.formatMessage({ id: 'announcements.add' })}
                    </Button>
                </CustomToolbar>
            </Grid>
            <CreateAnnouncementDialog open={openDialog} onClose={() => setOpenDialog(false)} />
            <Grid item>
                <List sx={{ maxWidth: 1400 }}>
                    {announcements.map((announcement) => (
                        <ListItemAnnouncement key={announcement[ID]} {...announcement} />
                    ))}
                </List>
            </Grid>
        </Grid>
    );
};
export default Announcements;
