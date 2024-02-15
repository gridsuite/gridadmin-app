import { getToken } from './api';

export type * from './api';

export function getWsBase(): string {
    return document.baseURI
        .replace(/^http(s?):\/\//, 'ws$1://')
        .replace(/\/$/, '');
}

export function getUrlWithToken(baseUrl: string): string {
    return `${baseUrl}${
        baseUrl.includes('?') ? '&' : '?'
    }access_token=${getToken()}`;
}
