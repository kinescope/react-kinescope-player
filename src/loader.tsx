import {Component} from 'react';
import {PLAYER_LATEST} from './constant';

const NODE_JS_ID = '__kinescope_player_react_js';

type LoaderProps = {
	onJSLoad: () => void;
	onJSLoadError?: () => void;
};

class Loader extends Component<LoaderProps> {
	constructor(props) {
		super(props);
		this.jsLoading();
	}

	jsLoading = () => {
		if (this.testLoadJS()) {
			this.handleJSLoad();
			return;
		}
		let el = document.createElement('script');
		el.id = NODE_JS_ID;
		el.async = false;
		document.body.appendChild(el);
		el.onload = this.handleJSLoad;
		el.onerror = this.handleJSLoadError;
		el.src = PLAYER_LATEST;
	};

	testLoadJS = () => {
		return !!document.getElementById(NODE_JS_ID);
	};

	handleJSLoad = () => {
		const {onJSLoad} = this.props;
		onJSLoad && onJSLoad();
	};

	handleJSLoadError() {
		const {onJSLoadError} = this.props;
		onJSLoadError && onJSLoadError();
	}

	render() {
		const {children} = this.props;
		return children;
	}
}

export default Loader;
