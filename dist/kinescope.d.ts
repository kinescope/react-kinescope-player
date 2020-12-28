export declare enum KinescopePlayerEvent {
    Ready = 0,
    QualityChanged = 1,
    AutoQualityChanged = 2,
    SizeChanged = 3,
    Play = 4,
    Playing = 5,
    Waiting = 6,
    Pause = 7,
    Ended = 8,
    TimeUpdate = 9,
    Progress = 10,
    DurationChange = 11,
    VolumeChange = 12,
    PlaybackRateChange = 13,
    Seeking = 14,
    FullscreenChange = 15,
    Error = 16,
    Destroy = 17
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
