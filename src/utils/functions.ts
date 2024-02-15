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
