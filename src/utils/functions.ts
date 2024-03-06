/*
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type FnSyncAsync<R = void> = (() => R) | (() => Promise<R>);
export type Setter<T> = (v: T) => void;

export function runFnWithState(
    fn: FnSyncAsync | null | undefined,
    setState: Setter<boolean>
) {
    if (fn !== undefined && fn !== null) {
        return new Promise<void>((resolve, reject) => {
            try {
                setState(true);
                resolve();
            } catch (error) {
                reject(error);
            }
        })
            .then(fn)
            .finally(() => setState(false));
    } else {
        return null;
    }
}

export function isPromise(obj: any): boolean {
    return (
        typeof obj?.then === 'function' || //only standard/common thing in implementations
        obj instanceof Promise || //native promise
        (obj && Object.prototype.toString.call(obj) === '[object Promise]')
    ); //ES6 Promise
}
