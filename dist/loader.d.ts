import { Component, ReactNode } from 'react';
export declare const NODE_JS_ID = "__kinescope_player_react_js";
export type JSLoadError = Event | Error;
type LoaderProps = {
    children: ReactNode;
    /** IFrame API script URL. Defaults to `latest`. */
    src?: string;
    onJSLoad: () => void;
    onJSLoadError?: (e: JSLoadError) => void;
};
declare class Loader extends Component<LoaderProps> {
    /** Bumped on every mount/unmount: results of loads started before are ignored. */
    private generation;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): ReactNode;
}
export default Loader;
