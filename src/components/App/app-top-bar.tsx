/*
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
import { capitalize, Tab, TabProps, Tabs, useTheme } from '@mui/material';
import { PeopleAlt } from '@mui/icons-material';
import { logout, TopBar } from '@gridsuite/commons-ui';
import { useParameterState } from '../parameters';
import {
    APP_NAME,
    PARAM_LANGUAGE,
    PARAM_THEME,
} from '../../utils/config-params';
import { NavLink, useMatches, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AppsMetadataSrv, MetadataJson, StudySrv } from '../../services';
import { ReactComponent as GridAdminLogoLight } from '../../images/GridAdmin_logo_light.svg';
import { ReactComponent as GridAdminLogoDark } from '../../images/GridAdmin_logo_dark.svg';
import AppPackage from '../../../package.json';
import { AppState } from '../../redux/reducer';
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
    const theme = useTheme();
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

    const [themeLocal, handleChangeTheme] = useParameterState(PARAM_THEME);
    const [languageLocal, handleChangeLanguage] =
        useParameterState(PARAM_LANGUAGE);

    const [appsAndUrls, setAppsAndUrls] = useState<MetadataJson[]>([]);
    useEffect(() => {
        if (user !== null) {
            AppsMetadataSrv.fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [user]);

    return (
        <TopBar
            appName={capitalize(APP_NAME)}
            appColor="#FD3745"
            appLogo={
                theme.palette.mode === 'light' ? (
                    <GridAdminLogoLight />
                ) : (
                    <GridAdminLogoDark />
                )
            }
            appVersion={AppPackage.version}
            appLicense={AppPackage.license}
            onLogoutClick={() => logout(dispatch, userManagerInstance)}
            onLogoClick={() => navigate('/', { replace: true })}
            user={user}
            appsAndUrls={appsAndUrls}
            globalVersionPromise={() =>
                AppsMetadataSrv.fetchVersion().then((res) => res?.deployVersion)
            }
            additionalModulesPromise={StudySrv.getServersInfos}
            onThemeClick={handleChangeTheme}
            theme={themeLocal}
            onLanguageClick={handleChangeLanguage}
            language={languageLocal}
        >
            <Tabs
                component="nav"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Main navigation menu"
                sx={{ visibility: !user ? 'hidden' : undefined }}
                value={selectedTabValue}
            >
                {[...tabs.values()]}
            </Tabs>
        </TopBar>
    );
};
export default AppTopBar;
