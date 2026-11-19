export type ScriptLoadOptions = {
	/** Script URL. */
	src: string;
	/** `id` attribute of the `<script>` tag. */
	id: string;
	/** Extra attempts after the first failed one. */
	retries?: number;
	/** Pause between attempts, ms. */
	retryDelay?: number;
	/**
	 * How long to wait for `load`/`error` of a `<script>` tag, ms: a stalled request
	 * (no answer from the server, captive portal) fails the attempt instead of hanging.
	 * The same timeout is used for a tag inserted by someone else.
	 */
	timeout?: number;
};

export const DEFAULT_RETRIES = 2;
export const DEFAULT_RETRY_DELAY = 1000;
export const DEFAULT_TIMEOUT = 15000;

/**
 * Loading state is shared by every player on the page.
 * - pending/resolved promise: every player waits for it and gets the same result;
 * - `null`: nothing is loading, the next player starts a new load.
 * After a failure the promise is reset, so the next player can try again
 * without reloading the page.
 */
let shared: Promise<void> | null = null;

function isApiLoaded(): boolean {
	return !!window.Kinescope?.IframePlayer;
}

function delay(ms: number) {
	return new Promise<void>(resolve => setTimeout(resolve, ms));
}

/** Resolves on `load`, rejects on `error` or after `timeout` ms (when `timeout` > 0). */
function waitForScript(script: HTMLScriptElement, timeout = 0): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		let timer: ReturnType<typeof setTimeout> | undefined;
		const cleanup = () => {
			script.removeEventListener('load', onLoad);
			script.removeEventListener('error', onError);
			timer !== undefined && clearTimeout(timer);
		};
		const onLoad = () => {
			cleanup();
			resolve();
		};
		const onError = (e: Event) => {
			cleanup();
			reject(e);
		};
		script.addEventListener('load', onLoad);
		script.addEventListener('error', onError);
		if (timeout > 0) {
			timer = setTimeout(() => {
				cleanup();
				reject(new Error(`Kinescope Player: script "${script.src}" load timeout (${timeout} ms).`));
			}, timeout);
		}
	});
}

function apiNotFoundError(src: string) {
	return new Error(`Kinescope Player: script "${src}" loaded, but IframePlayer API is not found.`);
}

async function loadOnce({src, id, timeout = DEFAULT_TIMEOUT}: ScriptLoadOptions): Promise<void> {
	if (isApiLoaded()) {
		return;
	}

	/*
	 * A tag with our id, but not inserted by this module. There is no way to know
	 * whether it is still loading or has already failed, so wait for `load`/`error`
	 * with a timeout and remove it only after an error or timeout: removing a tag
	 * that is still loading would load the script twice.
	 */
	const foreign = document.getElementById(id);
	if (foreign) {
		if (foreign instanceof HTMLScriptElement) {
			try {
				await waitForScript(foreign, timeout);
			} catch {
				// handled below: the tag is removed and the script is loaded again
			}
			if (isApiLoaded()) {
				return;
			}
		}
		foreign.remove();
	}

	const script = document.createElement('script');
	script.id = id;
	script.src = src;
	/*
	 * After a timeout the tag is removed and the next attempt inserts a new one. If the stalled
	 * request still completes, the script may run twice; IFrame API handles this (the later copy
	 * replaces the earlier one), and a next attempt that finds the API loaded does nothing.
	 */
	const loaded = waitForScript(script, timeout);
	document.body.appendChild(script);
	try {
		await loaded;
	} catch (e) {
		script.remove();
		throw e;
	}
	if (!isApiLoaded()) {
		script.remove();
		throw apiNotFoundError(src);
	}
}

function loadWithRetries(options: ScriptLoadOptions, attempt = 0): Promise<void> {
	const {retries = DEFAULT_RETRIES, retryDelay = DEFAULT_RETRY_DELAY} = options;
	return loadOnce(options).catch(e => {
		if (attempt >= retries) {
			throw e;
		}
		return delay(retryDelay).then(() => loadWithRetries(options, attempt + 1));
	});
}

/**
 * Loads Kinescope IFrame API once per page.
 * All callers share one promise, so every waiting player gets either success or the error.
 * After a failure the state is reset and the next call loads the script again.
 */
export function loadIframeApi(options: ScriptLoadOptions): Promise<void> {
	if (isApiLoaded()) {
		return Promise.resolve();
	}
	if (!shared) {
		const current = loadWithRetries(options).catch(e => {
			if (shared === current) {
				shared = null;
			}
			throw e;
		});
		shared = current;
	}
	return shared;
}

/** @internal For tests only. */
export function resetIframeApiLoader() {
	shared = null;
}
