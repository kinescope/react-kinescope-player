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

type VttTypes = {
	label: string;
	src: string;
	srcLang: string;
};

type ChapterTypes = {
	position: number;
	title: string;
};

type onReadyTypes = {
	currentTime: number;
	duration: number;
	quality: number;
};

type onQualityChangedTypes = {
	quality: number;
};

type onDurationChangeTypes = {
	duration: number;
};

type onProgressTypes = {
	bufferedTime: number;
};

type onTimeUpdateTypes = {
	currentTime: number;
};

type onVolumeChangeTypes = {
	muted: boolean;
	volume: number;
};

type onPlaybackRateChangeTypes = {
	playbackRate: boolean;
};

type onSizeChangedTypes = {
	width: number;
	height: number;
};

type onFullscreenChangeTypes = {
	isFullscreen: boolean;
	video: boolean;
};

type onErrorTypes = {
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
			language !== prevProps.language
		) {
			await this.destroy();
			await this.create();
		}
	};

	private shouldPlaylistUpdate = async prevProps => {
		const {title, subtitle, poster, chapters, vtt} = this.props;

		if (
			title !== prevProps.title ||
			subtitle !== prevProps.subtitle ||
			poster !== prevProps.poster ||
			!isEqual(chapters, prevProps.chapters) ||
			!isEqual(vtt, prevProps.vtt)
		) {
			await this.updatePlaylistOptions();
		}
	};

	private updatePlaylistOptions = async () => {
		const {title, subtitle, poster, chapters, vtt} = this.props;
		let options: PlaylistItemOptions = {
			title: title,
			poster: poster,
			subtitle: subtitle,
			chapters: chapters,
			vtt: vtt,
		};
		await this.setPlaylistItemOptions(options);
	};

	private create = async () => {
		if (!this.playerLoad) {
			return;
		}

		const parentsRef = this.parentsRef.current;
		if (!parentsRef) {
			throw THROW_PLAYER_NOT_READY;
		}

		const playerId = getNextPlayerId();
		const playerDiv = document.createElement('div');
		playerDiv.setAttribute('id', playerId);
		parentsRef.appendChild(playerDiv);

		this.player = await this.createPlayer(playerId);
		this.getEventList().forEach(event => {
			this.player?.on(event[0], event[1]);
		});
		await this.updatePlaylistOptions();
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
			[Events.Error, this.handleError],
			[Events.Destroy, this.handleDestroy],
		];
	};

	private getIFrameUrl = () => {
		const {videoId} = this.props;
		return VIDEO_HOST + videoId;
	};

	private createPlayer = playerId => {
		const {width, height, autoPause, autoPlay, loop, muted, playsInline, language} = this.props;

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
			ui: {
				language: language,
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