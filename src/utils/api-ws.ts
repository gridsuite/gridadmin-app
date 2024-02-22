import { getToken } from './api';

export type * from './api';

export function getWsBase(): string {
    return document.baseURI
        .replace(/^http(s?):\/\//, 'ws$1://')
        .replace(/\/$/, '');
}

export function getUrlWithToken(baseUrl: string): string {
    const querySymbol = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${querySymbol}access_token=${getToken()}`;
}
