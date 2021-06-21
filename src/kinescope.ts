import type {CSSProperties} from 'react';

export enum KinescopePlayerEvent {
	Ready,
	QualityChanged,
	AutoQualityChanged,
	SeekChapter,
	SizeChanged,
	Play,
	Playing,
	Waiting,
	Pause,
	Ended,
	TimeUpdate,
	Progress,
	DurationChange,
	VolumeChange,
	PlaybackRateChange,
	Seeking,
	FullscreenChange,
	CallAction,
	CallBookmark,
	Error,
	Destroy,
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
		title?: string;
	}[];
	actions?: (ActionToolBar | ActionCallToAction)[];
}

export type VideoQuality =
	| 'auto'
	| 'index'
	| 144
	| 240
	| 360
	| 480
	| 576
	| 720
	| 1080
	| 1440
	| 2160
	| 4320;

export type VideoQualityLevels = {
	[quality in VideoQuality]: {
		level: number;
		url?: string;
	};
};

export type WatermarkModeTypes = 'stripes' | 'random';

export type ActionToolBar = {
	id: string;
	type: 'tool';
	title?: string;
	icon: 'note';
};

export type ActionCallToAction = {
	id: string;
	type: 'cta';
	title: string;
	description?: string;
	skipable?: boolean;
	buttonStyle?: CSSProperties;
	trigger: {
		percentages: number[];
		timePoints: number[];
		pause: boolean;
	};
};

export interface KinescopePlayer {
	on: (event: KinescopePlayerEvent, callback: any) => void;
	once: (event: KinescopePlayerEvent, callback: any) => void;
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
	closeCTA(): Promise<void>;
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
		watermark?: {
			text: string;
			mode?: WatermarkModeTypes;
		};
	};
	settings?: {
		externalId?: string;
	};
	/** @deprecated */
	actions?: (ActionToolBar | ActionCallToAction)[];
}

declare global {
	interface Window {
		Kinescope: {
			IframePlayer: {
				create: (id: string, options: KinescopeCreateOptions) => Promise<KinescopePlayer>;
				version: string;
			};
		};
	}
}
