import React, { Component } from 'react';
import { VideoQuality, VideoQualityLevels, ActionCallToAction, ActionToolBar, WatermarkTypes, PreloadTypes, Theme } from './kinescope';
export type VttTypes = {
    label: string;
    src: string;
    srcLang: string;
};
export type ChapterTypes = {
    position: number;
    title: string;
};
export type ActionsTypes = ActionToolBar | ActionCallToAction;
export type BookmarkTypes = {
    id: string;
    time: number;
    title?: string;
};
export type EventInitTypes = {
    playerId: string;
};
export type EventReadyTypes = {
    currentTime: number;
    duration: number;
    quality: VideoQuality;
    qualityLevels: VideoQualityLevels;
};
export type EventQualityChangedTypes = {
    quality: VideoQuality;
};
export type EventCurrentTrackChangedTypes = {
    item: {
        id?: string;
    };
};
export type EventSeekChapterTypes = {
    position: number;
};
export type EventDurationChangeTypes = {
    duration: number;
};
export type EventProgressTypes = {
    bufferedTime: number;
};
export type EventTimeUpdateTypes = {
    currentTime: number;
};
export type EventVolumeChangeTypes = {
    muted: boolean;
    volume: number;
};
export type EventPlaybackRateChangeTypes = {
    playbackRate: number;
};
export type EventPipChangeTypes = {
    isPip: boolean;
};
export type EventSizeChangedTypes = {
    width: number;
    height: number;
};
export type EventFullscreenChangeTypes = {
    isFullscreen: boolean;
    video: boolean;
};
export type EventCallActionTypes = {
    id: string;
    title?: string;
    type: string;
};
export type EventCallBookmarkTypes = {
    id: string;
    time: number;
};
export type EventErrorTypes = {
    error: unknown;
};
export type QueryTypes = {
    seek?: number;
    duration?: number;
};
export type PlayerPropsTypes = {
    videoId: string | string[];
    query?: QueryTypes;
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
    preload?: PreloadTypes;
    muted?: boolean;
    language?: 'ru' | 'en';
    controls?: boolean;
    mainPlayButton?: boolean;
    playbackRateButton?: boolean;
    chapters?: ChapterTypes[];
    vtt?: VttTypes[];
    externalId?: string;
    drmAuthToken?: string;
    actions?: ActionsTypes[];
    bookmarks?: BookmarkTypes[];
    watermark?: WatermarkTypes;
    localStorage?: boolean;
    theme?: Theme;
    onInit?: (data: EventInitTypes) => void;
    onInitError?: (error: Error) => void;
    onReady?: (data: EventReadyTypes) => void;
    onQualityChanged?: (data: EventQualityChangedTypes) => void;
    onCurrentTrackChanged?: (data: EventCurrentTrackChangedTypes) => void;
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
    onPipChange?: (data: EventPipChangeTypes) => void;
    onSeeked?: () => void;
    onFullscreenChange?: (data: EventFullscreenChangeTypes) => void;
    onCallAction?: (data: EventCallActionTypes) => void;
    onCallBookmark?: (data: EventCallBookmarkTypes) => void;
    onError?: (data: EventErrorTypes) => void;
    onDestroy?: () => void;
};
declare class Player extends Component<PlayerPropsTypes> {
    private playerLoad;
    private readonly parentsRef;
    private player;
    static defaultProps: {
        width: string;
        height: string;
        autoPause: boolean;
        localStorage: boolean;
        playsInline: boolean;
    };
    constructor(props: any);
    componentDidUpdate(prevProps: Readonly<PlayerPropsTypes>): Promise<void>;
    componentWillUnmount(): void;
    private handleJSLoad;
    private shouldPlayerUpdate;
    private shouldPlaylistUpdate;
    private updateTitleOptions;
    private updatePosterOptions;
    private updateSubtitleOptions;
    private updateDrmAuthTokenOptions;
    private updateChaptersOptions;
    private updateVttOptions;
    private updateBookmarksOptions;
    private updateActionsOptions;
    private readyPlaylistOptions;
    private create;
    private destroy;
    private getEventList;
    private getQueryParams;
    private makeURL;
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
    getVideoQuality: () => Promise<VideoQuality>;
    setVideoQuality: (quality: VideoQuality) => Promise<void>;
    enableTextTrack: (lang: string) => Promise<void>;
    disableTextTrack: () => Promise<void>;
    closeCTA: () => Promise<void>;
    isFullscreen: () => Promise<boolean>;
    setFullscreen: (fullscreen: boolean) => Promise<void>;
    isPip: () => Promise<boolean>;
    setPip: (pip: boolean) => Promise<void>;
    getPlaylistItem: () => Promise<{
        id: string | undefined;
    } | undefined>;
    switchTo: (id: string) => Promise<void>;
    next: () => Promise<void>;
    previous: () => Promise<void>;
    private handleEventReady;
    private handleQualityChanged;
    private handleCurrentTrackChanged;
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
    private handlePipChange;
    private handleSeeked;
    private handleFullscreenChange;
    private handleCallAction;
    private handleCallBookmark;
    private handleError;
    private handleDestroy;
    render(): React.JSX.Element;
}
export default Player;
