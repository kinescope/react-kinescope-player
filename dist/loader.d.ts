import { Component, ReactNode } from 'react';
declare type LoaderProps = {
    children: ReactNode;
    onJSLoad: () => void;
    onJSLoadError?: (e: ErrorEvent) => void;
};
declare class Loader extends Component<LoaderProps> {
    constructor(props: any);
    loadJsNotLoad: () => void;
    loadJs: () => void;
    jsLoading: () => void;
    testLoadJS: () => boolean;
    handleJSLoad: () => void;
    handleJSLoadError: (e: ErrorEvent) => void;
    render(): ReactNode;
}
export default Loader;
