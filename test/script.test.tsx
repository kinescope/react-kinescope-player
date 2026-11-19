import {act, render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import KinescopePlayer from '../src/player';
import {PLAYER_LATEST} from '../src/constant';
import {NODE_JS_ID} from '../src/loader';
import {DEFAULT_TIMEOUT, DEFAULT_RETRY_DELAY} from '../src/tools/script';
import {createMockApi, getScriptTag, scriptTags} from './helpers';

async function tick(ms = 0) {
	await act(async () => {
		await vi.advanceTimersByTimeAsync(ms);
	});
}

/** Fails the current script tag. */
async function failScript() {
	const tag = getScriptTag();
	expect(tag, 'script tag').not.toBeNull();
	await act(async () => {
		tag!.dispatchEvent(new Event('error'));
	});
}

/** Installs the API and fires `load` on the current script tag. */
async function loadScript() {
	const api = createMockApi();
	const tag = getScriptTag();
	expect(tag, 'script tag').not.toBeNull();
	await act(async () => {
		(window as any).Kinescope = {IframePlayer: api.IframePlayer};
		tag!.dispatchEvent(new Event('load'));
	});
	await tick();
	return api;
}

/** Fails the first attempt and all retries. */
async function failAllAttempts() {
	await failScript();
	await tick(DEFAULT_RETRY_DELAY);
	await failScript();
	await tick(DEFAULT_RETRY_DELAY);
	await failScript();
	await tick();
}

function insertForeignTag() {
	const tag = document.createElement('script');
	tag.id = NODE_JS_ID;
	tag.src = PLAYER_LATEST;
	document.body.appendChild(tag);
	return tag;
}

describe('IFrame API script loading', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it('script error: retries, then onJSLoadError; the tag is removed and the next player loads again', async () => {
		const onJSLoadError1 = vi.fn();
		render(<KinescopePlayer videoId="v1" onJSLoadError={onJSLoadError1} />);
		await tick();
		expect(getScriptTag()!.src).toBe(PLAYER_LATEST);

		await failAllAttempts();
		expect(onJSLoadError1).toHaveBeenCalledTimes(1);
		expect(onJSLoadError1.mock.calls[0][0]).toBeInstanceOf(Event);
		expect(getScriptTag()).toBeNull();

		const onInit2 = vi.fn();
		const onJSLoadError2 = vi.fn();
		render(<KinescopePlayer videoId="v2" onInit={onInit2} onJSLoadError={onJSLoadError2} />);
		await tick();
		expect(scriptTags()).toHaveLength(1);

		const api = await loadScript();
		expect(api.create).toHaveBeenCalledTimes(1);
		api.pending[0].resolve();
		await tick();
		expect(onInit2).toHaveBeenCalledTimes(1);
		expect(onJSLoadError2).not.toHaveBeenCalled();
	});

	it('script error while other players wait for the tag: every player gets onJSLoadError', async () => {
		const errors = [vi.fn(), vi.fn(), vi.fn()];
		render(
			<>
				{errors.map((onJSLoadError, i) => (
					<KinescopePlayer key={i} videoId={`v${i}`} onJSLoadError={onJSLoadError} />
				))}
			</>,
		);
		await tick();
		expect(scriptTags()).toHaveLength(1);

		await failAllAttempts();
		errors.forEach(onJSLoadError => expect(onJSLoadError).toHaveBeenCalledTimes(1));
		expect(getScriptTag()).toBeNull();
	});

	it('successful retry after an error leads to onInit for every waiting player', async () => {
		const onInit1 = vi.fn();
		const onInit2 = vi.fn();
		const onJSLoadError = vi.fn();
		render(
			<>
				<KinescopePlayer videoId="v1" onInit={onInit1} onJSLoadError={onJSLoadError} />
				<KinescopePlayer videoId="v2" onInit={onInit2} onJSLoadError={onJSLoadError} />
			</>,
		);
		await tick();

		await failScript();
		expect(getScriptTag()).toBeNull();
		await tick(DEFAULT_RETRY_DELAY);
		expect(scriptTags()).toHaveLength(1);

		const api = await loadScript();
		expect(api.create).toHaveBeenCalledTimes(2);
		api.pending.forEach(p => p.resolve());
		await tick();
		expect(onInit1).toHaveBeenCalledTimes(1);
		expect(onInit2).toHaveBeenCalledTimes(1);
		expect(onJSLoadError).not.toHaveBeenCalled();
	});

	it('foreign tag that is still loading: waits for it, does not load the script twice', async () => {
		const foreign = insertForeignTag();
		const onInit = vi.fn();
		render(<KinescopePlayer videoId="v1" onInit={onInit} />);
		await tick(DEFAULT_TIMEOUT - 1);
		expect(scriptTags()).toHaveLength(1);
		expect(getScriptTag()).toBe(foreign);

		const api = await loadScript();
		expect(getScriptTag()).toBe(foreign);
		expect(api.create).toHaveBeenCalledTimes(1);
		api.pending[0].resolve();
		await tick();
		expect(onInit).toHaveBeenCalledTimes(1);
	});

	it('foreign tag that has already failed: removed after the timeout, the script is loaded again', async () => {
		const foreign = insertForeignTag();
		const onInit = vi.fn();
		render(<KinescopePlayer videoId="v1" onInit={onInit} />);
		await tick(DEFAULT_TIMEOUT);

		expect(foreign.isConnected).toBe(false);
		expect(scriptTags()).toHaveLength(1);
		expect(getScriptTag()).not.toBe(foreign);

		const api = await loadScript();
		api.pending[0].resolve();
		await tick();
		expect(onInit).toHaveBeenCalledTimes(1);
	});

	it('foreign tag that fails while waited for: removed at once, the script is loaded again', async () => {
		const foreign = insertForeignTag();
		render(<KinescopePlayer videoId="v1" />);
		await tick();
		await act(async () => {
			foreign.dispatchEvent(new Event('error'));
		});
		await tick();

		expect(foreign.isConnected).toBe(false);
		expect(scriptTags()).toHaveLength(1);
		expect(getScriptTag()).not.toBe(foreign);
		const api = await loadScript();
		expect(api.create).toHaveBeenCalledTimes(1);
	});

	it('unmounted player does not get onJSLoadError', async () => {
		const onJSLoadError = vi.fn();
		const {unmount} = render(<KinescopePlayer videoId="v1" onJSLoadError={onJSLoadError} />);
		await tick();
		unmount();
		await failAllAttempts();
		expect(onJSLoadError).not.toHaveBeenCalled();
	});

	it('own script request that never answers: the attempt times out and is retried', async () => {
		const onJSLoadError = vi.fn();
		const onInit = vi.fn();
		render(<KinescopePlayer videoId="v1" onInit={onInit} onJSLoadError={onJSLoadError} />);
		await tick();
		const stalled = getScriptTag()!;

		await tick(DEFAULT_TIMEOUT - 1);
		expect(stalled.isConnected).toBe(true);
		await tick(1);
		expect(stalled.isConnected).toBe(false);

		await tick(DEFAULT_RETRY_DELAY);
		expect(scriptTags()).toHaveLength(1);
		expect(getScriptTag()).not.toBe(stalled);

		const api = await loadScript();
		api.pending[0].resolve();
		await tick();
		expect(onInit).toHaveBeenCalledTimes(1);
		expect(onJSLoadError).not.toHaveBeenCalled();
	});

	it('own script request that never answers on every attempt: onJSLoadError', async () => {
		const onJSLoadError = vi.fn();
		render(<KinescopePlayer videoId="v1" onJSLoadError={onJSLoadError} />);
		await tick();
		await tick(DEFAULT_TIMEOUT + DEFAULT_RETRY_DELAY);
		await tick(DEFAULT_TIMEOUT + DEFAULT_RETRY_DELAY);
		expect(onJSLoadError).not.toHaveBeenCalled();
		await tick(DEFAULT_TIMEOUT);

		expect(onJSLoadError).toHaveBeenCalledTimes(1);
		expect(onJSLoadError.mock.calls[0][0]).toBeInstanceOf(Error);
		expect(getScriptTag()).toBeNull();
	});

	it('onJSLoadError that throws: reported as an error, no unhandled rejection', async () => {
		const reportError = vi.spyOn(globalThis, 'reportError').mockImplementation(() => {});
		const error = new Error('consumer bug');
		render(
			<KinescopePlayer
				videoId="v1"
				onJSLoadError={() => {
					throw error;
				}}
			/>,
		);
		await tick();
		await failAllAttempts();
		expect(reportError).toHaveBeenCalledWith(error);
		reportError.mockRestore();
	});

	it('playerScriptUrl sets the script URL', async () => {
		const src = 'https://player.kinescope.io/v2.202.2/iframe.player.js';
		render(<KinescopePlayer videoId="v1" playerScriptUrl={src} />);
		await tick();
		expect(getScriptTag()!.src).toBe(src);
	});
});
