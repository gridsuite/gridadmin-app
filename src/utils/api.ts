import { AppState } from '../redux/reducer';
import { store } from '../redux/store';

export type Token = string;

export function getToken(): Token {
    const state: AppState = store.getState();
    return state.user?.id_token;
}

export function parseError(text: string): any {
    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
}
