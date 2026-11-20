import {vi} from 'vitest';
import {act} from '@testing-library/react';
import {NODE_JS_ID} from '../src/loader';

export type MockPlayer = {
	id: string;
	iframe: HTMLIFrameElement | null;
	destroyed: boolean;
	Events: Record<string, string>;
	on: ReturnType<typeof vi.fn>;
	destroy: ReturnType<typeof vi.fn>;
	setPlaylistItemOptions: ReturnType<typeof vi.fn>;
	mute: ReturnType<typeof vi.fn>;
	unmute: ReturnType<typeof vi.fn>;
};

export type PendingCreate = {
	id: string;
	options: any;
	player: MockPlayer;
	resolve: () => void;
	reject: (e: Error) => void;
};

function makePlayer(id: string, iframe: HTMLIFrameElement | null): MockPlayer {
	const player: MockPlayer = {
		id,
		iframe,
		destroyed: false,
		Events: new Proxy({}, {get: (_, key) => String(key)}) as Record<string, string>,
		on: vi.fn(),
		destroy: vi.fn(async () => {
			player.destroyed = true;
			player.iframe?.remove();
		}),
		setPlaylistItemOptions: vi.fn(async () => {}),
		mute: vi.fn(async () => {}),
		unmute: vi.fn(async () => {}),
	};
	return player;
}

export const containerNotFound = (id: string) =>
	new Error(`Container "${id}" for the player is not found.`);

export const contentWindowIsNull = (id: string) =>
	new Error(`iframe(#${id}).contentWindow is null. Is the iframe already removed from the DOM?`);

/**
 * Installs a fake `window.Kinescope.IframePlayer`.
 * `create` mimics the real one: rejects at once if the container is missing,
 * otherwise replaces the container div with an iframe and waits for the test
 * to resolve or reject it.
 */
export function createMockApi() {
	const pending: PendingCreate[] = [];
	const create = vi.fn((id: string, options: any) => {
		const el = document.getElementById(id);
		if (!el) {
			return Promise.reject(containerNotFound(id));
		}
		const iframe = document.createElement('iframe');
		iframe.id = id;
		el.replaceWith(iframe);
		const player = makePlayer(id, iframe);
		return new Promise((resolve, reject) => {
			pending.push({id, options, player, resolve: () => resolve(player), reject});
		});
	});
	return {IframePlayer: {create}, create, pending};
}

export function installMockApi() {
	const api = createMockApi();
	(window as any).Kinescope = {IframePlayer: api.IframePlayer};
	return api;
}

export function getScriptTag() {
	return document.getElementById(NODE_JS_ID) as HTMLScriptElement | null;
}

export function scriptTags() {
	return document.querySelectorAll(`#${NODE_JS_ID}`);
}

/** Lets timers (setTimeout 0) and promise chains run. */
export async function flush(times = 3) {
	for (let i = 0; i < times; i++) {
		await act(async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
		});
	}
}
