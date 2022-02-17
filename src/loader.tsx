import {Component} from 'react';
import {PLAYER_LATEST} from './constant';
import {loadScript} from './tools/script';

const NODE_JS_ID = '__kinescope_player_react_js';

type LoaderProps = {
	onJSLoad: () => void;
	onJSLoadError?: (e: ErrorEvent) => void;
};

class Loader extends Component<LoaderProps> {
	constructor(props) {
		super(props);
		this.jsLoading();
	}

	loadJsNotLoad = () => {
		const el = document.getElementById(NODE_JS_ID);
		if (el) {
			el.addEventListener('load', this.loadJs);
		}
	};

	loadJs = () => {
		const el = document.getElementById(NODE_JS_ID);
		if (el) {
			el.removeEventListener('load', this.loadJs);
		}
		this.handleJSLoad();
	};

	jsLoading = () => {
		if (!!window?.Kinescope?.IframePlayer) {
			this.handleJSLoad();
			return;
		}

		if (this.testLoadJS()) {
			this.loadJsNotLoad();
			return;
		}

		loadScript(PLAYER_LATEST, NODE_JS_ID)
			.then(success => {
				success && this.handleJSLoad();
			})
			.catch(e => {
				this.handleJSLoadError(e);
			});
	};

	testLoadJS = () => {
		return !!document.getElementById(NODE_JS_ID);
	};

	handleJSLoad = () => {
		const {onJSLoad} = this.props;
		onJSLoad && onJSLoad();
	};

	handleJSLoadError = (e: ErrorEvent) => {
		const {onJSLoadError} = this.props;
		onJSLoadError && onJSLoadError(e);
	};

	render() {
		const {children} = this.props;
		return children;
	}
}

export default Loader;
