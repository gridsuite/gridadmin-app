import { AppBar, Box, Toolbar } from '@mui/material';
import { FunctionComponent, PropsWithChildren } from 'react';

export const CustomToolbar: FunctionComponent<PropsWithChildren> = (props) => {
    return (
        <AppBar position="static" color="default">
            <Toolbar
                variant="dense"
                disableGutters
                sx={(theme) => ({
                    marginLeft: 1,
                    '& > *': {
                        // mui's button set it own margin on itself...
                        marginRight: `${theme.spacing(1)} !important`,
                        '&:last-child': {
                            marginRight: '0 !important',
                        },
                    },
                })}
            >
                {props.children}
                <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
        </AppBar>
    );
};
