import {Component, ReactNode} from 'react';
import {load as iframeApiLoad} from '@kinescope/player-iframe-api-loader';

type LoaderProps = {
	children: ReactNode;
	onJSLoad: () => void;
	onJSLoadError?: (e: ErrorEvent) => void;
};

class Loader extends Component<LoaderProps> {
	constructor(props) {
		super(props);
		this.jsLoading();
	}

	jsLoading = () => {
		if (!!window?.Kinescope?.IframePlayer) {
			this.handleJSLoad();
			return;
		}

		iframeApiLoad().then(this.handleJSLoad).catch(this.handleJSLoadError);
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
