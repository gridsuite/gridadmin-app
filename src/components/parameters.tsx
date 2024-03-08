/*
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
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
    TypographyTypeMap,
} from '@mui/material';
import { CSSObject, Theme } from '@emotion/react';
import { ConfigSrv } from '../services';
import { useSnackMessage } from '@gridsuite/commons-ui';
import { AppState, AppStateKey } from '../redux/reducer';

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

export function useParameterState<K extends AppStateKey>(
    paramName: K
): [AppState[K], (value: AppState[K]) => void] {
    const { snackError } = useSnackMessage();
    const paramGlobalState = useSelector((state: AppState) => state[paramName]);
    const [paramLocalState, setParamLocalState] = useState(paramGlobalState);

    useEffect(() => {
        setParamLocalState(paramGlobalState);
    }, [paramGlobalState]);

    const handleChangeParamLocalState = useCallback(
        (value: AppState[K]) => {
            setParamLocalState(value);
            ConfigSrv.updateConfigParameter(paramName, value as string) //TODO how to check/cast?
                .catch((error) => {
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

function GUITab(): ReactElement {
    return <Grid container spacing={2} sx={styles.grid} />;
}

type TabPanelProps = PropsWithChildren<
    TypographyTypeMap<{ index: number; value: number }, 'div'>['props']
>;
function TabPanel({
    children,
    value,
    index,
    ...typoProps
}: TabPanelProps): ReactElement {
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...typoProps}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

export type ParametersProps = PropsWithChildren<{
    showParameters: boolean;
    hideParameters: () => void;
}>;
const Parameters: FunctionComponent<ParametersProps> = (props) => {
    const [tabIndex, setTabIndex] = useState(0);

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
