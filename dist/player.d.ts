import { Component } from 'react';
import { VideoQuality } from './kinescope';
declare type onReadyTypes = {
    currentTime: number;
    duration: number;
    quality: number;
};
declare type onQualityChangedTypes = {
    quality: number;
};
declare type onDurationChangeTypes = {
    duration: number;
};
declare type onProgressTypes = {
    bufferedTime: number;
};
declare type onTimeUpdateTypes = {
    currentTime: number;
};
declare type onVolumeChangeTypes = {
    muted: boolean;
    volume: number;
};
declare type onPlaybackRateChangeTypes = {
    playbackRate: boolean;
};
declare type onSizeChangedTypes = {
    width: number;
    height: number;
};
declare type onFullscreenChangeTypes = {
    isFullscreen: boolean;
    video: boolean;
};
declare type onErrorTypes = {
    error: unknown;
};
declare type PlayerProps = {
    videoId: string;
    className?: string;
    style?: any;
    onJSLoad?: () => void;
    onJSLoadError?: () => void;
    width?: number | string;
    height?: number | string;
    autoPlay?: boolean | 'viewable';
    autoPause?: boolean | 'reset';
    loop?: boolean;
    playsInline?: boolean;
    muted?: boolean;
    language?: 'ru' | 'en';
    onReady?: (data: onReadyTypes) => void;
    onQualityChanged?: (data: onQualityChangedTypes) => void;
    onAutoQualityChanged?: (data: onQualityChangedTypes) => void;
    onSizeChanged?: (data: onSizeChangedTypes) => void;
    onPlay?: () => void;
    onPlaying?: () => void;
    onWaiting?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onTimeUpdate?: (data: onTimeUpdateTypes) => void;
    onProgress?: (data: onProgressTypes) => void;
    onDurationChange?: (data: onDurationChangeTypes) => void;
    onVolumeChange?: (data: onVolumeChangeTypes) => void;
    onPlaybackRateChange?: (data: onPlaybackRateChangeTypes) => void;
    onSeeking?: () => void;
    onFullscreenChange?: (data: onFullscreenChangeTypes) => void;
    onError?: (data: onErrorTypes) => void;
    onDestroy?: () => void;
};
declare class Player extends Component<PlayerProps> {
    private playerLoad;
    private readonly parentsRef;
    private player;
    static defaultProps: {
        width: string;
        height: string;
        autoPause: boolean;
        playsInline: boolean;
    };
    constructor(props: any);
    componentDidUpdate(prevProps: Readonly<PlayerProps>): Promise<void>;
    componentWillUnmount(): void;
    private handleJSLoad;
    private create;
    private destroy;
    private getEventList;
    private getIFrameUrl;
    private createPlayer;
    isPaused: () => Promise<boolean>;
    isEnded: () => Promise<boolean>;
    play: () => Promise<void>;
    pause: () => Promise<boolean>;
    stop: () => Promise<void>;
    getCurrentTime: () => Promise<number>;
    getDuration: () => Promise<number>;
    seekTo: (time: number) => Promise<void>;
    isMuted: () => Promise<boolean>;
    mute: () => Promise<void>;
    unmute: () => Promise<void>;
    getVolume: () => Promise<number>;
    setVolume: (value: number) => Promise<void>;
    getPlaybackRate: () => Promise<number>;
    setPlaybackRate: (value: number) => Promise<void>;
    getVideoQualityList: () => Promise<VideoQuality[]>;
    getCurrentVideoQuality: () => Promise<VideoQuality>;
    setVideoQuality: (quality: VideoQuality) => Promise<void>;
    enableTextTrack: (lang: string) => Promise<void>;
    disableTextTrack: () => Promise<void>;
    isFullscreen: () => Promise<boolean>;
    setFullscreen: (fullscreen: boolean) => Promise<void>;
    private handleEventReady;
    private handleQualityChanged;
    private handleAutoQualityChanged;
    private handleSizeChanged;
    private handlePlay;
    private handlePlaying;
    private handleWaiting;
    private handlePause;
    private handleEnded;
    private handleTimeUpdate;
    private handleProgress;
    private handleDurationChange;
    private handleVolumeChange;
    private handlePlaybackRateChange;
    private handleSeeking;
    private handleFullscreenChange;
    private handleError;
    private handleDestroy;
    render(): JSX.Element;
}
export default Player;
