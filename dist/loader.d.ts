import { Component } from 'react';
declare type LoaderProps = {
    onJSLoad: () => void;
    onJSLoadError?: () => void;
};
declare class Loader extends Component<LoaderProps> {
    constructor(props: any);
    loadJsNotLoad: () => void;
    loadJs: () => void;
    jsLoading: () => void;
    testLoadJS: () => boolean;
    handleJSLoad: () => void;
    handleJSLoadError(): void;
    render(): import("react").ReactNode;
}
export default Loader;
