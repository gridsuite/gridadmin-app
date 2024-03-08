/*
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { LIGHT_THEME, logout, TopBar } from '@gridsuite/commons-ui';
import Parameters, { useParameterState } from './parameters';
import { APP_NAME, PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params';
import { useDispatch, useSelector } from 'react-redux';
import { AppsMetadataSrv, MetadataJson, StudySrv } from '../services';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as PowsyblLogo } from '../images/powsybl_logo.svg';
import AppPackage from '../../package.json';
import { AppState } from '../redux/reducer';

export type AppTopBarProps = {
    user?: AppState['user'];
    userManager: {
        instance: unknown | null;
        error: string | null;
    };
};

const AppTopBar: FunctionComponent<AppTopBarProps> = (props) => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [appsAndUrls, setAppsAndUrls] = useState<MetadataJson[]>([]);

    const theme = useSelector((state: AppState) => state[PARAM_THEME]);

    const [themeLocal, handleChangeTheme] = useParameterState(PARAM_THEME);

    const [languageLocal, handleChangeLanguage] =
        useParameterState(PARAM_LANGUAGE);

    const [showParameters, setShowParameters] = useState(false);
    const displayParameters = useCallback(() => setShowParameters(true), []);
    const hideParameters = useCallback(() => setShowParameters(false), []);

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
                appColor="grey"
                appLogo={
                    theme === LIGHT_THEME ? (
                        <PowsyblLogo /> //GridAdminLogoLight
                    ) : (
                        <PowsyblLogo /> //GridAdminLogoDark
                    )
                }
                appVersion={AppPackage.version}
                appLicense={AppPackage.license}
                onParametersClick={displayParameters}
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
            />
            <Parameters
                showParameters={showParameters}
                hideParameters={hideParameters}
            />
        </>
    );
};
export default AppTopBar;
