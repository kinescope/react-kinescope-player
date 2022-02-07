import React, { Component, createRef } from 'react';

/* global Map:readonly, Set:readonly, ArrayBuffer:readonly */
var hasElementType = typeof Element !== 'undefined';
var hasMap = typeof Map === 'function';
var hasSet = typeof Set === 'function';
var hasArrayBuffer = typeof ArrayBuffer === 'function' && !!ArrayBuffer.isView;

// Note: We **don't** need `envHasBigInt64Array` in fde es6/index.js

function equal(a, b) {
  // START: fast-deep-equal es6/index.js 3.1.1
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }

    // START: Modifications:
    // 1. Extra `has<Type> &&` helpers in initial condition allow es6 code
    //    to co-exist with es5.
    // 2. Replace `for of` with es5 compliant iteration using `for`.
    //    Basically, take:
    //
    //    ```js
    //    for (i of a.entries())
    //      if (!b.has(i[0])) return false;
    //    ```
    //
    //    ... and convert to:
    //
    //    ```js
    //    it = a.entries();
    //    while (!(i = it.next()).done)
    //      if (!b.has(i.value[0])) return false;
    //    ```
    //
    //    **Note**: `i` access switches to `i.value`.
    var it;
    if (hasMap && (a instanceof Map) && (b instanceof Map)) {
      if (a.size !== b.size) return false;
      it = a.entries();
      while (!(i = it.next()).done)
        if (!b.has(i.value[0])) return false;
      it = a.entries();
      while (!(i = it.next()).done)
        if (!equal(i.value[1], b.get(i.value[0]))) return false;
      return true;
    }

    if (hasSet && (a instanceof Set) && (b instanceof Set)) {
      if (a.size !== b.size) return false;
      it = a.entries();
      while (!(i = it.next()).done)
        if (!b.has(i.value[0])) return false;
      return true;
    }
    // END: Modifications

    if (hasArrayBuffer && ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (a[i] !== b[i]) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    // END: fast-deep-equal

    // START: react-fast-compare
    // custom handling for DOM elements
    if (hasElementType && a instanceof Element) return false;

    // custom handling for React/Preact
    for (i = length; i-- !== 0;) {
      if ((keys[i] === '_owner' || keys[i] === '__v' || keys[i] === '__o') && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner
        // Preact-specific: avoid traversing Preact elements' __v and __o
        //    __v = $_original / $_vnode
        //    __o = $_owner
        // These properties contain circular references and are not needed when
        // comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of elements

        continue;
      }

      // all other properties should be traversed as usual
      if (!equal(a[keys[i]], b[keys[i]])) return false;
    }
    // END: react-fast-compare

    // START: fast-deep-equal
    return true;
  }

  return a !== a && b !== b;
}
// end fast-deep-equal

var reactFastCompare = function isEqual(a, b) {
  try {
    return equal(a, b);
  } catch (error) {
    if (((error.message || '').match(/stack|recursion/i))) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn('react-fast-compare cannot handle circular refs');
      return false;
    }
    // some other error. we should definitely know about these
    throw error;
  }
};

const VIDEO_HOST = 'https://kinescope.io/embed/';
const PLAYER_LATEST = 'https://player.kinescope.io/latest/iframe.player.js';

const NODE_JS_ID = '__kinescope_player_react_js';

class Loader extends Component {
  constructor(props) {
    super(props);

    this.loadJsNotLoad = () => {
      const el = document.getElementById(NODE_JS_ID);

      if (el) {
        el.addEventListener('load', this.loadJs);
      }
    };

    this.loadJs = () => {
      const el = document.getElementById(NODE_JS_ID);

      if (el) {
        el.removeEventListener('load', this.loadJs);
      }

      this.handleJSLoad();
    };

    this.jsLoading = () => {
      if (this.testLoadJS()) {
        var _window, _window$Kinescope;

        if (!!((_window = window) != null && (_window$Kinescope = _window.Kinescope) != null && _window$Kinescope.IframePlayer)) {
          this.handleJSLoad();
        } else {
          this.loadJsNotLoad();
        }

        return;
      }

      let el = document.createElement('script');
      el.id = NODE_JS_ID;
      el.async = false;
      document.body.appendChild(el);
      el.onload = this.handleJSLoad;
      el.onerror = this.handleJSLoadError;
      el.src = PLAYER_LATEST;
    };

    this.testLoadJS = () => {
      return !!document.getElementById(NODE_JS_ID);
    };

    this.handleJSLoad = () => {
      const {
        onJSLoad
      } = this.props;
      onJSLoad && onJSLoad();
    };

    this.jsLoading();
  }

  handleJSLoadError() {
    const {
      onJSLoadError
    } = this.props;
    onJSLoadError && onJSLoadError();
  }

  render() {
    const {
      children
    } = this.props;
    return children;
  }

}

let index = 1;

function getNextIndex() {
  return index++;
}

function getNextPlayerId() {
  return `__kinescope_player_${getNextIndex()}`;
}

class Player extends Component {
  constructor(props) {
    var _this;

    super(props);
    _this = this;

    this.handleJSLoad = async function () {
      _this.playerLoad = true;
      const {
        onJSLoad
      } = _this.props;
      onJSLoad && onJSLoad();
      await _this.create();
    };

    this.shouldPlayerUpdate = async function (prevProps) {
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
        watermarkText,
        watermarkMode
      } = _this.props;

      if (videoId !== prevProps.videoId || width !== prevProps.width || height !== prevProps.height || autoPause !== prevProps.autoPause || autoPlay !== prevProps.autoPlay || loop !== prevProps.loop || muted !== prevProps.muted || playsInline !== prevProps.playsInline || language !== prevProps.language || watermarkText !== prevProps.watermarkText || watermarkMode !== prevProps.watermarkMode) {
        await _this.destroy();
        await _this.create();
      }
    };

    this.shouldPlaylistUpdate = async function (prevProps) {
      const {
        title,
        subtitle,
        poster,
        chapters,
        vtt,
        bookmarks,
        actions
      } = _this.props;

      if (title !== prevProps.title || subtitle !== prevProps.subtitle || poster !== prevProps.poster || !reactFastCompare(chapters, prevProps.chapters) || !reactFastCompare(vtt, prevProps.vtt) || !reactFastCompare(bookmarks, prevProps.bookmarks) || !reactFastCompare(actions, prevProps.actions)) {
        await _this.updatePlaylistOptions();
      }
    };

    this.updatePlaylistOptions = async function () {
      const {
        title,
        subtitle,
        poster,
        chapters,
        vtt,
        bookmarks,
        actions
      } = _this.props;
      let options = {
        title: title,
        poster: poster,
        subtitle: subtitle,
        chapters: chapters,
        vtt: vtt,
        bookmarks: bookmarks,
        actions: actions
      };
      await _this.setPlaylistItemOptions(options);
    };

    this.create = async function () {
      const parentsRef = _this.parentsRef.current;

      if (!_this.playerLoad || !parentsRef) {
        return;
      }

      parentsRef.textContent = '';
      const playerId = getNextPlayerId();
      const playerDiv = document.createElement('div');
      playerDiv.setAttribute('id', playerId);
      parentsRef.appendChild(playerDiv);
      _this.player = await _this.createPlayer(playerId);

      _this.getEventList().forEach(event => {
        var _this$player;

        (_this$player = _this.player) == null ? void 0 : _this$player.on(event[0], event[1]);
      });
    };

    this.destroy = async function () {
      if (!_this.player) {
        return;
      }

      await _this.player.destroy();
      _this.player = null;
    };

    this.getEventList = () => {
      var _this$player2;

      const Events = (_this$player2 = this.player) == null ? void 0 : _this$player2.Events;

      if (!Events) {
        return [];
      }

      return [[Events.Ready, this.handleEventReady], [Events.QualityChanged, this.handleQualityChanged], [Events.AutoQualityChanged, this.handleAutoQualityChanged], [Events.SeekChapter, this.handleSeekChapter], [Events.SizeChanged, this.handleSizeChanged], [Events.Play, this.handlePlay], [Events.Playing, this.handlePlaying], [Events.Waiting, this.handleWaiting], [Events.Pause, this.handlePause], [Events.Ended, this.handleEnded], [Events.TimeUpdate, this.handleTimeUpdate], [Events.Progress, this.handleProgress], [Events.DurationChange, this.handleDurationChange], [Events.VolumeChange, this.handleVolumeChange], [Events.PlaybackRateChange, this.handlePlaybackRateChange], [Events.Seeking, this.handleSeeking], [Events.FullscreenChange, this.handleFullscreenChange], [Events.CallAction, this.handleCallAction], [Events.CallBookmark, this.handleCallBookmark], [Events.Error, this.handleError], [Events.Destroy, this.handleDestroy]];
    };

    this.getIFrameUrl = () => {
      const {
        videoId
      } = this.props;
      return VIDEO_HOST + videoId;
    };

    this.createPlayer = playerId => {
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
        watermarkText,
        watermarkMode
      } = this.props;
      let options = {
        url: this.getIFrameUrl(),
        size: {
          width: width,
          height: height
        },
        behaviour: {
          autoPause: autoPause,
          autoPlay: autoPlay,
          loop: loop,
          muted: muted,
          playsInline: playsInline
        },
        playlist: [{
          title: title,
          subtitle: subtitle,
          poster: poster,
          chapters: chapters,
          vtt: vtt,
          bookmarks: bookmarks,
          actions: actions
        }],
        ui: {
          language: language
        },
        settings: {
          externalId: externalId
        }
      };

      if (watermarkText) {
        options.ui['watermark'] = {
          text: watermarkText,
          mode: watermarkMode
        };
      }

      return window.Kinescope.IframePlayer.create(playerId, options);
    };

    this.setPlaylistItemOptions = async function (options) {
      if (!_this.player) {
        return Promise.resolve();
      }

      await _this.player.setPlaylistItemOptions(options);
    };

    this.isPaused = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.isPaused();
    };

    this.isEnded = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.isEnded();
    };

    this.play = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.play();
    };

    this.pause = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.pause();
    };

    this.stop = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.stop();
    };

    this.getCurrentTime = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.getCurrentTime();
    };

    this.getDuration = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.getDuration();
    };

    this.seekTo = time => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.seekTo(time);
    };

    this.isMuted = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.isMuted();
    };

    this.mute = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.mute();
    };

    this.unmute = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.unmute();
    };

    this.getVolume = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.getVolume();
    };

    this.setVolume = value => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.setVolume(value);
    };

    this.getPlaybackRate = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.getPlaybackRate();
    };

    this.setPlaybackRate = value => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.setPlaybackRate(value);
    };

    this.getVideoQualityList = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.getVideoQualityList();
    };

    this.getCurrentVideoQuality = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.getCurrentVideoQuality();
    };

    this.setVideoQuality = quality => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.setVideoQuality(quality);
    };

    this.enableTextTrack = lang => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.enableTextTrack(lang);
    };

    this.disableTextTrack = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.disableTextTrack();
    };

    this.closeCTA = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.closeCTA();
    };

    this.isFullscreen = () => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.isFullscreen();
    };

    this.setFullscreen = fullscreen => {
      if (!this.player) {
        return Promise.reject(null);
      }

      return this.player.setFullscreen(fullscreen);
    };

    this.handleEventReady = ({
      data
    }) => {
      const {
        onReady
      } = this.props;
      this.updatePlaylistOptions();
      onReady && onReady(data);
    };

    this.handleQualityChanged = ({
      data
    }) => {
      const {
        onQualityChanged
      } = this.props;
      onQualityChanged && onQualityChanged(data);
    };

    this.handleAutoQualityChanged = ({
      data
    }) => {
      const {
        onAutoQualityChanged
      } = this.props;
      onAutoQualityChanged && onAutoQualityChanged(data);
    };

    this.handleSeekChapter = ({
      data
    }) => {
      const {
        onSeekChapter
      } = this.props;
      onSeekChapter && onSeekChapter(data);
    };

    this.handleSizeChanged = ({
      data
    }) => {
      const {
        onSizeChanged
      } = this.props;
      onSizeChanged && onSizeChanged(data);
    };

    this.handlePlay = () => {
      const {
        onPlay
      } = this.props;
      onPlay && onPlay();
    };

    this.handlePlaying = () => {
      const {
        onPlaying
      } = this.props;
      onPlaying && onPlaying();
    };

    this.handleWaiting = () => {
      const {
        onWaiting
      } = this.props;
      onWaiting && onWaiting();
    };

    this.handlePause = () => {
      const {
        onPause
      } = this.props;
      onPause && onPause();
    };

    this.handleEnded = () => {
      const {
        onEnded
      } = this.props;
      onEnded && onEnded();
    };

    this.handleTimeUpdate = ({
      data
    }) => {
      const {
        onTimeUpdate
      } = this.props;
      onTimeUpdate && onTimeUpdate(data);
    };

    this.handleProgress = ({
      data
    }) => {
      const {
        onProgress
      } = this.props;
      onProgress && onProgress(data);
    };

    this.handleDurationChange = ({
      data
    }) => {
      const {
        onDurationChange
      } = this.props;
      onDurationChange && onDurationChange(data);
    };

    this.handleVolumeChange = ({
      data
    }) => {
      const {
        onVolumeChange
      } = this.props;
      onVolumeChange && onVolumeChange(data);
    };

    this.handlePlaybackRateChange = ({
      data
    }) => {
      const {
        onPlaybackRateChange
      } = this.props;
      onPlaybackRateChange && onPlaybackRateChange(data);
    };

    this.handleSeeking = () => {
      const {
        onSeeking
      } = this.props;
      onSeeking && onSeeking();
    };

    this.handleFullscreenChange = ({
      data
    }) => {
      const {
        onFullscreenChange
      } = this.props;
      onFullscreenChange && onFullscreenChange(data);
    };

    this.handleCallAction = ({
      data
    }) => {
      const {
        onCallAction
      } = this.props;
      onCallAction && onCallAction(data);
    };

    this.handleCallBookmark = ({
      data
    }) => {
      const {
        onCallBookmark
      } = this.props;
      onCallBookmark && onCallBookmark(data);
    };

    this.handleError = ({
      data
    }) => {
      const {
        onError
      } = this.props;
      onError && onError(data);
    };

    this.handleDestroy = () => {
      const {
        onDestroy
      } = this.props;
      onDestroy && onDestroy();
    };

    this.playerLoad = false;
    this.parentsRef = createRef();
    this.player = null;
  }

  componentDidMount() {
    if (this.playerLoad) {
      this.create();
    }
  }

  async componentDidUpdate(prevProps) {
    await this.shouldPlayerUpdate(prevProps);
    await this.shouldPlaylistUpdate(prevProps);
  }

  componentWillUnmount() {
    this.destroy();
  }

  render() {
    const {
      className,
      style,
      onJSLoadError
    } = this.props;
    return React.createElement(Loader, {
      onJSLoad: this.handleJSLoad,
      onJSLoadError: onJSLoadError
    }, React.createElement("span", {
      ref: this.parentsRef,
      className: className,
      style: style
    }));
  }

}

Player.defaultProps = {
  width: '100%',
  height: '100%',
  autoPause: true,
  playsInline: true
};

export default Player;
