import { Component } from 'react';
import { WatermarkModeTypes, VideoQuality, VideoQualityLevels, ActionCallToAction, ActionToolBar } from './kinescope';
export declare type VttTypes = {
    label: string;
    src: string;
    srcLang: string;
};
export declare type ChapterTypes = {
    position: number;
    title: string;
};
export declare type ActionsTypes = ActionToolBar | ActionCallToAction;
export declare type BookmarkTypes = {
    id: string;
    time: number;
    title?: string;
};
export declare type EventReadyTypes = {
    currentTime: number;
    duration: number;
    quality: VideoQuality;
    qualityLevels: VideoQualityLevels;
};
export declare type EventQualityChangedTypes = {
    quality: VideoQuality;
};
export declare type EventSeekChapterTypes = {
    position: number;
};
export declare type EventDurationChangeTypes = {
    duration: number;
};
export declare type EventProgressTypes = {
    bufferedTime: number;
};
export declare type EventTimeUpdateTypes = {
    currentTime: number;
};
export declare type EventVolumeChangeTypes = {
    muted: boolean;
    volume: number;
};
export declare type EventPlaybackRateChangeTypes = {
    playbackRate: boolean;
};
export declare type EventSizeChangedTypes = {
    width: number;
    height: number;
};
export declare type EventFullscreenChangeTypes = {
    isFullscreen: boolean;
    video: boolean;
};
export declare type EventCallActionTypes = {
    id: string;
    title?: string;
    type: string;
};
export declare type EventCallBookmarkTypes = {
    id: string;
    time: number;
};
export declare type EventErrorTypes = {
    error: unknown;
};
declare type PlayerProps = {
    videoId: string;
    className?: string;
    style?: any;
    onJSLoad?: () => void;
    onJSLoadError?: () => void;
    title?: string;
    subtitle?: string;
    poster?: string;
    width?: number | string;
    height?: number | string;
    autoPlay?: boolean | 'viewable';
    autoPause?: boolean | 'reset';
    loop?: boolean;
    playsInline?: boolean;
    muted?: boolean;
    language?: 'ru' | 'en';
    chapters?: ChapterTypes[];
    vtt?: VttTypes[];
    externalId?: string;
    actions?: ActionsTypes[];
    bookmarks?: BookmarkTypes[];
    watermarkText?: string;
    watermarkMode?: WatermarkModeTypes;
    onReady?: (data: EventReadyTypes) => void;
    onQualityChanged?: (data: EventQualityChangedTypes) => void;
    onAutoQualityChanged?: (data: EventQualityChangedTypes) => void;
    onSeekChapter?: (data: EventSeekChapterTypes) => void;
    onSizeChanged?: (data: EventSizeChangedTypes) => void;
    onPlay?: () => void;
    onPlaying?: () => void;
    onWaiting?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onTimeUpdate?: (data: EventTimeUpdateTypes) => void;
    onProgress?: (data: EventProgressTypes) => void;
    onDurationChange?: (data: EventDurationChangeTypes) => void;
    onVolumeChange?: (data: EventVolumeChangeTypes) => void;
    onPlaybackRateChange?: (data: EventPlaybackRateChangeTypes) => void;
    onSeeking?: () => void;
    onFullscreenChange?: (data: EventFullscreenChangeTypes) => void;
    onCallAction?: (data: EventCallActionTypes) => void;
    onCallBookmark?: (data: EventCallBookmarkTypes) => void;
    onError?: (data: EventErrorTypes) => void;
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
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<PlayerProps>): Promise<void>;
    componentWillUnmount(): void;
    private handleJSLoad;
    /** @deprecated remove 2.17 */
    private shouldPlayerUpdateOld_2_16_0;
    private shouldPlayerUpdate;
    private shouldPlaylistUpdate;
    private updatePlaylistOptions;
    private create;
    private destroy;
    private getEventList;
    private getIFrameUrl;
    private createPlayer;
    private setPlaylistItemOptions;
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
    closeCTA: () => Promise<void>;
    isFullscreen: () => Promise<boolean>;
    setFullscreen: (fullscreen: boolean) => Promise<void>;
    private handleEventReady;
    private handleQualityChanged;
    private handleAutoQualityChanged;
    private handleSeekChapter;
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
    private handleCallAction;
    private handleCallBookmark;
    private handleError;
    private handleDestroy;
    render(): JSX.Element;
}
export default Player;
