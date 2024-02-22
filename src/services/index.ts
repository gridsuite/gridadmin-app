import * as Config from './config';
import * as ConfigNotif from './config-notification';
import * as AppsMetadata from './apps-metadata';
import * as Study from './study';
import * as UserAdmin from './user-admin';

const _ = {
    ...Config,
    ...ConfigNotif,
    ...AppsMetadata,
    ...Study,
    ...UserAdmin,
};
export default _;

export * as ConfigSrv from './config';
export type * from './config';

export * as ConfigNotif from './config-notification';
export type * from './config-notification';

export * as AppsMetadataSrv from './apps-metadata';
export type * from './apps-metadata';

export * as StudySrv from './study';
export type * from './study';

export * as UserAdminSrv from './user-admin';
export type * from './user-admin';
