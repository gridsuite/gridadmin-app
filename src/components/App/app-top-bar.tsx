/*
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    type AnchorHTMLAttributes,
    forwardRef,
    type FunctionComponent,
    type ReactElement,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { capitalize, Tab, Tabs, useTheme } from '@mui/material';
import { Groups, ManageAccounts, PeopleAlt } from '@mui/icons-material';
import { fetchAppsMetadata, logout, Metadata, TopBar } from '@gridsuite/commons-ui';
import { useParameterState } from '../parameters';
import { APP_NAME, PARAM_LANGUAGE, PARAM_THEME } from '../../utils/config-params';
import { NavLink, type To, useMatches, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AppsMetadataSrv, StudySrv } from '../../services';
import GridAdminLogoLight from '../../images/GridAdmin_logo_light.svg?react';
import GridAdminLogoDark from '../../images/GridAdmin_logo_dark.svg?react';
import AppPackage from '../../../package.json';
import { AppState } from '../../redux/reducer';
import { AppDispatch } from '../../redux/store';
import { MainPaths } from '../../routes/utils';

const tabs = new Map<MainPaths, ReactElement>([
    [
        MainPaths.users,
        <Tab
            icon={<PeopleAlt />}
            label={<FormattedMessage id="appBar.tabs.users" />}
            href={`/${MainPaths.users}`}
            value={MainPaths.users}
            key={`tab-${MainPaths.users}`}
            iconPosition="start"
            LinkComponent={forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => (
                <NavLink ref={ref} to={props.href as To} {...props} />
            ))}
        />,
    ],
    [
        MainPaths.profiles,
        <Tab
            icon={<ManageAccounts />}
            label={<FormattedMessage id="appBar.tabs.profiles" />}
            href={`/${MainPaths.profiles}`}
            value={MainPaths.profiles}
            key={`tab-${MainPaths.profiles}`}
            iconPosition="start"
            LinkComponent={forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => (
                <NavLink ref={ref} to={props.href as To} {...props} />
            ))}
        />,
    ],
    [
        MainPaths.groups,
        <Tab
            icon={<Groups />}
            label={<FormattedMessage id="appBar.tabs.groups" />}
            href={`/${MainPaths.groups}`}
            value={MainPaths.groups}
            key={`tab-${MainPaths.groups}`}
            iconPosition="start"
            LinkComponent={forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => (
                <NavLink ref={ref} to={props.href as To} {...props} />
            ))}
        />,
    ],
]);

const AppTopBar: FunctionComponent = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: AppState) => state.user);
    const userManagerInstance = useSelector((state: AppState) => state.userManager?.instance);

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
    const [languageLocal, handleChangeLanguage] = useParameterState(PARAM_LANGUAGE);

    const [appsAndUrls, setAppsAndUrls] = useState<Metadata[]>([]);
    useEffect(() => {
        if (user !== null) {
            fetchAppsMetadata().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [user]);

    return (
        <TopBar
            appName={capitalize(APP_NAME)}
            appColor="#FD3745"
            appLogo={theme.palette.mode === 'light' ? <GridAdminLogoLight /> : <GridAdminLogoDark />}
            appVersion={AppPackage.version}
            appLicense={AppPackage.license}
            onLogoutClick={() => logout(dispatch, userManagerInstance)}
            onLogoClick={() => navigate('/', { replace: true })}
            user={user ?? undefined}
            appsAndUrls={appsAndUrls}
            globalVersionPromise={() => AppsMetadataSrv.fetchVersion().then((res) => res?.deployVersion ?? 'unknown')}
            additionalModulesPromise={StudySrv.getServersInfos}
            onThemeClick={handleChangeTheme}
            theme={themeLocal}
            onLanguageClick={handleChangeLanguage}
            language={languageLocal}
            developerMode={false} // TODO: set as optional in commons-ui
        >
            <Tabs
                component="nav"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Main navigation menu"
                sx={{
                    visibility: !user ? 'hidden' : undefined,
                    flexGrow: 1,
                }}
                value={selectedTabValue}
            >
                {[...tabs.values()]}
            </Tabs>
        </TopBar>
    );
};
export default AppTopBar;
