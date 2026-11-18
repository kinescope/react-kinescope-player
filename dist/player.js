var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/* global Map:readonly, Set:readonly, ArrayBuffer:readonly */
var hasElementType = typeof Element !== 'undefined';
var hasMap = typeof Map === 'function';
var hasSet = typeof Set === 'function';
var hasArrayBuffer = typeof ArrayBuffer === 'function' && !!ArrayBuffer.isView;

// Note: We **don't** need `envHasBigInt64Array` in fde es6/index.js

function equal(a, b) {
  // START: fast-deep-equal es6/index.js 3.1.3
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
    // START: Modifications:
    // Apply guards for `Object.create(null)` handling. See:
    // - https://github.com/FormidableLabs/react-fast-compare/issues/64
    // - https://github.com/epoberezkin/fast-deep-equal/issues/49
    if (a.valueOf !== Object.prototype.valueOf && typeof a.valueOf === 'function' && typeof b.valueOf === 'function') return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString && typeof a.toString === 'function' && typeof b.toString === 'function') return a.toString() === b.toString();
    // END: Modifications

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

var VIDEO_PLAYLIST_HOST = 'https://kinescope.io/embed/playlist?video_ids=';
var VIDEO_HOST = 'https://kinescope.io/embed/';
var PLAYER_LATEST = 'https://player.kinescope.io/latest/iframe.player.js';

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

var loadOnce = function loadOnce(_ref) {
  var src = _ref.src,
      id = _ref.id,
      _ref$foreignTagTimeou = _ref.foreignTagTimeout,
      foreignTagTimeout = _ref$foreignTagTimeou === void 0 ? DEFAULT_FOREIGN_TAG_TIMEOUT : _ref$foreignTagTimeou;

  try {
    var _exit3;

    var _temp8 = function _temp8(_result3) {
      var _exit2;

      if (_exit3) return _result3;

      function _temp6(_result4) {
        if (_exit2) ;

        if (!isApiLoaded()) {
          script.remove();
          throw apiNotFoundError(src);
        }
      }

      var script = document.createElement('script');
      script.id = id;
      script.src = src;
      var loaded = waitForScript(script);
      document.body.appendChild(script);

      var _temp5 = _catch(function () {
        return Promise.resolve(loaded).then(function () {});
      }, function (e) {
        script.remove();
        throw e;
      });

      return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
    };

    if (isApiLoaded()) {
      return Promise.resolve();
    }
    /*
     * A tag with our id, but not inserted by this module. There is no way to know
     * whether it is still loading or has already failed, so wait for `load`/`error`
     * with a timeout and remove it only after an error or timeout: removing a tag
     * that is still loading would load the script twice.
     */


    var foreign = document.getElementById(id);

    var _temp9 = function () {
      if (foreign) {
        var _temp4 = function _temp4(_result2) {
          if (_exit3) return _result2;
          foreign.remove();
        };

        var _temp10 = function () {
          if (foreign instanceof HTMLScriptElement) {
            var _temp2 = function _temp2(_result) {
              if (_exit3) return _result;

              if (isApiLoaded()) {
                _exit3 = 1;
              }
            };

            var _temp11 = _catch(function () {
              return Promise.resolve(waitForScript(foreign, foreignTagTimeout)).then(function () {
                if (isApiLoaded()) {
                  _exit3 = 1;
                }
              });
            }, function () {});

            return _temp11 && _temp11.then ? _temp11.then(_temp2) : _temp2(_temp11);
          }
        }();

        return _temp10 && _temp10.then ? _temp10.then(_temp4) : _temp4(_temp10);
      }
    }();

    return Promise.resolve(_temp9 && _temp9.then ? _temp9.then(_temp8) : _temp8(_temp9));
  } catch (e) {
    return Promise.reject(e);
  }
};

var DEFAULT_RETRIES = 2;
var DEFAULT_RETRY_DELAY = 1000;
var DEFAULT_FOREIGN_TAG_TIMEOUT = 15000;
/**
 * Loading state is shared by every player on the page.
 * - pending/resolved promise: every player waits for it and gets the same result;
 * - `null`: nothing is loading, the next player starts a new load.
 * After a failure the promise is reset, so the next player can try again
 * without reloading the page.
 */

var shared = null;

function isApiLoaded() {
  var _window$Kinescope;

  return !!((_window$Kinescope = window.Kinescope) != null && _window$Kinescope.IframePlayer);
}

function delay(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
/** Resolves on `load`, rejects on `error` or after `timeout` ms (when `timeout` > 0). */


function waitForScript(script, timeout) {
  if (timeout === void 0) {
    timeout = 0;
  }

  return new Promise(function (resolve, reject) {
    var timer;

    var cleanup = function cleanup() {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
      timer !== undefined && clearTimeout(timer);
    };

    var onLoad = function onLoad() {
      cleanup();
      resolve();
    };

    var onError = function onError(e) {
      cleanup();
      reject(e);
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    if (timeout > 0) {
      timer = setTimeout(function () {
        cleanup();
        reject(new Error("Kinescope Player: script \"" + script.src + "\" load timeout (" + timeout + " ms)."));
      }, timeout);
    }
  });
}

function apiNotFoundError(src) {
  return new Error("Kinescope Player: script \"" + src + "\" loaded, but IframePlayer API is not found.");
}

function loadWithRetries(options, attempt) {
  if (attempt === void 0) {
    attempt = 0;
  }

  var _options$retries = options.retries,
      retries = _options$retries === void 0 ? DEFAULT_RETRIES : _options$retries,
      _options$retryDelay = options.retryDelay,
      retryDelay = _options$retryDelay === void 0 ? DEFAULT_RETRY_DELAY : _options$retryDelay;
  return loadOnce(options)["catch"](function (e) {
    if (attempt >= retries) {
      throw e;
    }

    return delay(retryDelay).then(function () {
      return loadWithRetries(options, attempt + 1);
    });
  });
}
/**
 * Loads Kinescope IFrame API once per page.
 * All callers share one promise, so every waiting player gets either success or the error.
 * After a failure the state is reset and the next call loads the script again.
 */


function loadIframeApi(options) {
  if (isApiLoaded()) {
    return Promise.resolve();
  }

  if (!shared) {
    var current = loadWithRetries(options)["catch"](function (e) {
      if (shared === current) {
        shared = null;
      }

      throw e;
    });
    shared = current;
  }

  return shared;
}

var NODE_JS_ID = '__kinescope_player_react_js';

var Loader = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Loader, _Component);

  function Loader() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.generation = 0;
    return _this;
  }

  var _proto = Loader.prototype;

  /*
   * Loading starts in componentDidMount, not in the constructor: the constructor runs
   * during render, before the container ref is attached (and may run twice in StrictMode
   * or be thrown away by a concurrent render).
   */
  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var generation = ++this.generation;
    var _this$props$src = this.props.src,
        src = _this$props$src === void 0 ? PLAYER_LATEST : _this$props$src;
    loadIframeApi({
      src: src,
      id: NODE_JS_ID
    }).then(function () {
      generation === _this2.generation && _this2.props.onJSLoad();
    }, function (e) {
      if (generation !== _this2.generation) {
        return;
      }

      var onJSLoadError = _this2.props.onJSLoadError;
      onJSLoadError && onJSLoadError(e);
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.generation++;
  };

  _proto.render = function render() {
    var children = this.props.children;
    return children;
  };

  return Loader;
}(React.Component);

function _finallyRethrows(body, finalizer) {
  try {
    var result = body();
  } catch (e) {
    return finalizer(true, e);
  }

  if (result && result.then) {
    return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
  }

  return finalizer(false, result);
}

var index = 1;

function _catch$1(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

function getNextIndex() {
  return index++;
}

function getNextPlayerId() {
  return "__kinescope_player_" + getNextIndex();
}

var Player = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Player, _Component);

  function Player() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.playerLoad = false;
    _this.parentsRef = React.createRef();
    _this.player = null;
    _this.createSeq = 0;
    _this.creatingSeq = null;
    _this.unmounted = false;

    _this.handleJSLoad = function () {
      if (_this.unmounted) {
        return;
      }

      if (!_this.playerLoad) {
        _this.playerLoad = true;
        var onJSLoad = _this.props.onJSLoad;
        onJSLoad && onJSLoad();
      }

      if (_this.player || _this.creatingSeq !== null) {
        return;
      }

      _this.create();
    };

    _this.shouldPlayerUpdate = function (prevProps) {
      var _this$props = _this.props,
          videoId = _this$props.videoId,
          query = _this$props.query,
          width = _this$props.width,
          height = _this$props.height,
          autoPause = _this$props.autoPause,
          autoPlay = _this$props.autoPlay,
          loop = _this$props.loop,
          muted = _this$props.muted,
          playsInline = _this$props.playsInline,
          preload = _this$props.preload,
          language = _this$props.language,
          controls = _this$props.controls,
          mainPlayButton = _this$props.mainPlayButton,
          playbackRateButton = _this$props.playbackRateButton,
          textTrack = _this$props.textTrack,
          watermark = _this$props.watermark,
          localStorage = _this$props.localStorage,
          playlistOptions = _this$props.playlistOptions,
          theme = _this$props.theme,
          createTimeout = _this$props.createTimeout,
          attemptTimeout = _this$props.attemptTimeout,
          errorScreen = _this$props.errorScreen;

      if (muted !== prevProps.muted && _this.player) {
        (muted ? _this.mute() : _this.unmute())["catch"](function () {});
      }

      return !reactFastCompare(videoId, prevProps.videoId) || !reactFastCompare(query, prevProps.query) || width !== prevProps.width || height !== prevProps.height || autoPause !== prevProps.autoPause || autoPlay !== prevProps.autoPlay || loop !== prevProps.loop || playsInline !== prevProps.playsInline || preload !== prevProps.preload || language !== prevProps.language || controls !== prevProps.controls || mainPlayButton !== prevProps.mainPlayButton || playbackRateButton !== prevProps.playbackRateButton || textTrack !== prevProps.textTrack || !reactFastCompare(watermark, prevProps.watermark) || !reactFastCompare(localStorage, prevProps.localStorage) || !reactFastCompare(playlistOptions, prevProps.playlistOptions) || !reactFastCompare(theme, prevProps.theme) || createTimeout !== prevProps.createTimeout || attemptTimeout !== prevProps.attemptTimeout || errorScreen !== prevProps.errorScreen;
    };

    _this.shouldPlaylistUpdate = function (prevProps) {
      try {
        var _temp15 = function _temp15() {
          function _temp13() {
            function _temp11() {
              function _temp9() {
                function _temp7() {
                  function _temp5() {
                    function _temp3() {
                      var _temp = function () {
                        if (!reactFastCompare(callToAction, prevProps.callToAction)) {
                          return Promise.resolve(_this.updateCtaOptions()).then(function () {});
                        }
                      }();

                      if (_temp && _temp.then) return _temp.then(function () {});
                    }

                    var _temp2 = function () {
                      if (!reactFastCompare(bookmarks, prevProps.bookmarks)) {
                        return Promise.resolve(_this.updateBookmarksOptions()).then(function () {});
                      }
                    }();

                    return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
                  }

                  var _temp4 = function () {
                    if (!reactFastCompare(vtt, prevProps.vtt)) {
                      return Promise.resolve(_this.updateVttOptions()).then(function () {});
                    }
                  }();

                  return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
                }

                var _temp6 = function () {
                  if (!reactFastCompare(chapters, prevProps.chapters)) {
                    return Promise.resolve(_this.updateChaptersOptions()).then(function () {});
                  }
                }();

                return _temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6);
              }

              var _temp8 = function () {
                if (drmAuthToken !== prevProps.drmAuthToken) {
                  return Promise.resolve(_this.updateDrmAuthTokenOptions()).then(function () {});
                }
              }();

              return _temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8);
            }

            var _temp10 = function () {
              if (subtitle !== prevProps.subtitle) {
                return Promise.resolve(_this.updateSubtitleOptions()).then(function () {});
              }
            }();

            return _temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10);
          }

          var _temp12 = function () {
            if (poster !== prevProps.poster) {
              return Promise.resolve(_this.updatePosterOptions()).then(function () {});
            }
          }();

          return _temp12 && _temp12.then ? _temp12.then(_temp13) : _temp13(_temp12);
        };

        var _this$props2 = _this.props,
            title = _this$props2.title,
            subtitle = _this$props2.subtitle,
            poster = _this$props2.poster,
            chapters = _this$props2.chapters,
            vtt = _this$props2.vtt,
            bookmarks = _this$props2.bookmarks,
            callToAction = _this$props2.callToAction,
            drmAuthToken = _this$props2.drmAuthToken;

        var _temp16 = function () {
          if (title !== prevProps.title) {
            return Promise.resolve(_this.updateTitleOptions()).then(function () {});
          }
        }();

        return Promise.resolve(_temp16 && _temp16.then ? _temp16.then(_temp15) : _temp15(_temp16));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.updateTitleOptions = function () {
      try {
        var title = _this.props.title;
        return Promise.resolve(_this.setPlaylistItemOptions({
          title: title
        })).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.updatePosterOptions = function () {
      try {
        var poster = _this.props.poster;
        return Promise.resolve(_this.setPlaylistItemOptions({
          poster: poster
        })).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.updateSubtitleOptions = function () {
      try {
        var subtitle = _this.props.subtitle;
        return Promise.resolve(_this.setPlaylistItemOptions({
          subtitle: subtitle
        })).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.updateDrmAuthTokenOptions = function () {
      try {
        var drmAuthToken = _this.props.drmAuthToken;
        return Promise.resolve(_this.setPlaylistItemOptions({
          drm: {
            auth: {
              token: drmAuthToken
            }
          }
        })).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.updateChaptersOptions = function () {
      try {
        var chapters = _this.props.chapters;
        return Promise.resolve(_this.setPlaylistItemOptions({
          chapters: chapters
        })).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.updateVttOptions = function () {
      try {
        var vtt = _this.props.vtt;
        return Promise.resolve(_this.setPlaylistItemOptions({
          vtt: vtt
        })).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.updateBookmarksOptions = function () {
      try {
        var bookmarks = _this.props.bookmarks;
        return Promise.resolve(_this.setPlaylistItemOptions({
          bookmarks: bookmarks
        })).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.updateCtaOptions = function () {
      try {
        var callToAction = _this.props.callToAction;
        return Promise.resolve(_this.setPlaylistItemOptions({
          cta: callToAction
        })).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.readyPlaylistOptions = function () {
      try {
        var _this$props3 = _this.props,
            title = _this$props3.title,
            subtitle = _this$props3.subtitle,
            poster = _this$props3.poster,
            chapters = _this$props3.chapters,
            vtt = _this$props3.vtt,
            bookmarks = _this$props3.bookmarks,
            callToAction = _this$props3.callToAction,
            drmAuthToken = _this$props3.drmAuthToken;
        var options = {};

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
              token: drmAuthToken
            }
          };
        }

        return Promise.resolve(_this.setPlaylistItemOptions(options)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.isCurrentCreate = function (seq) {
      return !_this.unmounted && seq === _this.createSeq;
    };

    _this.invalidateCreate = function () {
      _this.createSeq++;
      _this.creatingSeq = null;
    };

    _this.create = function () {
      try {
        _this.invalidateCreate();

        var seq = _this.createSeq;
        _this.creatingSeq = seq;

        var _temp18 = _finallyRethrows(function () {
          return Promise.resolve(_this.createInternal(seq)).then(function () {});
        }, function (_wasThrown, _result) {
          if (_this.creatingSeq === seq) {
            _this.creatingSeq = null;
          }

          if (_wasThrown) throw _result;
          return _result;
        });

        return Promise.resolve(_temp18 && _temp18.then ? _temp18.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.createInternal = function (seq) {
      try {
        return Promise.resolve(_this.destroy()).then(function () {
          var parentsRef = _this.parentsRef.current;

          if (!_this.isCurrentCreate(seq) || !_this.playerLoad || !parentsRef) {
            return;
          }
          /* create playerId */


          parentsRef.textContent = '';
          var playerId = getNextPlayerId();
          var playerDiv = document.createElement('div');
          playerDiv.setAttribute('id', playerId);
          parentsRef.appendChild(playerDiv);
          /* fast re-create player fix */

          return Promise.resolve(new Promise(function (resolve) {
            setTimeout(resolve, 0);
          })).then(function () {
            var _exit;

            function _temp20(_result2) {
              if (_exit) return _result2;

              if (!_this.isCurrentCreate(seq)) {
                /* superseded or unmounted while creating */
                _this.destroyPlayer(player);

                return;
              }

              _this.player = player;

              _this.getEventList().forEach(function (event) {
                player.on(event[0], event[1]);
              });

              var onInit = _this.props.onInit;
              onInit && onInit({
                playerId: playerId
              });
            }

            if (!_this.isCurrentCreate(seq) || !document.getElementById(playerId)) {
              return;
            }

            var player;

            var _temp19 = _catch$1(function () {
              return Promise.resolve(_this.createPlayer(playerId)).then(function (_this$createPlayer) {
                player = _this$createPlayer;
              });
            }, function (e) {
              if (_this.isCurrentCreate(seq)) {
                _this.handleInitError(e);
              }

              _exit = 1;
            });

            return _temp19 && _temp19.then ? _temp19.then(_temp20) : _temp20(_temp19);
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.handleInitError = function (error) {
      var onInitError = _this.props.onInitError;

      if (onInitError) {
        onInitError(error);
        return;
      }

      console.error(error);
    };

    _this.destroyPlayer = function (player) {
      try {
        var _temp22 = _catch$1(function () {
          return Promise.resolve(player.destroy()).then(function () {});
        }, function () {});

        return Promise.resolve(_temp22 && _temp22.then ? _temp22.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.destroy = function () {
      try {
        var _player = _this.player;

        if (!_player) {
          return Promise.resolve();
        }

        _this.player = null;
        return Promise.resolve(_this.destroyPlayer(_player)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.getEventList = function () {
      var _this$player;

      var Events = (_this$player = _this.player) == null ? void 0 : _this$player.Events;

      if (!Events) {
        return [];
      }

      return [[Events.Ready, _this.handleEventReady], [Events.QualityChanged, _this.handleQualityChanged], [Events.CurrentTrackChanged, _this.handleCurrentTrackChanged], [Events.SeekChapter, _this.handleSeekChapter], [Events.SizeChanged, _this.handleSizeChanged], [Events.Play, _this.handlePlay], [Events.Playing, _this.handlePlaying], [Events.Waiting, _this.handleWaiting], [Events.Pause, _this.handlePause], [Events.Ended, _this.handleEnded], [Events.TimeUpdate, _this.handleTimeUpdate], [Events.Progress, _this.handleProgress], [Events.DurationChange, _this.handleDurationChange], [Events.VolumeChange, _this.handleVolumeChange], [Events.PlaybackRateChange, _this.handlePlaybackRateChange], [Events.PipChange, _this.handlePipChange], [Events.Seeked, _this.handleSeeked], [Events.FullscreenChange, _this.handleFullscreenChange], [Events.CallAction, _this.handleCallAction], [Events.CallBookmark, _this.handleCallBookmark], [Events.Error, _this.handleError], [Events.Destroy, _this.handleDestroy]];
    };

    _this.getQueryParams = function () {
      var query = _this.props.query;
      var params = [];
      (query == null ? void 0 : query.duration) && params.push(['duration', query.duration.toString()]);
      (query == null ? void 0 : query.seek) && params.push(['seek', query.seek.toString()]);
      (query == null ? void 0 : query.playerId) && params.push(['player_id', query.playerId]);
      return params;
    };

    _this.makeURL = function (url) {
      var _url = new URL(url);

      _this.getQueryParams().forEach(function (params) {
        _url.searchParams.append(params[0], params[1]);
      });

      return _url.toString();
    };

    _this.getIFrameUrl = function () {
      var videoId = _this.props.videoId;

      if (Array.isArray(videoId)) {
        return _this.makeURL(VIDEO_PLAYLIST_HOST + videoId.join(','));
      }

      return _this.makeURL(VIDEO_HOST + videoId);
    };

    _this.createPlayer = function (playerId) {
      try {
        var _window$Kinescope;

        var _this$props4 = _this.props,
            title = _this$props4.title,
            subtitle = _this$props4.subtitle,
            poster = _this$props4.poster,
            chapters = _this$props4.chapters,
            vtt = _this$props4.vtt,
            externalId = _this$props4.externalId,
            drmAuthToken = _this$props4.drmAuthToken,
            width = _this$props4.width,
            height = _this$props4.height,
            autoPause = _this$props4.autoPause,
            autoPlay = _this$props4.autoPlay,
            loop = _this$props4.loop,
            muted = _this$props4.muted,
            playsInline = _this$props4.playsInline,
            preload = _this$props4.preload,
            language = _this$props4.language,
            controls = _this$props4.controls,
            mainPlayButton = _this$props4.mainPlayButton,
            playbackRateButton = _this$props4.playbackRateButton,
            textTrack = _this$props4.textTrack,
            bookmarks = _this$props4.bookmarks,
            callToAction = _this$props4.callToAction,
            watermark = _this$props4.watermark,
            localStorage = _this$props4.localStorage,
            playlistOptions = _this$props4.playlistOptions,
            theme = _this$props4.theme,
            createTimeout = _this$props4.createTimeout,
            attemptTimeout = _this$props4.attemptTimeout,
            errorScreen = _this$props4.errorScreen;
        var options = {
          url: _this.getIFrameUrl(),
          size: {
            width: width,
            height: height
          },
          behavior: {
            autoPause: autoPause,
            autoPlay: autoPlay,
            loop: loop,
            muted: muted,
            playsInline: playsInline,
            preload: preload,
            localStorage: localStorage,
            textTrack: textTrack,
            playlist: playlistOptions
          },
          playlist: [{
            title: title,
            subtitle: subtitle,
            poster: poster,
            chapters: chapters,
            vtt: vtt,
            bookmarks: bookmarks,
            cta: callToAction,
            drm: {
              auth: {
                token: drmAuthToken
              }
            }
          }],
          ui: {
            language: language,
            controls: controls,
            mainPlayButton: mainPlayButton,
            playbackRateButton: playbackRateButton,
            watermark: watermark
          },
          theme: theme,
          settings: {
            externalId: externalId
          }
        };

        if (createTimeout !== undefined) {
          options.timeout = createTimeout;
        }

        if (attemptTimeout !== undefined) {
          options.attemptTimeout = attemptTimeout;
        }

        if (errorScreen !== undefined) {
          options.errorScreen = errorScreen;
        }

        if (!((_window$Kinescope = window.Kinescope) != null && _window$Kinescope.IframePlayer)) throw new Error('Kinescope PLayer: IframeApi is not loaded.');
        return Promise.resolve(window.Kinescope.IframePlayer.create(playerId, options));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.setPlaylistItemOptions = function (options) {
      try {
        if (!_this.player) {
          return Promise.resolve();
        }

        return Promise.resolve(_this.player.setPlaylistItemOptions(options)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _this.isPaused = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.isPaused();
    };

    _this.isEnded = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.isEnded();
    };

    _this.play = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.play();
    };

    _this.pause = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.pause();
    };

    _this.stop = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.stop();
    };

    _this.getCurrentTime = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.getCurrentTime();
    };

    _this.getDuration = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.getDuration();
    };

    _this.seekTo = function (time) {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.seekTo(time);
    };

    _this.isMuted = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.isMuted();
    };

    _this.mute = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.mute();
    };

    _this.unmute = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.unmute();
    };

    _this.getVolume = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.getVolume();
    };

    _this.setVolume = function (value) {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.setVolume(value);
    };

    _this.getPlaybackRate = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.getPlaybackRate();
    };

    _this.setPlaybackRate = function (value) {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.setPlaybackRate(value);
    };

    _this.getVideoQualityList = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.getVideoQualityList();
    };

    _this.getVideoQuality = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.getVideoQuality();
    };

    _this.setVideoQuality = function (quality) {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.setVideoQuality(quality);
    };

    _this.enableTextTrack = function (lang) {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.enableTextTrack(lang);
    };

    _this.disableTextTrack = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.disableTextTrack();
    };

    _this.closeCTA = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.closeCTA();
    };

    _this.isFullscreen = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.isFullscreen();
    };

    _this.setFullscreen = function (fullscreen) {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.setFullscreen(fullscreen);
    };

    _this.isPip = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.isPip();
    };

    _this.setPip = function (pip) {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.setPip(pip);
    };

    _this.getPlaylistItem = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.getPlaylistItem();
    };

    _this.switchTo = function (id) {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.switchTo(id);
    };

    _this.next = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.next();
    };

    _this.previous = function () {
      if (!_this.player) {
        return Promise.reject(null);
      }

      return _this.player.previous();
    };

    _this.handleJSLoadError = function (error) {
      if (_this.unmounted) {
        return;
      }

      var onJSLoadError = _this.props.onJSLoadError;
      onJSLoadError && onJSLoadError(error);
    };

    _this.handleEventReady = function (_ref) {
      var data = _ref.data;
      var onReady = _this.props.onReady;

      _this.readyPlaylistOptions()["catch"](function () {});

      onReady && onReady(data);
    };

    _this.handleQualityChanged = function (_ref2) {
      var data = _ref2.data;
      var onQualityChanged = _this.props.onQualityChanged;
      onQualityChanged && onQualityChanged(data);
    };

    _this.handleCurrentTrackChanged = function (_ref3) {
      var data = _ref3.data;
      var onCurrentTrackChanged = _this.props.onCurrentTrackChanged;
      onCurrentTrackChanged && onCurrentTrackChanged(data);
    };

    _this.handleSeekChapter = function (_ref4) {
      var data = _ref4.data;
      var onSeekChapter = _this.props.onSeekChapter;
      onSeekChapter && onSeekChapter(data);
    };

    _this.handleSizeChanged = function (_ref5) {
      var data = _ref5.data;
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

    _this.handleTimeUpdate = function (_ref6) {
      var data = _ref6.data;
      var onTimeUpdate = _this.props.onTimeUpdate;
      onTimeUpdate && onTimeUpdate(data);
    };

    _this.handleProgress = function (_ref7) {
      var data = _ref7.data;
      var onProgress = _this.props.onProgress;
      onProgress && onProgress(data);
    };

    _this.handleDurationChange = function (_ref8) {
      var data = _ref8.data;
      var onDurationChange = _this.props.onDurationChange;
      onDurationChange && onDurationChange(data);
    };

    _this.handleVolumeChange = function (_ref9) {
      var data = _ref9.data;
      var onVolumeChange = _this.props.onVolumeChange;
      onVolumeChange && onVolumeChange(data);
    };

    _this.handlePlaybackRateChange = function (_ref10) {
      var data = _ref10.data;
      var onPlaybackRateChange = _this.props.onPlaybackRateChange;
      onPlaybackRateChange && onPlaybackRateChange(data);
    };

    _this.handlePipChange = function (_ref11) {
      var data = _ref11.data;
      var onPipChange = _this.props.onPipChange;
      onPipChange && onPipChange(data);
    };

    _this.handleSeeked = function () {
      var onSeeked = _this.props.onSeeked;
      onSeeked && onSeeked();
    };

    _this.handleFullscreenChange = function (_ref12) {
      var data = _ref12.data;
      var onFullscreenChange = _this.props.onFullscreenChange;
      onFullscreenChange && onFullscreenChange(data);
    };

    _this.handleCallAction = function (_ref13) {
      var data = _ref13.data;
      var onCallAction = _this.props.onCallAction;
      onCallAction && onCallAction(data);
    };

    _this.handleCallBookmark = function (_ref14) {
      var data = _ref14.data;
      var onCallBookmark = _this.props.onCallBookmark;
      onCallBookmark && onCallBookmark(data);
    };

    _this.handleError = function (_ref15) {
      var data = _ref15.data;
      var onError = _this.props.onError;
      onError && onError(data);
    };

    _this.handleDestroy = function () {
      var onDestroy = _this.props.onDestroy;
      onDestroy && onDestroy();
    };

    return _this;
  }

  var _proto = Player.prototype;

  _proto.componentDidMount = function componentDidMount() {
    /* StrictMode and <Activity> unmount and mount the same instance again */
    this.unmounted = false;
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.shouldPlayerUpdate(prevProps)) {
      /*
       * The new player is created with the current props, playlist options included.
       * Until the script is loaded there is nothing to re-create: handleJSLoad creates the player.
       */
      this.playerLoad && this.create();
      return;
    }

    this.shouldPlaylistUpdate(prevProps)["catch"](function () {});
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.unmounted = true;
    this.invalidateCreate();
    this.destroy();
  };

  _proto.render = function render() {
    var _this$props5 = this.props,
        className = _this$props5.className,
        style = _this$props5.style,
        playerScriptUrl = _this$props5.playerScriptUrl;
    return React__default['default'].createElement(Loader, {
      src: playerScriptUrl,
      onJSLoad: this.handleJSLoad,
      onJSLoadError: this.handleJSLoadError
    }, React__default['default'].createElement("span", {
      ref: this.parentsRef,
      className: className,
      style: style
    }));
  };

  return Player;
}(React.Component);

Player.defaultProps = {
  width: '100%',
  height: '100%',
  autoPause: true,
  localStorage: true,
  playsInline: true
};

module.exports = Player;
