import React, { Component, createRef } from 'react';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var VIDEO_HOST = 'https://kinescope.io/embed/';
var PLAYER_LATEST = 'https://player.kinescope.io/latest/iframe.player.js';

var NODE_JS_ID = '__kinescope_player_react_js';

var Loader = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Loader, _Component);

  function Loader(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _this.jsLoading = function () {
      if (_this.testLoadJS()) {
        _this.handleJSLoad();

        return;
      }

      var el = document.createElement('script');
      el.id = NODE_JS_ID;
      el.async = false;
      document.body.appendChild(el);
      el.onload = _this.handleJSLoad;
      el.onerror = _this.handleJSLoadError;
      el.src = PLAYER_LATEST;
    };

    _this.testLoadJS = function () {
      return !!document.getElementById(NODE_JS_ID);
    };

    _this.handleJSLoad = function () {
      var onJSLoad = _this.props.onJSLoad;
      onJSLoad && onJSLoad();
    };

    _this.jsLoading();

    return _this;
  }

  var _proto = Loader.prototype;

  _proto.handleJSLoadError = function handleJSLoadError() {
    var onJSLoadError = this.props.onJSLoadError;
    onJSLoadError && onJSLoadError();
  };

  _proto.render = function render() {
    var children = this.props.children;
    return children;
  };

  return Loader;
}(Component);

var THROW_PLAYER_NOT_READY = 'Player not ready';
var index = 1;

function getNextIndex() {
  return index++;
}

function getNextPlayerId() {
  return "__kinescope_player_" + getNextIndex();
}

var Player = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Player, _Component);

  function Player(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _this.handleJSLoad = function () {
      try {
        _this.playerLoad = true;
        var onJSLoad = _this.props.onJSLoad;
        onJSLoad && onJSLoad();
        return Promise.resolve(_this.create()).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.create = function () {
      try {
        if (!_this.playerLoad) {
          return Promise.resolve();
        }

        var parentsRef = _this.parentsRef.current;

        if (!parentsRef) {
          throw THROW_PLAYER_NOT_READY;
        }

        var playerId = getNextPlayerId();
        var playerDiv = document.createElement('div');
        playerDiv.setAttribute('id', playerId);
        parentsRef.appendChild(playerDiv);
        return Promise.resolve(_this.createPlayer(playerId)).then(function (_this$createPlayer) {
          _this.player = _this$createPlayer;

          _this.getEventList().forEach(function (event) {
            var _this$player;

            (_this$player = _this.player) == null ? void 0 : _this$player.on(event[0], event[1]);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.destroy = function () {
      if (!_this.player) {
        return;
      }

      _this.player.destroy();

      _this.player = null;
    };

    _this.getEventList = function () {
      var _this$player2;

      var Events = (_this$player2 = _this.player) == null ? void 0 : _this$player2.Events;

      if (!Events) {
        return [];
      }

      return [[Events.Ready, _this.handleEventReady], [Events.QualityChanged, _this.handleQualityChanged], [Events.AutoQualityChanged, _this.handleAutoQualityChanged], [Events.SizeChanged, _this.handleSizeChanged], [Events.Play, _this.handlePlay], [Events.Playing, _this.handlePlaying], [Events.Waiting, _this.handleWaiting], [Events.Pause, _this.handlePause], [Events.Ended, _this.handleEnded], [Events.TimeUpdate, _this.handleTimeUpdate], [Events.Progress, _this.handleProgress], [Events.DurationChange, _this.handleDurationChange], [Events.VolumeChange, _this.handleVolumeChange], [Events.PlaybackRateChange, _this.handlePlaybackRateChange], [Events.Seeking, _this.handleSeeking], [Events.FullscreenChange, _this.handleFullscreenChange], [Events.Error, _this.handleError], [Events.Destroy, _this.handleDestroy]];
    };

    _this.getIFrameUrl = function () {
      var videoId = _this.props.videoId;
      return VIDEO_HOST + videoId;
    };

    _this.createPlayer = function (playerId) {
      var _this$props = _this.props,
          width = _this$props.width,
          height = _this$props.height,
          autoPause = _this$props.autoPause,
          autoPlay = _this$props.autoPlay,
          loop = _this$props.loop,
          muted = _this$props.muted,
          playsInline = _this$props.playsInline,
          language = _this$props.language;
      var options = {
        url: _this.getIFrameUrl(),
        size: {
          width: width,
          height: height
        },
        behaviour: {
          crossOrigin: 'use-credentials',
          autoPause: autoPause,
          autoPlay: autoPlay,
          loop: loop,
          muted: muted,
          playsInline: playsInline
        },
        ui: {
          language: language
        }
      };
      return window.Kinescope.IframePlayer.create(playerId, options);
    };

    _this.isPaused = function () {
      if (_this.player) {
        return _this.player.isPaused();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.isEnded = function () {
      if (_this.player) {
        return _this.player.isEnded();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.play = function () {
      if (_this.player) {
        return _this.player.play();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.pause = function () {
      if (_this.player) {
        return _this.player.pause();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.stop = function () {
      if (_this.player) {
        return _this.player.stop();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.getCurrentTime = function () {
      if (_this.player) {
        return _this.player.getCurrentTime();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.getDuration = function () {
      if (_this.player) {
        return _this.player.getDuration();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.seekTo = function (time) {
      if (_this.player) {
        return _this.player.seekTo(time);
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.isMuted = function () {
      if (_this.player) {
        return _this.player.isMuted();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.mute = function () {
      if (_this.player) {
        return _this.player.mute();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.unmute = function () {
      if (_this.player) {
        return _this.player.unmute();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.getVolume = function () {
      if (_this.player) {
        return _this.player.getVolume();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.setVolume = function (value) {
      if (_this.player) {
        return _this.player.setVolume(value);
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.getPlaybackRate = function () {
      if (_this.player) {
        return _this.player.getPlaybackRate();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.setPlaybackRate = function (value) {
      if (_this.player) {
        return _this.player.setPlaybackRate(value);
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.getVideoQualityList = function () {
      if (_this.player) {
        return _this.player.getVideoQualityList();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.getCurrentVideoQuality = function () {
      if (_this.player) {
        return _this.player.getCurrentVideoQuality();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.setVideoQuality = function (quality) {
      if (_this.player) {
        return _this.player.setVideoQuality(quality);
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.enableTextTrack = function (lang) {
      if (_this.player) {
        return _this.player.enableTextTrack(lang);
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.disableTextTrack = function () {
      if (_this.player) {
        return _this.player.disableTextTrack();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.isFullscreen = function () {
      if (_this.player) {
        return _this.player.isFullscreen();
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.setFullscreen = function (fullscreen) {
      if (_this.player) {
        return _this.player.setFullscreen(fullscreen);
      }

      throw THROW_PLAYER_NOT_READY;
    };

    _this.handleEventReady = function (_ref) {
      var data = _ref.data;
      var onReady = _this.props.onReady;
      onReady && onReady(data);
    };

    _this.handleQualityChanged = function (_ref2) {
      var data = _ref2.data;
      var onQualityChanged = _this.props.onQualityChanged;
      onQualityChanged && onQualityChanged(data);
    };

    _this.handleAutoQualityChanged = function (_ref3) {
      var data = _ref3.data;
      var onAutoQualityChanged = _this.props.onAutoQualityChanged;
      onAutoQualityChanged && onAutoQualityChanged(data);
    };

    _this.handleSizeChanged = function (_ref4) {
      var data = _ref4.data;
      var onSizeChanged = _this.props.onSizeChanged;
      onSizeChanged && onSizeChanged(data);
    };

    _this.handlePlay = function () {
      var onPlay = _this.props.onPlay;
      onPlay && onPlay();
    };

    _this.handlePlaying = function () {
      var onPlaying = _this.props.onPlaying;
      onPlaying && onPlaying();
    };

    _this.handleWaiting = function () {
      var onWaiting = _this.props.onWaiting;
      onWaiting && onWaiting();
    };

    _this.handlePause = function () {
      var onPause = _this.props.onPause;
      onPause && onPause();
    };

    _this.handleEnded = function () {
      var onEnded = _this.props.onEnded;
      onEnded && onEnded();
    };

    _this.handleTimeUpdate = function (_ref5) {
      var data = _ref5.data;
      var onTimeUpdate = _this.props.onTimeUpdate;
      onTimeUpdate && onTimeUpdate(data);
    };

    _this.handleProgress = function (_ref6) {
      var data = _ref6.data;
      var onProgress = _this.props.onProgress;
      onProgress && onProgress(data);
    };

    _this.handleDurationChange = function (_ref7) {
      var data = _ref7.data;
      var onDurationChange = _this.props.onDurationChange;
      onDurationChange && onDurationChange(data);
    };

    _this.handleVolumeChange = function (_ref8) {
      var data = _ref8.data;
      var onVolumeChange = _this.props.onVolumeChange;
      onVolumeChange && onVolumeChange(data);
    };

    _this.handlePlaybackRateChange = function (_ref9) {
      var data = _ref9.data;
      var onPlaybackRateChange = _this.props.onPlaybackRateChange;
      onPlaybackRateChange && onPlaybackRateChange(data);
    };

    _this.handleSeeking = function () {
      var onSeeking = _this.props.onSeeking;
      onSeeking && onSeeking();
    };

    _this.handleFullscreenChange = function (_ref10) {
      var data = _ref10.data;
      var onFullscreenChange = _this.props.onFullscreenChange;
      onFullscreenChange && onFullscreenChange(data);
    };

    _this.handleError = function (_ref11) {
      var data = _ref11.data;
      var onError = _this.props.onError;
      onError && onError(data);
    };

    _this.handleDestroy = function () {
      var onDestroy = _this.props.onDestroy;
      onDestroy && onDestroy();
    };

    _this.playerLoad = false;
    _this.parentsRef = createRef();
    _this.player = null;
    return _this;
  }

  var _proto = Player.prototype;

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    try {
      var _this3 = this;

      var _this3$props = _this3.props,
          videoId = _this3$props.videoId,
          width = _this3$props.width,
          height = _this3$props.height,
          autoPause = _this3$props.autoPause,
          autoPlay = _this3$props.autoPlay,
          loop = _this3$props.loop,
          muted = _this3$props.muted,
          playsInline = _this3$props.playsInline,
          language = _this3$props.language;

      var _temp2 = function () {
        if (videoId !== prevProps.videoId || width !== prevProps.width || height !== prevProps.height || autoPause !== prevProps.autoPause || autoPlay !== prevProps.autoPlay || loop !== prevProps.loop || muted !== prevProps.muted || playsInline !== prevProps.playsInline || language !== prevProps.language) {
          return Promise.resolve(_this3.destroy()).then(function () {
            return Promise.resolve(_this3.create()).then(function () {});
          });
        }
      }();

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.destroy();
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        className = _this$props2.className,
        style = _this$props2.style,
        onJSLoadError = _this$props2.onJSLoadError;
    return React.createElement(Loader, {
      onJSLoad: this.handleJSLoad,
      onJSLoadError: onJSLoadError
    }, React.createElement("span", {
      ref: this.parentsRef,
      className: className,
      style: style
    }));
  };

  return Player;
}(Component);

Player.defaultProps = {
  width: '100%',
  height: '100%',
  autoPause: true,
  playsInline: true
};

export default Player;
