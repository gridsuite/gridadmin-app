/*
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useEffect, useState } from 'react';
import { capitalize, useTheme } from '@mui/material';
import { logout, TopBar } from '@gridsuite/commons-ui';
import { useParameterState } from '../parameters';
import {
    APP_NAME,
    PARAM_LANGUAGE,
    PARAM_THEME,
} from '../../utils/config-params';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppsMetadataSrv, MetadataJson, StudySrv } from '../../services';
import { ReactComponent as GridAdminLogoLight } from '../../images/GridAdmin_logo_light.svg';
import { ReactComponent as GridAdminLogoDark } from '../../images/GridAdmin_logo_dark.svg';
import AppPackage from '../../../package.json';
import { AppState } from '../../redux/reducer';

export type AppTopBarProps = {
    user?: AppState['user'];
    userManager: {
        instance: unknown | null;
        error: string | null;
    };
};

const AppTopBar: FunctionComponent<AppTopBarProps> = (props) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();

    const [appsAndUrls, setAppsAndUrls] = useState<MetadataJson[]>([]);

    const [themeLocal, handleChangeTheme] = useParameterState(PARAM_THEME);
    const [languageLocal, handleChangeLanguage] =
        useParameterState(PARAM_LANGUAGE);

    useEffect(() => {
        if (props.user !== null) {
            AppsMetadataSrv.fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [props.user]);

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
            onLogoutClick={() => logout(dispatch, props.userManager.instance)}
            onLogoClick={() => navigate('/', { replace: true })}
            user={props.user}
            appsAndUrls={appsAndUrls}
            globalVersionPromise={() =>
                AppsMetadataSrv.fetchVersion().then((res) => res?.deployVersion)
            }
            additionalModulesPromise={StudySrv.getServersInfos}
            onThemeClick={handleChangeTheme}
            theme={themeLocal}
            onLanguageClick={handleChangeLanguage}
            language={languageLocal}
        />
    );
};
export default AppTopBar;
