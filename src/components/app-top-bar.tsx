/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {
    forwardRef,
    FunctionComponent,
    useEffect,
    useState,
} from 'react';
import { LIGHT_THEME, logout, TopBar } from '@gridsuite/commons-ui';
import Parameters, { useParameterState } from './parameters';
import { APP_NAME, PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params';
import { useDispatch, useSelector } from 'react-redux';
import { AppsMetadataSrv, StudySrv } from '../services';
import { NavLink, useNavigate } from 'react-router-dom';
import { ReactComponent as GridAdminLogoLight } from '../images/GridAdmin_logo_light.svg';
import { ReactComponent as GridAdminLogoDark } from '../images/GridAdmin_logo_dark.svg';
import AppPackage from '../../package.json';
import { AppState } from '../redux/reducer';
import { UserManager } from 'oidc-client';
import { FormattedMessage } from 'react-intl';
import { Tab, TabProps, Tabs, TabsProps } from '@mui/material';
import { History, PeopleAlt } from '@mui/icons-material';

export type AppTopBarProps = {
    user?: AppState['user'];
    userManager: {
        instance: UserManager | null;
        error: string | null;
    };
};
const AppTopBar: FunctionComponent<AppTopBarProps> = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [tabSelected, setTabSelected] = useState<TabsProps['value']>(false);
    const tabs = [
        {
            to: '/users',
            icon: <PeopleAlt />,
            label: <FormattedMessage id="users" />,
        },
        {
            to: '/connections',
            icon: <History />,
            label: <FormattedMessage id="connections" />,
        },
    ];

    const [appsAndUrls, setAppsAndUrls] = useState<
        Awaited<ReturnType<typeof AppsMetadataSrv.fetchAppsAndUrls>>
    >([]);

    const theme = useSelector((state: AppState) => state[PARAM_THEME]);
    const [themeLocal, handleChangeTheme] = useParameterState(PARAM_THEME);
    const [languageLocal, handleChangeLanguage] =
        useParameterState(PARAM_LANGUAGE);

    const [showParameters, setShowParameters] = useState(false);

    useEffect(() => {
        if (props.user !== null) {
            AppsMetadataSrv.fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [props.user]);

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
                onLogoutClick={() =>
                    logout(dispatch, props.userManager.instance)
                }
                onLogoClick={() => navigate('/', { replace: true })}
                user={props.user}
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
                {props.user && (
                    <nav>
                        <Tabs
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="Main navigation menu"
                            disabled={!!props.user}
                            value={tabSelected}
                        >
                            {tabs.map((value, index, array) => (
                                <TabNavLink
                                    tabValue={index}
                                    setTabSelected={setTabSelected}
                                    href={value.to}
                                    icon={value.icon}
                                    label={value.label}
                                />
                            ))}
                        </Tabs>
                    </nav>
                )}
            </TopBar>
            <Parameters
                showParameters={showParameters}
                hideParameters={() => setShowParameters(false)}
            />
        </>
    );
};
export default AppTopBar;

const TabNavLink: FunctionComponent<{
    icon: TabProps['icon'];
    label: TabProps['label'];
    href: string;
    tabValue: TabsProps['value'];
    setTabSelected: (tab: TabsProps['value']) => void;
}> = (props, context) => {
    const fnActive = () => props.setTabSelected(props.tabValue);
    return (
        <Tab
            icon={props.icon}
            iconPosition="start"
            label={props.label}
            href={props.href}
            LinkComponent={forwardRef((props, ref) => (
                <NavLink
                    innerRef={ref}
                    to={props.href}
                    {...props}
                    style={({ isActive, isPending }) => {
                        isActive && fnActive();
                        return props.style;
                    }}
                />
            ))}
        />
    );
};
