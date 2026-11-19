import {StrictMode, startTransition} from 'react';
import {render, waitFor} from '@testing-library/react';
import {createRoot} from 'react-dom/client';
import {describe, expect, it, vi} from 'vitest';
import KinescopePlayer, {type JSLoadError} from '../src/player';
import {contentWindowIsNull, flush, installMockApi} from './helpers';

function callbacks() {
	return {onInit: vi.fn(), onInitError: vi.fn()};
}

describe('Player creation', () => {
	it('creates the player and passes new create options', async () => {
		const api = installMockApi();
		const cb = callbacks();
		render(
			<KinescopePlayer
				videoId="v1"
				createTimeout={20000}
				attemptTimeout={5000}
				errorScreen={false}
				{...cb}
			/>,
		);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		const options = api.create.mock.calls[0][1];
		expect(options.url).toBe('https://kinescope.io/embed/v1');
		expect(options.timeout).toBe(20000);
		expect(options.attemptTimeout).toBe(5000);
		expect(options.errorScreen).toBe(false);

		api.pending[0].resolve();
		await flush();
		expect(cb.onInit).toHaveBeenCalledTimes(1);
		expect(cb.onInit).toHaveBeenCalledWith({playerId: api.pending[0].id});
		expect(cb.onInitError).not.toHaveBeenCalled();
	});

	it('does not pass create options that are not set', async () => {
		const api = installMockApi();
		render(<KinescopePlayer videoId="v1" />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		const options = api.create.mock.calls[0][1];
		expect('timeout' in options).toBe(false);
		expect('attemptTimeout' in options).toBe(false);
		expect('errorScreen' in options).toBe(false);
	});

	it('re-creates the player when createTimeout/attemptTimeout/errorScreen change', async () => {
		const api = installMockApi();
		const {rerender} = render(<KinescopePlayer videoId="v1" attemptTimeout={5000} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		api.pending[0].resolve();
		await flush();

		rerender(<KinescopePlayer videoId="v1" attemptTimeout={7000} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(2));
		expect(api.create.mock.calls[1][1].attemptTimeout).toBe(7000);
		expect(api.pending[0].player.destroy).toHaveBeenCalled();
	});

	it('reports a real error of the current generation to onInitError exactly once', async () => {
		const api = installMockApi();
		const cb = callbacks();
		render(<KinescopePlayer videoId="v1" {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));

		const error = new Error('EmbedError: HTTP_STATUS 404');
		api.pending[0].reject(error);
		await flush();
		expect(cb.onInitError).toHaveBeenCalledTimes(1);
		expect(cb.onInitError).toHaveBeenCalledWith(error);
		expect(cb.onInit).not.toHaveBeenCalled();
		// no unhandled rejection: checked in setup.ts
	});

	it('logs a creation error if onInitError is not set, without unhandled rejection', async () => {
		const api = installMockApi();
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
		render(<KinescopePlayer videoId="v1" />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		const error = new Error('EmbedError');
		api.pending[0].reject(error);
		await flush();
		expect(consoleError).toHaveBeenCalledWith(error);
		consoleError.mockRestore();
	});
});

describe('Consumer callbacks that throw', () => {
	function spyReportError() {
		return vi.spyOn(globalThis, 'reportError').mockImplementation(() => {});
	}

	it('onInit throws: reported as an error, the player stays created, no unhandled rejection', async () => {
		const reportError = spyReportError();
		const api = installMockApi();
		const error = new Error('consumer bug');
		const onInitError = vi.fn();
		const {unmount} = render(
			<KinescopePlayer
				videoId="v1"
				onInit={() => {
					throw error;
				}}
				onInitError={onInitError}
			/>,
		);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		api.pending[0].resolve();
		await flush();
		expect(reportError).toHaveBeenCalledWith(error);
		expect(onInitError).not.toHaveBeenCalled();

		unmount();
		await flush();
		expect(api.pending[0].player.destroy).toHaveBeenCalledTimes(1);
		reportError.mockRestore();
	});

	it('onInitError throws: reported as an error, no unhandled rejection', async () => {
		const reportError = spyReportError();
		const api = installMockApi();
		const error = new Error('consumer bug');
		render(
			<KinescopePlayer
				videoId="v1"
				onInitError={() => {
					throw error;
				}}
			/>,
		);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		api.pending[0].reject(new Error('EmbedError'));
		await flush();
		expect(reportError).toHaveBeenCalledWith(error);
		reportError.mockRestore();
	});

	it('onJSLoad throws: reported as an error, the player is still created', async () => {
		const reportError = spyReportError();
		const api = installMockApi();
		const error = new Error('consumer bug');
		const onInit = vi.fn();
		render(
			<KinescopePlayer
				videoId="v1"
				onJSLoad={() => {
					throw error;
				}}
				onInit={onInit}
			/>,
		);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		api.pending[0].resolve();
		await flush();
		expect(reportError).toHaveBeenCalledWith(error);
		expect(onInit).toHaveBeenCalledTimes(1);
		reportError.mockRestore();
	});

	it('onJSLoadError argument type is exported', () => {
		const handler = (error: JSLoadError) => error;
		expect(handler(new Error('x'))).toBeInstanceOf(Error);
	});
});

describe('muted', () => {
	it('change while the player is being created is applied to the created player', async () => {
		const api = installMockApi();
		const {rerender} = render(<KinescopePlayer videoId="v1" muted={false} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		expect(api.create.mock.calls[0][1].behavior.muted).toBe(false);

		rerender(<KinescopePlayer videoId="v1" muted={true} />);
		api.pending[0].resolve();
		await flush();
		const player = api.pending[0].player;
		expect(player.mute).toHaveBeenCalledTimes(1);
		expect(player.unmute).not.toHaveBeenCalled();
	});

	it('no change while creating: mute/unmute are not called', async () => {
		const api = installMockApi();
		render(<KinescopePlayer videoId="v1" muted={true} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		api.pending[0].resolve();
		await flush();
		expect(api.pending[0].player.mute).not.toHaveBeenCalled();
		expect(api.pending[0].player.unmute).not.toHaveBeenCalled();
	});

	it('change after creation calls mute/unmute', async () => {
		const api = installMockApi();
		const {rerender} = render(<KinescopePlayer videoId="v1" muted={false} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		api.pending[0].resolve();
		await flush();
		rerender(<KinescopePlayer videoId="v1" muted={true} />);
		await flush();
		expect(api.pending[0].player.mute).toHaveBeenCalledTimes(1);
		expect(api.create).toHaveBeenCalledTimes(1);
	});
});

describe('Re-creation races', () => {
	it('fast videoId change twice: one iframe, onInit once for the last video, previous players destroyed', async () => {
		const api = installMockApi();
		const cb = callbacks();
		const {rerender, container} = render(<KinescopePlayer videoId="v1" {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));

		rerender(<KinescopePlayer videoId="v2" {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(2));
		rerender(<KinescopePlayer videoId="v3" {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(3));

		expect(api.create.mock.calls[2][1].url).toBe('https://kinescope.io/embed/v3');

		/* stale creations finish after the last one, in both possible ways */
		api.pending[2].resolve();
		await flush();
		api.pending[0].reject(contentWindowIsNull(api.pending[0].id));
		api.pending[1].resolve();
		await flush();

		expect(container.querySelectorAll('iframe')).toHaveLength(1);
		expect(container.querySelector('iframe')!.id).toBe(api.pending[2].id);
		expect(cb.onInitError).not.toHaveBeenCalled();
		expect(cb.onInit).toHaveBeenCalledTimes(1);
		expect(cb.onInit).toHaveBeenCalledWith({playerId: api.pending[2].id});
		expect(api.pending[1].player.destroy).toHaveBeenCalled();
		expect(api.pending[2].player.destroy).not.toHaveBeenCalled();
	});

	it('destroys the previous created player on videoId change', async () => {
		const api = installMockApi();
		const cb = callbacks();
		const {rerender, container} = render(<KinescopePlayer videoId="v1" {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		api.pending[0].resolve();
		await flush();
		expect(cb.onInit).toHaveBeenCalledTimes(1);

		rerender(<KinescopePlayer videoId="v2" {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(2));
		expect(api.pending[0].player.destroy).toHaveBeenCalledTimes(1);
		api.pending[1].resolve();
		await flush();
		expect(cb.onInit).toHaveBeenCalledTimes(2);
		expect(container.querySelectorAll('iframe')).toHaveLength(1);
	});

	it('prop change right after mount (before the iframe is created): no "Container not found"', async () => {
		const api = installMockApi();
		const cb = callbacks();
		const {rerender} = render(<KinescopePlayer videoId="v1" width={100} {...cb} />);
		/* change before setTimeout(0) in create() fires */
		rerender(<KinescopePlayer videoId="v1" width={200} {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalled());
		await flush();

		expect(api.create).toHaveBeenCalledTimes(1);
		expect(api.create.mock.calls[0][1].size.width).toBe(200);
		api.pending[0].resolve();
		await flush();
		expect(cb.onInitError).not.toHaveBeenCalled();
		expect(cb.onInit).toHaveBeenCalledTimes(1);
	});

	it('prop change while the iframe is loading: the stale error is ignored', async () => {
		const api = installMockApi();
		const cb = callbacks();
		const {rerender} = render(<KinescopePlayer videoId="v1" width={100} {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		rerender(<KinescopePlayer videoId="v1" width={200} {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(2));

		api.pending[0].reject(contentWindowIsNull(api.pending[0].id));
		api.pending[1].resolve();
		await flush();
		expect(cb.onInitError).not.toHaveBeenCalled();
		expect(cb.onInit).toHaveBeenCalledTimes(1);
	});

	it('prop change while the script is loading creates the player once with the latest props', async () => {
		const cb = callbacks();
		const {rerender} = render(<KinescopePlayer videoId="v1" {...cb} />);
		rerender(<KinescopePlayer videoId="v2" {...cb} />);
		await flush();

		const api = installMockApi();
		const script = document.getElementById('__kinescope_player_react_js')!;
		script.dispatchEvent(new Event('load'));
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		await flush();
		expect(api.create).toHaveBeenCalledTimes(1);
		expect(api.create.mock.calls[0][1].url).toBe('https://kinescope.io/embed/v2');
	});
});

describe('Unmount during creation', () => {
	it('unmount before the iframe is created: no callbacks, create is not called', async () => {
		const api = installMockApi();
		const cb = callbacks();
		const {unmount} = render(<KinescopePlayer videoId="v1" {...cb} />);
		unmount();
		await flush();
		expect(api.create).not.toHaveBeenCalled();
		expect(cb.onInit).not.toHaveBeenCalled();
		expect(cb.onInitError).not.toHaveBeenCalled();
	});

	it('unmount while the iframe is loading, creation fails: no onInitError', async () => {
		const api = installMockApi();
		const cb = callbacks();
		const {unmount} = render(<KinescopePlayer videoId="v1" {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		unmount();
		api.pending[0].reject(contentWindowIsNull(api.pending[0].id));
		await flush();
		expect(cb.onInit).not.toHaveBeenCalled();
		expect(cb.onInitError).not.toHaveBeenCalled();
	});

	it('unmount while the iframe is loading, creation succeeds: player destroyed, no onInit', async () => {
		const api = installMockApi();
		const cb = callbacks();
		const {unmount} = render(<KinescopePlayer videoId="v1" {...cb} />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		unmount();
		api.pending[0].resolve();
		await flush();
		expect(api.pending[0].player.destroy).toHaveBeenCalledTimes(1);
		expect(api.pending[0].player.on).not.toHaveBeenCalled();
		expect(cb.onInit).not.toHaveBeenCalled();
		expect(cb.onInitError).not.toHaveBeenCalled();
	});

	it('unmount after creation destroys the player', async () => {
		const api = installMockApi();
		const {unmount} = render(<KinescopePlayer videoId="v1" />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		api.pending[0].resolve();
		await flush();
		unmount();
		await flush();
		expect(api.pending[0].player.destroy).toHaveBeenCalledTimes(1);
	});

	it('destroy rejection on unmount does not cause unhandled rejection', async () => {
		const api = installMockApi();
		const {unmount} = render(<KinescopePlayer videoId="v1" />);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
		api.pending[0].player.destroy.mockRejectedValue(new Error('already removed'));
		api.pending[0].resolve();
		await flush();
		unmount();
		await flush();
	});
});

describe('Mount when IframePlayer is already loaded', () => {
	it('StrictMode: one live player, onInit once', async () => {
		const api = installMockApi();
		const cb = callbacks();
		const {container} = render(
			<StrictMode>
				<KinescopePlayer videoId="v1" {...cb} />
			</StrictMode>,
		);
		await waitFor(() => expect(api.create).toHaveBeenCalled());
		api.pending.forEach(p => p.resolve());
		await flush();

		const live = api.pending.filter(p => !p.player.destroyed);
		expect(live).toHaveLength(1);
		expect(cb.onInit).toHaveBeenCalledTimes(1);
		expect(cb.onInitError).not.toHaveBeenCalled();
		expect(container.querySelectorAll('iframe')).toHaveLength(1);
	});

	it('time-sliced transition render (commit after a yield): the player is created', async () => {
		const api = installMockApi();
		const cb = callbacks();
		/* a slow sibling makes the concurrent render yield between Player render and commit */
		function Slow() {
			const end = Date.now() + 30;
			while (Date.now() < end) {
				/* busy wait */
			}
			return null;
		}
		const host = document.createElement('div');
		document.body.appendChild(host);
		const root = createRoot(host);
		const prevActEnv = (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
		(globalThis as any).IS_REACT_ACT_ENVIRONMENT = false;
		try {
			startTransition(() => {
				root.render(
					<>
						<KinescopePlayer videoId="v1" {...cb} />
						<Slow />
						<Slow />
					</>,
				);
			});
			await waitFor(() => expect(host.querySelector('span')).not.toBeNull());
			await waitFor(() => expect(api.create).toHaveBeenCalledTimes(1));
			api.pending[0].resolve();
			await waitFor(() => expect(cb.onInit).toHaveBeenCalledTimes(1));
		} finally {
			root.unmount();
			(globalThis as any).IS_REACT_ACT_ENVIRONMENT = prevActEnv;
			host.remove();
		}
	});

	it('second player on the page is created as well', async () => {
		const api = installMockApi();
		const cb1 = callbacks();
		const cb2 = callbacks();
		render(
			<>
				<KinescopePlayer videoId="v1" {...cb1} />
				<KinescopePlayer videoId="v2" {...cb2} />
			</>,
		);
		await waitFor(() => expect(api.create).toHaveBeenCalledTimes(2));
		api.pending.forEach(p => p.resolve());
		await flush();
		expect(cb1.onInit).toHaveBeenCalledTimes(1);
		expect(cb2.onInit).toHaveBeenCalledTimes(1);
	});
});
