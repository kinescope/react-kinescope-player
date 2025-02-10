import React, { Component } from 'react';
import '@kinescope/player-iframe-api-loader';
import Api = Kinescope.IframePlayer;
type PreloadTypes = NonNullable<Api.CreateOptions['behavior']>['preload'];
export type VttTypes = NonNullable<Api.PlaylistItemOptions['vtt']>[number];
export type WatermarkTypes = NonNullable<NonNullable<Api.CreateOptions['ui']>['watermark']>;
export type ThemeTypes = NonNullable<Api.CreateOptions['theme']>;
export type ChapterTypes = NonNullable<Api.PlaylistItemOptions['chapters']>[number];
export type CallToActionTypes = NonNullable<Api.PlaylistItemOptions['cta']>[number];
export type BookmarkTypes = NonNullable<Api.PlaylistItemOptions['bookmarks']>[number];
export type PlaylistOptionsTypes = NonNullable<Api.PlaylistOptions>;
export type LocalStorageTypes = NonNullable<Api.CreateOptions['behavior']>['localStorage'];
export type EventInitTypes = {
    playerId: string;
};
export type EventReadyTypes = Api.Player.EventMap[Api.Player.Events['Ready']];
export type EventQualityChangedTypes = Api.Player.EventMap[Api.Player.Events['QualityChanged']];
export type EventCurrentTrackChangedTypes = Api.Player.EventMap[Api.Player.Events['CurrentTrackChanged']];
export type EventSeekChapterTypes = Api.Player.EventMap[Api.Player.Events['SeekChapter']];
export type EventDurationChangeTypes = Api.Player.EventMap[Api.Player.Events['DurationChange']];
export type EventProgressTypes = Api.Player.EventMap[Api.Player.Events['Progress']];
export type EventTimeUpdateTypes = Api.Player.EventMap[Api.Player.Events['TimeUpdate']];
export type EventVolumeChangeTypes = Api.Player.EventMap[Api.Player.Events['VolumeChange']];
export type EventPlaybackRateChangeTypes = Api.Player.EventMap[Api.Player.Events['PlaybackRateChange']];
export type EventPipChangeTypes = Api.Player.EventMap[Api.Player.Events['PipChange']];
export type EventSizeChangedTypes = Api.Player.EventMap[Api.Player.Events['SizeChanged']];
export type EventFullscreenChangeTypes = Api.Player.EventMap[Api.Player.Events['FullscreenChange']];
export type EventCallActionTypes = Api.Player.EventMap[Api.Player.Events['CallAction']];
export type EventCallBookmarkTypes = Api.Player.EventMap[Api.Player.Events['CallBookmark']];
export type EventErrorTypes = Api.Player.EventMap[Api.Player.Events['Error']];
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
    /**
     * Whether to include subtitles when loading the video.
     * - `true` - auto-select in the following order: in the browser language, in the player language, first in the list.
     * - `string` - enable the track with the specified language.
     */
    textTrack?: boolean | string;
    chapters?: ChapterTypes[];
    vtt?: VttTypes[];
    externalId?: string;
    drmAuthToken?: string;
    callToAction?: CallToActionTypes[];
    bookmarks?: BookmarkTypes[];
    watermark?: WatermarkTypes;
    localStorage?: LocalStorageTypes;
    playlistOptions?: PlaylistOptionsTypes;
    theme?: ThemeTypes;
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
    private updateCtaOptions;
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
    pause: () => Promise<void>;
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
    getVideoQualityList: () => Promise<readonly Api.VideoQuality[]>;
    getVideoQuality: () => Promise<Api.VideoQuality>;
    setVideoQuality: (quality: Api.VideoQuality) => Promise<void>;
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
