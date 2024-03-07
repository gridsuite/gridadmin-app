/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    forwardRef,
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { LIGHT_THEME, logout, TopBar } from '@gridsuite/commons-ui';
import Parameters, { useParameterState } from '../parameters';
import {
    APP_NAME,
    PARAM_LANGUAGE,
    PARAM_THEME,
} from '../../utils/config-params';
import { useDispatch, useSelector } from 'react-redux';
import { AppsMetadataSrv, StudySrv } from '../../services';
import { NavLink, useMatches, useNavigate } from 'react-router-dom';
import { ReactComponent as GridAdminLogoLight } from '../../images/GridAdmin_logo_light.svg';
import { ReactComponent as GridAdminLogoDark } from '../../images/GridAdmin_logo_dark.svg';
import AppPackage from '../../../package.json';
import { AppState } from '../../redux/reducer';
import { FormattedMessage } from 'react-intl';
import { Tab, TabProps, Tabs } from '@mui/material';
import { PeopleAlt } from '@mui/icons-material';
import { MainPaths } from '../../routes';

const TabNavLink: FunctionComponent<TabProps & { href: string }> = (
    props,
    context
) => (
    <Tab
        {...props}
        iconPosition="start"
        LinkComponent={forwardRef((props, ref) => (
            <NavLink ref={ref} to={props.href} {...props} />
        ))}
    />
);

const tabs = new Map<MainPaths, ReactElement>([
    [
        MainPaths.users,
        <TabNavLink
            icon={<PeopleAlt />}
            label={<FormattedMessage id="appBar.tabs.users" />}
            href={`/${MainPaths.users}`}
            value={MainPaths.users}
            key={`tab-${MainPaths.users}`}
        />,
    ],
]);

const AppTopBar: FunctionComponent = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: AppState) => state.user);
    const userManagerInstance = useSelector(
        (state: AppState) => state.userManager?.instance
    );

    const navigate = useNavigate();
    const matches = useMatches();
    const selectedTabValue = useMemo(() => {
        const handle: any = matches
            .map((match) => match.handle)
            .filter((handle: any) => !!handle?.appBar_tab)
            .shift();
        const tabValue: MainPaths = handle?.appBar_tab;
        return tabValue && tabs.has(tabValue) ? tabValue : false;
    }, [matches]);

    const [appsAndUrls, setAppsAndUrls] = useState<
        Awaited<ReturnType<typeof AppsMetadataSrv.fetchAppsAndUrls>>
    >([]);

    const theme = useSelector((state: AppState) => state[PARAM_THEME]);
    const [themeLocal, handleChangeTheme] = useParameterState(PARAM_THEME);
    const [languageLocal, handleChangeLanguage] =
        useParameterState(PARAM_LANGUAGE);

    const [showParameters, setShowParameters] = useState(false);

    useEffect(() => {
        if (user !== null) {
            AppsMetadataSrv.fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [user]);

    return (
        <>
            <TopBar
                appName={APP_NAME}
                appColor="#FD3745"
                appLogo={
                    theme === LIGHT_THEME ? (
                        <GridAdminLogoLight />
                    ) : (
                        <GridAdminLogoDark />
                    )
                }
                appVersion={AppPackage.version}
                appLicense={AppPackage.license}
                onParametersClick={() => setShowParameters(true)}
                onLogoutClick={() => logout(dispatch, userManagerInstance)}
                onLogoClick={() => navigate('/', { replace: true })}
                user={user}
                appsAndUrls={appsAndUrls}
                globalVersionPromise={() =>
                    AppsMetadataSrv.fetchVersion().then(
                        (res) => res?.deployVersion
                    )
                }
                additionalModulesPromise={StudySrv.getServersInfos}
                onThemeClick={handleChangeTheme}
                theme={themeLocal}
                onLanguageClick={handleChangeLanguage}
                language={languageLocal}
            >
                <nav>
                    <Tabs
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="Main navigation menu"
                        sx={{ visibility: !user ? 'hidden' : undefined }}
                        value={selectedTabValue}
                    >
                        {[...tabs.values()]}
                    </Tabs>
                </nav>
            </TopBar>
            <Parameters
                showParameters={showParameters}
                hideParameters={() => setShowParameters(false)}
            />
        </>
    );
};
export default AppTopBar;
