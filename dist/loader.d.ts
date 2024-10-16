import { Component, ReactNode } from 'react';
type LoaderProps = {
    children: ReactNode;
    onJSLoad: () => void;
    onJSLoadError?: (e: ErrorEvent) => void;
};
declare class Loader extends Component<LoaderProps> {
    constructor(props: LoaderProps);
    loadJsNotLoad: () => void;
    loadJs: () => void;
    jsLoading: () => void;
    testLoadJS: () => boolean;
    handleJSLoad: () => void;
    handleJSLoadError: (e: ErrorEvent) => void;
    render(): ReactNode;
}
export default Loader;
