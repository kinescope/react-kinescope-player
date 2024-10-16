import React, {Component, createRef} from 'react';
import isEqual from 'react-fast-compare';
import '@kinescope/player-iframe-api-loader';
import Loader from './loader';
import {VIDEO_HOST, VIDEO_PLAYLIST_HOST} from './constant';

import Api = Kinescope.IframePlayer;

type CallbackTypes = (event: any) => void;
type EventListTypes = [Api.Player.EventType, CallbackTypes][];

type PreloadTypes = NonNullable<Api.CreateOptions['behavior']>['preload'];

export type VttTypes = NonNullable<Api.PlaylistItemOptions['vtt']>[number];

type WatermarkTypes = NonNullable<NonNullable<Api.CreateOptions['ui']>['watermark']>;

type ThemeTypes = NonNullable<Api.CreateOptions['theme']>;

export type ChapterTypes = NonNullable<Api.PlaylistItemOptions['chapters']>[number];

export type ActionCallToActionTypes = NonNullable<Api.PlaylistItemOptions['cta']>[number];

export type BookmarkTypes = NonNullable<Api.PlaylistItemOptions['bookmarks']>[number];

export type EventInitTypes = {
	playerId: string;
};

export type EventReadyTypes = Api.Player.EventMap[Api.Player.Events['Ready']];

export type EventQualityChangedTypes = Api.Player.EventMap[Api.Player.Events['QualityChanged']];

export type EventCurrentTrackChangedTypes =
	Api.Player.EventMap[Api.Player.Events['CurrentTrackChanged']];

export type EventSeekChapterTypes = Api.Player.EventMap[Api.Player.Events['SeekChapter']];

export type EventDurationChangeTypes = Api.Player.EventMap[Api.Player.Events['DurationChange']];

export type EventProgressTypes = Api.Player.EventMap[Api.Player.Events['Progress']];

export type EventTimeUpdateTypes = Api.Player.EventMap[Api.Player.Events['TimeUpdate']];

export type EventVolumeChangeTypes = Api.Player.EventMap[Api.Player.Events['VolumeChange']];

export type EventPlaybackRateChangeTypes =
	Api.Player.EventMap[Api.Player.Events['PlaybackRateChange']];

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
	chapters?: ChapterTypes[];
	vtt?: VttTypes[];
	externalId?: string;
	drmAuthToken?: string;
	callToAction?: ActionCallToActionTypes[];
	bookmarks?: BookmarkTypes[];
	watermark?: WatermarkTypes;
	localStorage?: boolean;
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
	private player: Api.Player | null;

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
			preload,
			language,
			controls,
			mainPlayButton,
			playbackRateButton,
			watermark,
			localStorage,
			theme,
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
			preload !== prevProps.preload ||
			language !== prevProps.language ||
			controls !== prevProps.controls ||
			mainPlayButton !== prevProps.mainPlayButton ||
			playbackRateButton !== prevProps.playbackRateButton ||
			!isEqual(watermark, prevProps.watermark) ||
			!isEqual(localStorage, prevProps.localStorage) ||
			!isEqual(theme, prevProps.theme)
		) {
			await this.create();
		}
	};

	private shouldPlaylistUpdate = async (prevProps: PlayerPropsTypes) => {
		const {title, subtitle, poster, chapters, vtt, bookmarks, callToAction, drmAuthToken} =
			this.props;

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

		if (!isEqual(callToAction, prevProps.callToAction)) {
			await this.updateCtaOptions();
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

	private updateCtaOptions = async () => {
		const {callToAction} = this.props;
		await this.setPlaylistItemOptions({
			cta: callToAction,
		});
	};

	private readyPlaylistOptions = async () => {
		const {title, subtitle, poster, chapters, vtt, bookmarks, callToAction, drmAuthToken} =
			this.props;
		let options: Api.PlaylistItemOptions = {};

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
		if (callToAction !== undefined) {
			options.cta = callToAction;
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
		const {onInit, onInitError} = this.props;
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

		/* fast re-create player fix */
		await new Promise(resolve => {
			setTimeout(resolve, 0);
		});
		if (!document.getElementById(playerId)) {
			return;
		}
		this.player = await new Promise((resolve, reject) => {
			this.createPlayer(playerId)
				.then(player => {
					resolve(player);
					onInit && onInit({playerId: playerId});
				})
				.catch((e: Error) => {
					reject(e);
					onInitError && onInitError(e);
				});
		});
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
			[Events.PipChange, this.handlePipChange],
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

	private createPlayer = async (playerId: string) => {
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
			preload,
			language,
			controls,
			mainPlayButton,
			playbackRateButton,
			bookmarks,
			callToAction,
			watermark,
			localStorage,
			theme,
		} = this.props;

		let options: Api.CreateOptions = {
			url: this.getIFrameUrl(),
			size: {width: width, height: height},
			behavior: {
				autoPause: autoPause,
				autoPlay: autoPlay,
				loop: loop,
				muted: muted,
				playsInline: playsInline,
				preload: preload,
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
					cta: callToAction,
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
			theme: theme,
			settings: {
				externalId: externalId,
			},
		};

		if (!window.Kinescope?.IframePlayer)
			throw new Error('Kinescope PLayer: IframeApi is not loaded.');

		return window.Kinescope.IframePlayer.create(playerId, options);
	};

	private setPlaylistItemOptions = async (options: Api.PlaylistItemOptions): Promise<void> => {
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

	public pause = (): Promise<void> => {
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

	public getVideoQualityList = (): Promise<readonly Api.VideoQuality[]> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.getVideoQualityList();
	};

	public getVideoQuality = (): Promise<Api.VideoQuality> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.getVideoQuality();
	};

	public setVideoQuality = (quality: Api.VideoQuality): Promise<void> => {
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

	public isPip = (): Promise<boolean> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.isPip();
	};

	public setPip = (pip: boolean): Promise<void> => {
		if (!this.player) {
			return Promise.reject(null);
		}
		return this.player.setPip(pip);
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
		return this.player.previous();
	};

	private handleEventReady: Api.Player.EventHandler<Api.Player.Events['Ready']> = ({data}) => {
		const {onReady} = this.props;
		this.readyPlaylistOptions();
		onReady && onReady(data);
	};

	private handleQualityChanged: Api.Player.EventHandler<Api.Player.Events['QualityChanged']> = ({
		data,
	}) => {
		const {onQualityChanged} = this.props;
		onQualityChanged && onQualityChanged(data);
	};

	private handleCurrentTrackChanged: Api.Player.EventHandler<
		Api.Player.Events['CurrentTrackChanged']
	> = ({data}) => {
		const {onCurrentTrackChanged} = this.props;
		onCurrentTrackChanged && onCurrentTrackChanged(data);
	};

	private handleSeekChapter: Api.Player.EventHandler<Api.Player.Events['SeekChapter']> = ({
		data,
	}) => {
		const {onSeekChapter} = this.props;
		onSeekChapter && onSeekChapter(data);
	};

	private handleSizeChanged: Api.Player.EventHandler<Api.Player.Events['SizeChanged']> = ({
		data,
	}) => {
		const {onSizeChanged} = this.props;
		onSizeChanged && onSizeChanged(data);
	};

	private handlePlay: Api.Player.EventHandler<Api.Player.Events['Play']> = () => {
		const {onPlay} = this.props;
		onPlay && onPlay();
	};

	private handlePlaying: Api.Player.EventHandler<Api.Player.Events['Playing']> = () => {
		const {onPlaying} = this.props;
		onPlaying && onPlaying();
	};

	private handleWaiting: Api.Player.EventHandler<Api.Player.Events['Waiting']> = () => {
		const {onWaiting} = this.props;
		onWaiting && onWaiting();
	};

	private handlePause: Api.Player.EventHandler<Api.Player.Events['Pause']> = () => {
		const {onPause} = this.props;
		onPause && onPause();
	};

	private handleEnded: Api.Player.EventHandler<Api.Player.Events['Ended']> = () => {
		const {onEnded} = this.props;
		onEnded && onEnded();
	};

	private handleTimeUpdate: Api.Player.EventHandler<Api.Player.Events['TimeUpdate']> = ({data}) => {
		const {onTimeUpdate} = this.props;
		onTimeUpdate && onTimeUpdate(data);
	};

	private handleProgress: Api.Player.EventHandler<Api.Player.Events['Progress']> = ({data}) => {
		const {onProgress} = this.props;
		onProgress && onProgress(data);
	};

	private handleDurationChange: Api.Player.EventHandler<Api.Player.Events['DurationChange']> = ({
		data,
	}) => {
		const {onDurationChange} = this.props;
		onDurationChange && onDurationChange(data);
	};

	private handleVolumeChange: Api.Player.EventHandler<Api.Player.Events['VolumeChange']> = ({
		data,
	}) => {
		const {onVolumeChange} = this.props;
		onVolumeChange && onVolumeChange(data);
	};

	private handlePlaybackRateChange: Api.Player.EventHandler<
		Api.Player.Events['PlaybackRateChange']
	> = ({data}) => {
		const {onPlaybackRateChange} = this.props;
		onPlaybackRateChange && onPlaybackRateChange(data);
	};

	private handlePipChange: Api.Player.EventHandler<Api.Player.Events['PipChange']> = ({data}) => {
		const {onPipChange} = this.props;
		onPipChange && onPipChange(data);
	};

	private handleSeeked: Api.Player.EventHandler<Api.Player.Events['Seeked']> = () => {
		const {onSeeked} = this.props;
		onSeeked && onSeeked();
	};

	private handleFullscreenChange: Api.Player.EventHandler<Api.Player.Events['FullscreenChange']> =
		({data}) => {
			const {onFullscreenChange} = this.props;
			onFullscreenChange && onFullscreenChange(data);
		};

	private handleCallAction: Api.Player.EventHandler<Api.Player.Events['CallAction']> = ({data}) => {
		const {onCallAction} = this.props;
		onCallAction && onCallAction(data);
	};

	private handleCallBookmark: Api.Player.EventHandler<Api.Player.Events['CallBookmark']> = ({
		data,
	}) => {
		const {onCallBookmark} = this.props;
		onCallBookmark && onCallBookmark(data);
	};

	private handleError: Api.Player.EventHandler<Api.Player.Events['Error']> = ({data}) => {
		const {onError} = this.props;
		onError && onError(data);
	};

	private handleDestroy: Api.Player.EventHandler<Api.Player.Events['Destroy']> = () => {
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
