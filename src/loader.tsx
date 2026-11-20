import {Component, ReactNode} from 'react';
import {PLAYER_LATEST} from './constant';
import {loadIframeApi} from './tools/script';

export const NODE_JS_ID = '__kinescope_player_react_js';

export type JSLoadError = Event | Error;

type LoaderProps = {
	children: ReactNode;
	/** IFrame API script URL. Defaults to `latest`. */
	src?: string;
	onJSLoad: () => void;
	onJSLoadError?: (e: JSLoadError) => void;
};

class Loader extends Component<LoaderProps> {
	/** Bumped on every mount/unmount: results of loads started before are ignored. */
	private generation = 0;

	/*
	 * Loading starts in componentDidMount, not in the constructor: the constructor runs
	 * during render, before the container ref is attached (and may run twice in StrictMode
	 * or be thrown away by a concurrent render).
	 */
	componentDidMount() {
		const generation = ++this.generation;
		const {src = PLAYER_LATEST} = this.props;

		loadIframeApi({src, id: NODE_JS_ID}).then(
			() => {
				generation === this.generation && this.props.onJSLoad();
			},
			(e: JSLoadError) => {
				if (generation !== this.generation) {
					return;
				}
				const {onJSLoadError} = this.props;
				onJSLoadError && onJSLoadError(e);
			},
		);
	}

	componentWillUnmount() {
		this.generation++;
	}

	render() {
		const {children} = this.props;
		return children;
	}
}

export default Loader;
