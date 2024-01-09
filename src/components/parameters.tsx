/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { CSSObject, Theme } from '@emotion/react';
import { updateConfigParameter } from '../utils/rest-api';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { AppState } from '../redux/reducer';
import { TypographyTypeMap } from '@mui/material/Typography/Typography';

const styles = {
    title: (theme: Theme): CSSObject => ({
        padding: theme.spacing(2),
    }),
    grid: (theme: Theme): CSSObject => ({
        padding: theme.spacing(2),
    }),
    controlItem: {
        justifyContent: 'flex-end',
    } as CSSObject,
    button: {
        marginBottom: '30px',
    } as CSSObject,
};

export function useParameterState<
    K extends keyof AppState,
    T extends AppState[K]
>(paramName: K): [T, (value: T) => void] {
    const { snackError } = useSnackMessage();

    const paramGlobalState = useSelector((state: AppState) => state[paramName]);

    const [paramLocalState, setParamLocalState] = useState(paramGlobalState);

    useEffect(() => {
        setParamLocalState(paramGlobalState);
    }, [paramGlobalState]);

    const handleChangeParamLocalState = useCallback(
        (value: any) => {
            setParamLocalState(value);
            updateConfigParameter(paramName, value).catch((error) => {
                setParamLocalState(paramGlobalState);
                snackError({
                    messageTxt: error.message,
                    headerId: 'paramsChangingError',
                });
            });
        },
        [paramName, snackError, setParamLocalState, paramGlobalState]
    );

    return [paramLocalState, handleChangeParamLocalState];
}

const Parameters: FunctionComponent<
    PropsWithChildren<{
        showParameters: boolean;
        hideParameters: (event: object, reason?: string) => void; //(event: {}, reason: 'backdropClick' | 'escapeKeyDown'): void;  //(event: MouseEvent<Element>): void
    }>
> = (props) => {
    const [tabIndex, setTabIndex] = useState(0);

    function TabPanel<T = number>(
        props: PropsWithChildren<
            TypographyTypeMap<{ index: T; value: T }>['props']
        >
    ): ReactElement {
        const { children, value, index, ...other } = props;
        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box p={3}>{children}</Box>}
            </Typography>
        );
    }

    function GUITab(): ReactElement {
        return <Grid container spacing={2} sx={styles.grid} />;
    }

    return (
        <Dialog
            open={props.showParameters}
            onClose={props.hideParameters}
            aria-labelledby="form-dialog-title"
            maxWidth={'md'}
            fullWidth={true}
        >
            <DialogTitle id="form-dialog-title">
                <Typography component="span" variant="h5" sx={styles.title}>
                    <FormattedMessage id="parameters" />
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Container maxWidth="md">
                    <Tabs
                        value={tabIndex}
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        onChange={(event, newValue) => setTabIndex(newValue)}
                        aria-label="parameters"
                    >
                        <Tab label={<FormattedMessage id="gui" />} />
                    </Tabs>

                    <TabPanel value={tabIndex} index={0}>
                        <GUITab />
                    </TabPanel>

                    <Grid item xs={12}>
                        <Button
                            onClick={props.hideParameters}
                            variant="contained"
                            color="primary"
                            sx={styles.button}
                        >
                            <FormattedMessage id="close" />
                        </Button>
                    </Grid>
                </Container>
            </DialogContent>
        </Dialog>
    );
};

export default Parameters;
