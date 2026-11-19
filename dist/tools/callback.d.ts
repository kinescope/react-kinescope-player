/**
 * Calls a user callback. An exception thrown by the callback is reported as an uncaught error
 * instead of breaking the caller (or becoming an unhandled promise rejection in async code).
 */
export declare function callSafely<A extends unknown[]>(callback: ((...args: A) => unknown) | undefined, ...args: A): void;
