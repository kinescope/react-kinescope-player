import React, {Component, createRef} from 'react';
import isEqual from 'react-fast-compare';
import {
	KinescopePlayerEvent,
	KinescopePlayer,
	VideoQuality,
	VideoQualityLevels,
	PlaylistItemOptions,
	ActionCallToAction,
	ActionToolBar,
	KinescopeCreateOptions,
	WatermarkTypes,
} from './kinescope';
import Loader from './loader';
import {VIDEO_HOST, VIDEO_PLAYLIST_HOST} from './constant';

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

export type ActionsTypes = ActionToolBar | ActionCallToAction;

export type BookmarkTypes = {
	id: string;
	time: number;
	title?: string;
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
	item: {id?: string};
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
	onSeeked?: () => void;
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

class Player extends Component<PlayerPropsTypes> {
	private playerLoad: boolean;
	private readonly parentsRef: React.RefObject<HTMLDivElement>;
	private player: KinescopePlayer | null;

	static defaultProps = {
		width: '100%',
		height: '100%',
		autoPause: true,
		localStorage: true,
		playsInline: true,
	};

	constructor(props) {
		super(props);
		this.playerLoad = false;
		this.parentsRef = createRef();
		this.player = null;
	}

	async componentDidUpdate(prevProps: Readonly<PlayerPropsTypes>) {
		await this.shouldPlayerUpdate(prevProps);
		await this.shouldPlaylistUpdate(prevProps);
	}

	componentWillUnmount() {
		this.destroy();
	}

	private handleJSLoad = async () => {
		if (this.playerLoad) {
			return;
		}
		this.playerLoad = true;
		const {onJSLoad} = this.props;
		onJSLoad && onJSLoad();
		await this.create();
	};

	private shouldPlayerUpdate = async prevProps => {
		const {
			videoId,
			query,
			width,
			height,
			autoPause,
			autoPlay,
			loop,
			muted,
			playsInline,
			language,
			controls,
			mainPlayButton,
			playbackRateButton,
			watermark,
			localStorage,
		} = this.props;

		if (muted !== prevProps.muted) {
			muted ? this.mute() : this.unmute();
		}

		if (
			!isEqual(videoId, prevProps.videoId) ||
			!isEqual(query, prevProps.query) ||
			width !== prevProps.width ||
			height !== prevProps.height ||
			autoPause !== prevProps.autoPause ||
			autoPlay !== prevProps.autoPlay ||
			loop !== prevProps.loop ||
			playsInline !== prevProps.playsInline ||
			language !== prevProps.language ||
			controls !== prevProps.controls ||
			mainPlayButton !== prevProps.mainPlayButton ||
			playbackRateButton !== prevProps.playbackRateButton ||
			!isEqual(watermark, prevProps.watermark) ||
			!isEqual(localStorage, prevProps.localStorage)
		) {
			await this.create();
		}
	};

	private shouldPlaylistUpdate = async prevProps => {
		const {title, subtitle, poster, chapters, vtt, bookmarks, actions, drmAuthToken} = this.props;

		if (title !== prevProps.title) {
			await this.updateTitleOptions();
		}

		if (poster !== prevProps.poster) {
			await this.updatePosterOptions();
		}

		if (subtitle !== prevProps.subtitle) {
			await this.updateSubtitleOptions();
		}

		if (drmAuthToken !== prevProps.drmAuthToken) {
			await this.updateDrmAuthTokenOptions();
		}

		if (!isEqual(chapters, prevProps.chapters)) {
			await this.updateChaptersOptions();
		}

		if (!isEqual(vtt, prevProps.vtt)) {
			await this.updateVttOptions();
		}

		if (!isEqual(bookmarks, prevProps.bookmarks)) {
			await this.updateBookmarksOptions();
		}

		if (!isEqual(actions, prevProps.actions)) {
			await this.updateActionsOptions();
		}
	};

	private updateTitleOptions = async () => {
		const {title} = this.props;
		await this.setPlaylistItemOptions({
			title: title,
		});
	};

	private updatePosterOptions = async () => {
		const {poster} = this.props;
		await this.setPlaylistItemOptions({
			poster: poster,
		});
	};

	private updateSubtitleOptions = async () => {
		const {subtitle} = this.props;
		await this.setPlaylistItemOptions({
			subtitle: subtitle,
		});
	};

	private updateDrmAuthTokenOptions = async () => {
		const {drmAuthToken} = this.props;
		await this.setPlaylistItemOptions({
			drm: {
				auth: {
					token: drmAuthToken,
				},
			},
		});
	};

	private updateChaptersOptions = async () => {
		const {chapters} = this.props;
		await this.setPlaylistItemOptions({
			chapters: chapters,
		});
	};

	private updateVttOptions = async () => {
		const {vtt} = this.props;
		await this.setPlaylistItemOptions({
			vtt: vtt,
		});
	};

	private updateBookmarksOptions = async () => {
		const {bookmarks} = this.props;
		await this.setPlaylistItemOptions({
			bookmarks: bookmarks,
		});
	};

	private updateActionsOptions = async () => {
		const {actions} = this.props;
		await this.setPlaylistItemOptions({
			actions: actions,
		});
	};

	private readyPlaylistOptions = async () => {
		const {title, subtitle, poster, chapters, vtt, bookmarks, actions, drmAuthToken} = this.props;
		let options: PlaylistItemOptions = {};

		if (title !== undefined) {
			options.title = title;
		}
		if (subtitle !== undefined) {
			options.subtitle = subtitle;
		}
		if (poster !== undefined) {
			options.poster = poster;
		}
		if (chapters !== undefined) {
			options.chapters = chapters;
		}
		if (vtt !== undefined) {
			options.vtt = vtt;
		}
		if (bookmarks !== undefined) {
			options.bookmarks = bookmarks;
		}
		if (actions !== undefined) {
			options.actions = actions;
		}
		if (drmAuthToken !== undefined) {
			options.drm = {
				auth: {
					token: drmAuthToken,
				},
			};
		}

		await this.setPlaylistItemOptions(options);
	};

	private create = async () => {
		await this.destroy();

		const parentsRef = this.parentsRef.current;
		if (!this.playerLoad || !parentsRef) {
			return;
		}

		/* create playerId */
		parentsRef.textContent = '';
		const playerId = getNextPlayerId();
		const playerDiv = document.createElement('div');
		playerDiv.setAttribute('id', playerId);
		parentsRef.appendChild(playerDiv);

		/* fast re create player fix */
		await new Promise(resolve => {
			setTimeout(resolve, 0);
		});
		if (!document.getElementById(playerId)) {
			return;
		}

		this.player = await this.createPlayer(playerId);
		this.getEventList().forEach(event => {
			this.player?.on(event[0], event[1]);
		});
	};

	private destroy = async () => {
		if (!this.player) {
			return;
		}
		await this.player.destroy();
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
			[Events.CurrentTrackChanged, this.handleCurrentTrackChanged],
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
			[Events.Seeked, this.handleSeeked],
			[Events.FullscreenChange, this.handleFullscreenChange],
			[Events.CallAction, this.handleCallAction],
			[Events.CallBookmark, this.handleCallBookmark],
			[Events.Error, this.handleError],
			[Events.Destroy, this.handleDestroy],
		];
	};

	private getQueryParams = () => {
		const {query} = this.props;
		const params: [string, string][] = [];
		query?.duration && params.push(['duration', query.duration.toString()]);
		query?.seek && params.push(['seek', query.seek.toString()]);
		return params;
	};

	private makeURL = (url: string) => {
		const _url = new URL(url);
		this.getQueryParams().forEach(function (params) {
			_url.searchParams.append(params[0], params[1]);
		});
		return _url.toString();
	};

	private getIFrameUrl = () => {
		const {videoId} = this.props;
		if (Array.isArray(videoId)) {
			return this.makeURL(VIDEO_PLAYLIST_HOST + videoId.join(','));
		}
		return this.makeURL(VIDEO_HOST + videoId);
	};

	private createPlayer = playerId => {
		const {
			title,
			subtitle,
			poster,
			chapters,
			vtt,
			externalId,
			drmAuthToken,
			width,
			height,
			autoPause,
			autoPlay,
			loop,
			muted,
			playsInline,
			language,
			controls,
			mainPlayButton,
			playbackRateButton,
			bookmarks,
			actions,
			watermark,
			localStorage,
		} = this.props;

		let options: KinescopeCreateOptions = {
			url: this.getIFrameUrl(),
			size: {width: width, height: height},
			behaviour: {
				autoPause: autoPause,
				autoPlay: autoPlay,
				loop: loop,
				muted: muted,
				playsInline: playsInline,
				localStorage: localStorage,
			},
			playlist: [
				{
					title: title,
					subtitle: subtitle,
					poster: poster,
					chapters: chapters,
					vtt: vtt,
					bookmarks: bookmarks,
					actions: actions,
					drm: {
						auth: {
							token: drmAuthToken,
						},
					},
				},
			],
			ui: {
				language: language,
				controls: controls,
				mainPlayButton: mainPlayButton,
				playbackRateButton: playbackRateButton,
				watermark: watermark,
			},
			settings: {
				externalId: externalId,
			},
		};

		return window.Kinescope.IframePlayer.create(playerId, options);
	};

	private setPlaylistItemOptions = async (options: PlaylistItemOptions): Promise<void> => {
		if (!this.player) {
			return Promise.resolve();
		}
		await this.player.setPlaylistItemOptions(options);
	};

	public isPaused = (): Promise<boolean> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.isPaused();
	};

	public isEnded = (): Promise<boolean> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.isEnded();
	};

	public play = (): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.play();
	};

	public pause = (): Promise<boolean> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.pause();
	};

	public stop = (): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.stop();
	};

	public getCurrentTime = (): Promise<number> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.getCurrentTime();
	};

	public getDuration = (): Promise<number> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.getDuration();
	};

	public seekTo = (time: number): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.seekTo(time);
	};

	public isMuted = (): Promise<boolean> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.isMuted();
	};

	public mute = () => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.mute();
	};

	public unmute = () => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.unmute();
	};

	public getVolume = (): Promise<number> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.getVolume();
	};

	public setVolume = (value: number): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.setVolume(value);
	};

	public getPlaybackRate = (): Promise<number> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.getPlaybackRate();
	};

	public setPlaybackRate = (value: number): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.setPlaybackRate(value);
	};

	public getVideoQualityList = (): Promise<VideoQuality[]> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.getVideoQualityList();
	};

	public getVideoQuality = (): Promise<VideoQuality> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.getVideoQuality();
	};

	public setVideoQuality = (quality: VideoQuality): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.setVideoQuality(quality);
	};

	public enableTextTrack = (lang: string): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.enableTextTrack(lang);
	};

	public disableTextTrack = (): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.disableTextTrack();
	};

	public closeCTA = (): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.closeCTA();
	};

	public isFullscreen = (): Promise<boolean> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.isFullscreen();
	};

	public setFullscreen = (fullscreen: boolean): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.setFullscreen(fullscreen);
	};

	public getPlaylistItem = (): Promise<{id: string | undefined} | undefined> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.getPlaylistItem();
	};

	public switchTo = (id: string): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.switchTo(id);
	};

	public next = (): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.next();
	};

	public previous = (): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.next();
	};

	private handleEventReady = ({data}) => {
		const {onReady} = this.props;
		this.readyPlaylistOptions();
		onReady && onReady(data);
	};

	private handleQualityChanged = ({data}) => {
		const {onQualityChanged} = this.props;
		onQualityChanged && onQualityChanged(data);
	};

	private handleCurrentTrackChanged = ({data}) => {
		const {onCurrentTrackChanged} = this.props;
		onCurrentTrackChanged && onCurrentTrackChanged(data);
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

	private handleSeeked = () => {
		const {onSeeked} = this.props;
		onSeeked && onSeeked();
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
