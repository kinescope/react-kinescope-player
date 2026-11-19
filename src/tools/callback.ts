/** Reports an error without throwing: to `window.onerror` / error monitoring, not as a promise rejection. */
function report(error: unknown) {
	/* `typeof` of an undeclared identifier is safe in browsers without reportError */
	if (typeof reportError === 'function') {
		reportError(error);
		return;
	}
	setTimeout(() => {
		throw error;
	});
}

/**
 * Calls a user callback. An exception thrown by the callback is reported as an uncaught error
 * instead of breaking the caller (or becoming an unhandled promise rejection in async code).
 */
export function callSafely<A extends unknown[]>(
	callback: ((...args: A) => unknown) | undefined,
	...args: A
): void {
	if (!callback) {
		return;
	}
	try {
		callback(...args);
	} catch (error) {
		report(error);
	}
}
