import { getToken } from './api';

export type * from './api';

export function getWsBase(): string {
    return document.baseURI
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');
}

export function getUrlWithToken(baseUrl: string): string {
    return `${baseUrl}${
        baseUrl.includes('?') ? '&' : '?'
    }access_token=${getToken()}`;
}
