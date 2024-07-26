import { getUser } from '../redux/store';
import {
    AppsMetadataComSvc,
    ConfigNotificationComSvc,
    ExploreComSvc,
    setCommonServices,
    StudyComSvc,
} from '@gridsuite/commons-ui';
import AppLocalSvc from './app-local';
import ConfigSvc from './config';
import DirectorySvc from './directory';
import UserAdminSvc from './user-admin';

export type { EnvJson } from './app-local';
export type { UserInfos, UserProfile } from './user-admin';

export const appLocalSrv = new AppLocalSvc(),
    appsMetadataSrv = new AppsMetadataComSvc(appLocalSrv),
    configSrv = new ConfigSvc(),
    configNotificationSrv = new ConfigNotificationComSvc(getUser),
    directorySrv = new DirectorySvc(),
    exploreSrv = new ExploreComSvc(getUser),
    studySrv = new StudyComSvc(getUser),
    userAdminSrv = new UserAdminSvc();

setCommonServices(
    appLocalSrv,
    appsMetadataSrv,
    configSrv,
    configNotificationSrv,
    directorySrv,
    exploreSrv,
    studySrv,
    userAdminSrv
);
