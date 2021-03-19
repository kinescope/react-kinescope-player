import React, {Component, createRef} from 'react';
import isEqual from 'react-fast-compare';
import {
	KinescopePlayerEvent,
	KinescopePlayer,
	VideoQuality,
	PlaylistItemOptions,
} from './kinescope';
import Loader from './loader';
import {VIDEO_HOST} from './constant';

const THROW_PLAYER_NOT_READY = 'Player not ready';

type CallbackTypes = (any) => void;
type EventListTypes = [KinescopePlayerEvent, CallbackTypes][];

export type VttTypes = {
	label: string;
	src: string;
	srcLang: string;
};

export type ChapterTypes = {
	position: number;
	title: string;
};

export type ActionsTypes = {
	id: string;
	title?: string;
	type: 'note';
};

export type BookmarkTypes = {
	id: string;
	time: number;
	title?: string;
};

export type EventReadyTypes = {
	currentTime: number;
	duration: number;
	quality: number;
};

export type EventQualityChangedTypes = {
	quality: number;
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
	playbackRate: boolean;
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

type PlayerProps = {
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

let index = 1;

function getNextIndex() {
	return index++;
}

function getNextPlayerId() {
	return `__kinescope_player_${getNextIndex()}`;
}

class Player extends Component<PlayerProps> {
	private playerLoad: boolean;
	private readonly parentsRef: React.RefObject<HTMLDivElement>;
	private player: KinescopePlayer | null;

	static defaultProps = {
		width: '100%',
		height: '100%',
		autoPause: true,
		playsInline: true,
	};

	constructor(props) {
		super(props);
		this.playerLoad = false;
		this.parentsRef = createRef();
		this.player = null;
	}

	componentDidMount() {
		if (this.playerLoad) {
			this.create();
		}
	}

	async componentDidUpdate(prevProps: Readonly<PlayerProps>) {
		await this.shouldPlayerUpdate(prevProps);
		await this.shouldPlaylistUpdate(prevProps);
	}

	componentWillUnmount() {
		this.destroy();
	}

	private handleJSLoad = async () => {
		this.playerLoad = true;
		const {onJSLoad} = this.props;
		onJSLoad && onJSLoad();
		await this.create();
	};

	private shouldPlayerUpdate = async prevProps => {
		const {
			videoId,
			width,
			height,
			autoPause,
			autoPlay,
			loop,
			muted,
			playsInline,
			language,
			actions,
		} = this.props;

		if (
			videoId !== prevProps.videoId ||
			width !== prevProps.width ||
			height !== prevProps.height ||
			autoPause !== prevProps.autoPause ||
			autoPlay !== prevProps.autoPlay ||
			loop !== prevProps.loop ||
			muted !== prevProps.muted ||
			playsInline !== prevProps.playsInline ||
			language !== prevProps.language ||
			!isEqual(actions, prevProps.actions)
		) {
			await this.destroy();
			await this.create();
		}
	};

	private shouldPlaylistUpdate = async prevProps => {
		const {title, subtitle, poster, chapters, vtt, bookmarks} = this.props;

		if (
			title !== prevProps.title ||
			subtitle !== prevProps.subtitle ||
			poster !== prevProps.poster ||
			!isEqual(chapters, prevProps.chapters) ||
			!isEqual(vtt, prevProps.vtt) ||
			!isEqual(bookmarks, prevProps.bookmarks)
		) {
			await this.updatePlaylistOptions();
		}
	};

	private updatePlaylistOptions = async () => {
		const {title, subtitle, poster, chapters, vtt, bookmarks} = this.props;
		let options: PlaylistItemOptions = {
			title: title,
			poster: poster,
			subtitle: subtitle,
			chapters: chapters,
			vtt: vtt,
			bookmarks: bookmarks,
		};
		await this.setPlaylistItemOptions(options);
	};

	private create = async () => {
		const parentsRef = this.parentsRef.current;
		if (!this.playerLoad || !parentsRef) {
			return;
		}

		const playerId = getNextPlayerId();
		const playerDiv = document.createElement('div');
		playerDiv.setAttribute('id', playerId);
		parentsRef.appendChild(playerDiv);

		this.player = await this.createPlayer(playerId);
		this.getEventList().forEach(event => {
			this.player?.on(event[0], event[1]);
		});
	};

	private destroy = () => {
		if (!this.player) {
			return;
		}
		this.player.destroy();
		this.player = null;
	};

	private getEventList = (): EventListTypes => {
		const Events = this.player?.Events;
		if (!Events) {
			return [];
		}
		return [
			[Events.Ready, this.handleEventReady],
			[Events.QualityChanged, this.handleQualityChanged],
			[Events.AutoQualityChanged, this.handleAutoQualityChanged],
			[Events.SeekChapter, this.handleSeekChapter],
			[Events.SizeChanged, this.handleSizeChanged],
			[Events.Play, this.handlePlay],
			[Events.Playing, this.handlePlaying],
			[Events.Waiting, this.handleWaiting],
			[Events.Pause, this.handlePause],
			[Events.Ended, this.handleEnded],
			[Events.TimeUpdate, this.handleTimeUpdate],
			[Events.Progress, this.handleProgress],
			[Events.DurationChange, this.handleDurationChange],
			[Events.VolumeChange, this.handleVolumeChange],
			[Events.PlaybackRateChange, this.handlePlaybackRateChange],
			[Events.Seeking, this.handleSeeking],
			[Events.FullscreenChange, this.handleFullscreenChange],
			[Events.CallAction, this.handleCallAction],
			[Events.CallBookmark, this.handleCallBookmark],
			[Events.Error, this.handleError],
			[Events.Destroy, this.handleDestroy],
		];
	};

	private getIFrameUrl = () => {
		const {videoId} = this.props;
		return VIDEO_HOST + videoId;
	};

	private createPlayer = playerId => {
		const {
			title,
			subtitle,
			poster,
			chapters,
			vtt,
			externalId,
			width,
			height,
			autoPause,
			autoPlay,
			loop,
			muted,
			playsInline,
			language,
			bookmarks,
			actions,
		} = this.props;

		const options = {
			url: this.getIFrameUrl(),
			size: {width: width, height: height},
			behaviour: {
				crossOrigin: 'use-credentials',
				autoPause: autoPause,
				autoPlay: autoPlay,
				loop: loop,
				muted: muted,
				playsInline: playsInline,
			},
			actions: actions,
			playlist: [
				{
					title: title,
					subtitle: subtitle,
					poster: poster,
					chapters: chapters,
					vtt: vtt,
					bookmarks: bookmarks,
				},
			],
			ui: {
				language: language,
			},
			settings: {
				externalId: externalId,
			},
		};

		return window.Kinescope.IframePlayer.create(playerId, options);
	};

	private setPlaylistItemOptions = (options: PlaylistItemOptions): Promise<void> => {
		if (this.player) {
			return this.player.setPlaylistItemOptions(options);
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public isPaused = (): Promise<boolean> => {
		if (this.player) {
			return this.player.isPaused();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public isEnded = (): Promise<boolean> => {
		if (this.player) {
			return this.player.isEnded();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public play = (): Promise<void> => {
		if (this.player) {
			return this.player.play();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public pause = (): Promise<boolean> => {
		if (this.player) {
			return this.player.pause();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public stop = (): Promise<void> => {
		if (this.player) {
			return this.player.stop();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public getCurrentTime = (): Promise<number> => {
		if (this.player) {
			return this.player.getCurrentTime();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public getDuration = (): Promise<number> => {
		if (this.player) {
			return this.player.getDuration();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public seekTo = (time: number): Promise<void> => {
		if (this.player) {
			return this.player.seekTo(time);
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public isMuted = (): Promise<boolean> => {
		if (this.player) {
			return this.player.isMuted();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public mute = () => {
		if (this.player) {
			return this.player.mute();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public unmute = () => {
		if (this.player) {
			return this.player.unmute();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public getVolume = (): Promise<number> => {
		if (this.player) {
			return this.player.getVolume();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public setVolume = (value: number): Promise<void> => {
		if (this.player) {
			return this.player.setVolume(value);
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public getPlaybackRate = (): Promise<number> => {
		if (this.player) {
			return this.player.getPlaybackRate();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public setPlaybackRate = (value: number): Promise<void> => {
		if (this.player) {
			return this.player.setPlaybackRate(value);
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public getVideoQualityList = (): Promise<VideoQuality[]> => {
		if (this.player) {
			return this.player.getVideoQualityList();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public getCurrentVideoQuality = (): Promise<VideoQuality> => {
		if (this.player) {
			return this.player.getCurrentVideoQuality();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public setVideoQuality = (quality: VideoQuality): Promise<void> => {
		if (this.player) {
			return this.player.setVideoQuality(quality);
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public enableTextTrack = (lang: string): Promise<void> => {
		if (this.player) {
			return this.player.enableTextTrack(lang);
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public disableTextTrack = (): Promise<void> => {
		if (this.player) {
			return this.player.disableTextTrack();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public isFullscreen = (): Promise<boolean> => {
		if (this.player) {
			return this.player.isFullscreen();
		}
		throw THROW_PLAYER_NOT_READY;
	};

	public setFullscreen = (fullscreen: boolean): Promise<void> => {
		if (this.player) {
			return this.player.setFullscreen(fullscreen);
		}
		throw THROW_PLAYER_NOT_READY;
	};

	private handleEventReady = ({data}) => {
		const {onReady} = this.props;
		this.updatePlaylistOptions();
		onReady && onReady(data);
	};

	private handleQualityChanged = ({data}) => {
		const {onQualityChanged} = this.props;
		onQualityChanged && onQualityChanged(data);
	};

	private handleAutoQualityChanged = ({data}) => {
		const {onAutoQualityChanged} = this.props;
		onAutoQualityChanged && onAutoQualityChanged(data);
	};

	private handleSeekChapter = ({data}) => {
		const {onSeekChapter} = this.props;
		onSeekChapter && onSeekChapter(data);
	};

	private handleSizeChanged = ({data}) => {
		const {onSizeChanged} = this.props;
		onSizeChanged && onSizeChanged(data);
	};

	private handlePlay = () => {
		const {onPlay} = this.props;
		onPlay && onPlay();
	};

	private handlePlaying = () => {
		const {onPlaying} = this.props;
		onPlaying && onPlaying();
	};

	private handleWaiting = () => {
		const {onWaiting} = this.props;
		onWaiting && onWaiting();
	};

	private handlePause = () => {
		const {onPause} = this.props;
		onPause && onPause();
	};

	private handleEnded = () => {
		const {onEnded} = this.props;
		onEnded && onEnded();
	};

	private handleTimeUpdate = ({data}) => {
		const {onTimeUpdate} = this.props;
		onTimeUpdate && onTimeUpdate(data);
	};

	private handleProgress = ({data}) => {
		const {onProgress} = this.props;
		onProgress && onProgress(data);
	};

	private handleDurationChange = ({data}) => {
		const {onDurationChange} = this.props;
		onDurationChange && onDurationChange(data);
	};

	private handleVolumeChange = ({data}) => {
		const {onVolumeChange} = this.props;
		onVolumeChange && onVolumeChange(data);
	};

	private handlePlaybackRateChange = ({data}) => {
		const {onPlaybackRateChange} = this.props;
		onPlaybackRateChange && onPlaybackRateChange(data);
	};

	private handleSeeking = () => {
		const {onSeeking} = this.props;
		onSeeking && onSeeking();
	};

	private handleFullscreenChange = ({data}) => {
		const {onFullscreenChange} = this.props;
		onFullscreenChange && onFullscreenChange(data);
	};

	private handleCallAction = ({data}) => {
		const {onCallAction} = this.props;
		onCallAction && onCallAction(data);
	};

	private handleCallBookmark = ({data}) => {
		const {onCallBookmark} = this.props;
		onCallBookmark && onCallBookmark(data);
	};

	private handleError = ({data}) => {
		const {onError} = this.props;
		onError && onError(data);
	};

	private handleDestroy = () => {
		const {onDestroy} = this.props;
		onDestroy && onDestroy();
	};

	render() {
		const {className, style, onJSLoadError} = this.props;

		return (
			<Loader onJSLoad={this.handleJSLoad} onJSLoadError={onJSLoadError}>
				<span ref={this.parentsRef} className={className} style={style} />
			</Loader>
		);
	}
}

export default Player;
