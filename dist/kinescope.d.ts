export declare enum KinescopePlayerEvent {
    Ready = 0,
    QualityChanged = 1,
    AutoQualityChanged = 2,
    SeekChapter = 3,
    SizeChanged = 4,
    Play = 5,
    Playing = 6,
    Waiting = 7,
    Pause = 8,
    Ended = 9,
    TimeUpdate = 10,
    Progress = 11,
    DurationChange = 12,
    VolumeChange = 13,
    PlaybackRateChange = 14,
    Seeking = 15,
    FullscreenChange = 16,
    CallAction = 17,
    CallBookmark = 18,
    Error = 19,
    Destroy = 20
}
export interface PlaylistItemOptions {
    title?: string;
    subtitle?: string;
    poster?: string;
    vtt?: {
        label: string;
        src: string;
        srcLang: string;
    }[];
    chapters?: {
        position: number;
        title: string;
    }[];
    bookmarks?: {
        id: string;
        time: number;
    }[];
}
export declare type VideoQuality = 'index' | 144 | 240 | 360 | 480 | 576 | 720 | 1080 | 1440 | 2160 | 4320;
export interface KinescopePlayer {
    on: (event: KinescopePlayerEvent, callback: any) => void;
    off: (event: KinescopePlayerEvent, callback: any) => void;
    Events: typeof KinescopePlayerEvent;
    isPaused(): Promise<boolean>;
    isEnded(): Promise<boolean>;
    play(): Promise<void>;
    pause(): Promise<boolean>;
    stop(): Promise<void>;
    getCurrentTime(): Promise<number>;
    getDuration(): Promise<number>;
    seekTo(time: number): Promise<void>;
    isMuted(): Promise<boolean>;
    mute(): Promise<void>;
    unmute(): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(value: number): Promise<void>;
    getPlaybackRate(): Promise<number>;
    setPlaybackRate(value: number): Promise<void>;
    getVideoQualityList(): Promise<VideoQuality[]>;
    getCurrentVideoQuality(): Promise<VideoQuality>;
    setVideoQuality(quality: VideoQuality): Promise<void>;
    enableTextTrack(lang: string): Promise<void>;
    disableTextTrack(): Promise<void>;
    isFullscreen(): Promise<boolean>;
    setFullscreen(fullscreen: boolean): Promise<void>;
    setPlaylistItemOptions(options: PlaylistItemOptions): Promise<void>;
    destroy(): void;
}
interface KinescopeCreateOptions {
    url: string;
    size?: {
        width?: number | string;
        height?: number | string;
    };
    playlist: PlaylistItemOptions[];
    behaviour?: {
        autoPlay?: boolean | 'viewable';
        autoPause?: boolean | 'reset';
        loop?: boolean;
        playsInline?: boolean;
        muted?: boolean;
    };
    ui?: {
        language?: 'ru' | 'en';
    };
    settings?: {
        externalId?: string;
    };
    actions?: {
        id: string;
        title?: string;
        type: 'note';
    }[];
}
declare global {
    interface Window {
        Kinescope: {
            IframePlayer: {
                create: (id: string, options: KinescopeCreateOptions) => Promise<KinescopePlayer>;
            };
        };
    }
}
export {};
