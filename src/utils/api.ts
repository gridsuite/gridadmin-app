import { AppState } from '../redux/reducer';
import { store } from '../redux/store';

export type User = AppState['user'];
export type Token = string;

export function getToken(user?: User): Token {
    return (user ?? getUser())?.id_token;
}

export function getUser(): User {
    const state: AppState = store.getState();
    return state.user; //?? state.userManager?.instance?.getUser().then();
}

export function extractUserSub(user: User): Promise<unknown> {
    const sub = user?.profile?.sub;
    if (!sub) {
        return Promise.reject(
            new Error(
                `Fetching access for missing user.profile.sub : ${JSON.stringify(
                    user
                )}`
            )
        );
    } else {
        return Promise.resolve(sub);
    }
}

export function parseError(text: string): any {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}