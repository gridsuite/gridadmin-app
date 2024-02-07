import { UserManager } from 'oidc-client';

export * from './router';

export type UserManagerState = {
    instance: UserManager | null;
    error: string | null;
};
