const UI = require("sketch/ui"),
  Settings = require("sketch/settings"),
  Document = require("sketch/dom");
function getDefaultExportFromCjs(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default")
    ? l.default
    : l;
}
var events, hasRequiredEvents;
function requireEvents() {
  if (hasRequiredEvents) return events;
  hasRequiredEvents = 1;
  var l = typeof Reflect == "object" ? Reflect : null,
    t =
      l && typeof l.apply == "function"
        ? l.apply
        : function (o, f, c) {
            return Function.prototype.apply.call(o, f, c);
          },
    n;
  l && typeof l.ownKeys == "function"
    ? (n = l.ownKeys)
    : Object.getOwnPropertySymbols
    ? (n = function (o) {
        return Object.getOwnPropertyNames(o).concat(
          Object.getOwnPropertySymbols(o)
        );
      })
    : (n = function (o) {
        return Object.getOwnPropertyNames(o);
      });
  function r(d) {
    console && console.warn && console.warn(d);
  }
  var y =
    Number.isNaN ||
    function (o) {
      return o !== o;
    };
  function u() {
    u.init.call(this);
  }
  (events = u),
    (u.EventEmitter = u),
    (u.prototype._events = void 0),
    (u.prototype._eventsCount = 0),
    (u.prototype._maxListeners = void 0);
  var e = 10;
  Object.defineProperty(u, "defaultMaxListeners", {
    enumerable: !0,
    get: function () {
      return e;
    },
    set: function (d) {
      if (typeof d != "number" || d < 0 || y(d))
        throw new RangeError(
          'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
            d +
            "."
        );
      e = d;
    },
  }),
    (u.init = function () {
      (this._events === void 0 ||
        this._events === Object.getPrototypeOf(this)._events) &&
        ((this._events = Object.create(null)), (this._eventsCount = 0)),
        (this._maxListeners = this._maxListeners || void 0);
    }),
    (u.prototype.setMaxListeners = function (o) {
      if (typeof o != "number" || o < 0 || y(o))
        throw new RangeError(
          'The value of "n" is out of range. It must be a non-negative number. Received ' +
            o +
            "."
        );
      return (this._maxListeners = o), this;
    });
  function i(d) {
    return d._maxListeners === void 0 ? u.defaultMaxListeners : d._maxListeners;
  }
  (u.prototype.getMaxListeners = function () {
    return i(this);
  }),
    (u.prototype.emit = function (o) {
      for (var f = [], c = 1; c < arguments.length; c++) f.push(arguments[c]);
      var m = o === "error",
        S = this._events;
      if (S !== void 0) m = m && S.error === void 0;
      else if (!m) return !1;
      if (m) {
        var s;
        if ((f.length > 0 && (s = f[0]), s instanceof Error)) throw s;
        var p = new Error(
          "Unhandled error." + (s ? " (" + s.message + ")" : "")
        );
        throw ((p.context = s), p);
      }
      var v = S[o];
      if (v === void 0) return !1;
      if (typeof v == "function") t(v, this, f);
      else
        for (var M = v.length, A = R(v, M), c = 0; c < M; ++c) t(A[c], this, f);
      return !0;
    });
  function h(d, o, f, c) {
    var m, S, s;
    if (typeof f != "function")
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof f
      );
    if (
      ((S = d._events),
      S === void 0
        ? ((S = d._events = Object.create(null)), (d._eventsCount = 0))
        : (S.newListener !== void 0 &&
            (d.emit("newListener", o, f.listener ? f.listener : f),
            (S = d._events)),
          (s = S[o])),
      s === void 0)
    )
      (s = S[o] = f), ++d._eventsCount;
    else if (
      (typeof s == "function"
        ? (s = S[o] = c ? [f, s] : [s, f])
        : c
        ? s.unshift(f)
        : s.push(f),
      (m = i(d)),
      m > 0 && s.length > m && !s.warned)
    ) {
      s.warned = !0;
      var p = new Error(
        "Possible EventEmitter memory leak detected. " +
          s.length +
          " " +
          String(o) +
          " listeners added. Use emitter.setMaxListeners() to increase limit"
      );
      (p.name = "MaxListenersExceededWarning"),
        (p.emitter = d),
        (p.type = o),
        (p.count = s.length),
        r(p);
    }
    return d;
  }
  (u.prototype.addListener = function (o, f) {
    return h(this, o, f, !1);
  }),
    (u.prototype.on = u.prototype.addListener),
    (u.prototype.prependListener = function (o, f) {
      return h(this, o, f, !0);
    });
  function g() {
    for (var d = [], o = 0; o < arguments.length; o++) d.push(arguments[o]);
    this.fired ||
      (this.target.removeListener(this.type, this.wrapFn),
      (this.fired = !0),
      t(this.listener, this.target, d));
  }
  function a(d, o, f) {
    var c = { fired: !1, wrapFn: void 0, target: d, type: o, listener: f },
      m = g.bind(c);
    return (m.listener = f), (c.wrapFn = m), m;
  }
  (u.prototype.once = function (o, f) {
    if (typeof f != "function")
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof f
      );
    return this.on(o, a(this, o, f)), this;
  }),
    (u.prototype.prependOnceListener = function (o, f) {
      if (typeof f != "function")
        throw new TypeError(
          'The "listener" argument must be of type Function. Received type ' +
            typeof f
        );
      return this.prependListener(o, a(this, o, f)), this;
    }),
    (u.prototype.removeListener = function (o, f) {
      var c, m, S, s, p;
      if (typeof f != "function")
        throw new TypeError(
          'The "listener" argument must be of type Function. Received type ' +
            typeof f
        );
      if (((m = this._events), m === void 0)) return this;
      if (((c = m[o]), c === void 0)) return this;
      if (c === f || c.listener === f)
        --this._eventsCount === 0
          ? (this._events = Object.create(null))
          : (delete m[o],
            m.removeListener &&
              this.emit("removeListener", o, c.listener || f));
      else if (typeof c != "function") {
        for (S = -1, s = c.length - 1; s >= 0; s--)
          if (c[s] === f || c[s].listener === f) {
            (p = c[s].listener), (S = s);
            break;
          }
        if (S < 0) return this;
        S === 0 ? c.shift() : C(c, S),
          c.length === 1 && (m[o] = c[0]),
          m.removeListener !== void 0 && this.emit("removeListener", o, p || f);
      }
      return this;
    }),
    (u.prototype.off = u.prototype.removeListener),
    (u.prototype.removeAllListeners = function (o) {
      var f, c, m;
      if (((c = this._events), c === void 0)) return this;
      if (c.removeListener === void 0)
        return (
          arguments.length === 0
            ? ((this._events = Object.create(null)), (this._eventsCount = 0))
            : c[o] !== void 0 &&
              (--this._eventsCount === 0
                ? (this._events = Object.create(null))
                : delete c[o]),
          this
        );
      if (arguments.length === 0) {
        var S = Object.keys(c),
          s;
        for (m = 0; m < S.length; ++m)
          (s = S[m]), s !== "removeListener" && this.removeAllListeners(s);
        return (
          this.removeAllListeners("removeListener"),
          (this._events = Object.create(null)),
          (this._eventsCount = 0),
          this
        );
      }
      if (((f = c[o]), typeof f == "function")) this.removeListener(o, f);
      else if (f !== void 0)
        for (m = f.length - 1; m >= 0; m--) this.removeListener(o, f[m]);
      return this;
    });
  function N(d, o, f) {
    var c = d._events;
    if (c === void 0) return [];
    var m = c[o];
    return m === void 0
      ? []
      : typeof m == "function"
      ? f
        ? [m.listener || m]
        : [m]
      : f
      ? b(m)
      : R(m, m.length);
  }
  (u.prototype.listeners = function (o) {
    return N(this, o, !0);
  }),
    (u.prototype.rawListeners = function (o) {
      return N(this, o, !1);
    }),
    (u.listenerCount = function (d, o) {
      return typeof d.listenerCount == "function"
        ? d.listenerCount(o)
        : _.call(d, o);
    }),
    (u.prototype.listenerCount = _);
  function _(d) {
    var o = this._events;
    if (o !== void 0) {
      var f = o[d];
      if (typeof f == "function") return 1;
      if (f !== void 0) return f.length;
    }
    return 0;
  }
  u.prototype.eventNames = function () {
    return this._eventsCount > 0 ? n(this._events) : [];
  };
  function R(d, o) {
    for (var f = new Array(o), c = 0; c < o; ++c) f[c] = d[c];
    return f;
  }
  function C(d, o) {
    for (; o + 1 < d.length; o++) d[o] = d[o + 1];
    d.pop();
  }
  function b(d) {
    for (var o = new Array(d.length), f = 0; f < o.length; ++f)
      o[f] = d[f].listener || d[f];
    return o;
  }
  return events;
}
var browserApi, hasRequiredBrowserApi;
function requireBrowserApi() {
  if (hasRequiredBrowserApi) return browserApi;
  hasRequiredBrowserApi = 1;
  function l(t) {
    if (!t || t[0] !== "#") {
      if (t && typeof t.isKindOfClass == "function" && t.isKindOfClass(NSColor))
        return t;
      throw new Error(
        "Incorrect color formating. It should be an hex color: #RRGGBBAA"
      );
    }
    var n = t.substr(1);
    n.length === 3 ? (n += "F") : n.length === 6 && (n += "FF");
    var r;
    if (n.length === 4) for (var y = 0; y < 4; y += 1) (r += n[y]), (r += n[y]);
    else if (n.length === 8) r = n;
    else return NSColor.whiteColor();
    var u = parseInt(r.slice(0, 2), 16) / 255,
      e = parseInt(r.slice(2, 4), 16) / 255,
      i = parseInt(r.slice(4, 6), 16) / 255,
      h = parseInt(r.slice(6, 8), 16) / 255;
    return NSColor.colorWithSRGBRed_green_blue_alpha(u, e, i, h);
  }
  return (
    (browserApi = function (t, n, r) {
      (t._panel = n),
        (t._webview = r),
        (t._destroyed = !1),
        (t.destroy = function () {
          return n.close();
        }),
        (t.close = function () {
          if (n.delegate().utils && n.delegate().utils.parentWindow) {
            var e = !0;
            t.emit("close", {
              get defaultPrevented() {
                return !e;
              },
              preventDefault: function () {
                e = !1;
              },
            }),
              e && n.delegate().utils.parentWindow.endSheet(n);
            return;
          }
          t.isClosable() && n.performClose(null);
        });
      function y(e) {
        t.isVisible() &&
          (e
            ? (NSApplication.sharedApplication().activateIgnoringOtherApps(!0),
              n.makeKeyAndOrderFront(null))
            : (n.orderBack(null),
              NSApp.mainWindow().makeKeyAndOrderFront(null)));
      }
      (t.focus = y.bind(this, !0)),
        (t.blur = y.bind(this, !1)),
        (t.isFocused = function () {
          return n.isKeyWindow();
        }),
        (t.isDestroyed = function () {
          return t._destroyed;
        }),
        (t.show = function () {
          return (
            NSApp.activateIgnoringOtherApps(!0),
            n.delegate().utils && n.delegate().utils.parentWindow
              ? n.delegate().utils.parentWindow.beginSheet_completionHandler(
                  n,
                  __mocha__.createBlock_function("v16@?0q8", function () {
                    t.emit("closed");
                  })
                )
              : n.makeKeyAndOrderFront(null)
          );
        }),
        (t.showInactive = function () {
          return n.orderFrontRegardless();
        }),
        (t.hide = function () {
          return n.orderOut(null);
        }),
        (t.isVisible = function () {
          return n.isVisible();
        }),
        (t.isModal = function () {
          return !1;
        }),
        (t.maximize = function () {
          t.isMaximized() || n.zoom(null);
        }),
        (t.unmaximize = function () {
          t.isMaximized() && n.zoom(null);
        }),
        (t.isMaximized = function () {
          if (n.styleMask() & NSResizableWindowMask) return n.isZoomed();
          var e = NSScreen.mainScreen().visibleFrame(),
            i = n.frame();
          return (
            e.origin.x == i.origin.x &&
            e.origin.y == i.origin.y &&
            e.size.width == i.size.width &&
            e.size.height == i.size.height
          );
        }),
        (t.minimize = function () {
          return n.miniaturize(null);
        }),
        (t.restore = function () {
          return n.deminiaturize(null);
        }),
        (t.isMinimized = function () {
          return n.isMiniaturized();
        }),
        (t.setFullScreen = function (e) {
          e !== t.isFullscreen() && n.toggleFullScreen(null);
        }),
        (t.isFullscreen = function () {
          return n.styleMask() & NSFullScreenWindowMask;
        }),
        (t.setAspectRatio = function (e) {
          e > 0
            ? n.setAspectRatio(NSMakeSize(e, 1))
            : n.setResizeIncrements(NSMakeSize(1, 1));
        }),
        (t.setBounds = function (e, i) {
          if (!e || t.isFullscreen()) return;
          const h = Object.assign(t.getBounds(), e);
          var g = NSMakeRect(h.x, 0, h.width, h.height),
            a = NSScreen.screens().firstObject();
          (g.origin.y = NSHeight(a.frame()) - h.y),
            n.setFrame_display_animate(g, !0, i);
        }),
        (t.getBounds = function () {
          const e = n.frame();
          var i = NSScreen.screens().firstObject().frame();
          return {
            x: e.origin.x,
            y: Math.round(NSHeight(i) - e.origin.y),
            width: e.size.width,
            height: e.size.height,
          };
        }),
        (t.setContentBounds = function (e, i) {
          t.setBounds(e, i);
        }),
        (t.getContentBounds = function () {
          return t.getBounds();
        }),
        (t.setSize = function (e, i, h) {
          return t.setBounds({ width: e, height: i }, h);
        }),
        (t.getSize = function () {
          var e = t.getBounds();
          return [e.width, e.height];
        }),
        (t.setContentSize = function (e, i, h) {
          return t.setContentBounds({ width: e, height: i }, h);
        }),
        (t.getContentSize = function () {
          var e = t.getContentBounds();
          return [e.width, e.height];
        }),
        (t.setMinimumSize = function (e, i) {
          const h = CGSizeMake(e, i);
          n.setContentMinSize(h);
        }),
        (t.getMinimumSize = function () {
          const e = n.contentMinSize();
          return [e.width, e.height];
        }),
        (t.setMaximumSize = function (e, i) {
          const h = CGSizeMake(e, i);
          n.setContentMaxSize(h);
        }),
        (t.getMaximumSize = function () {
          const e = n.contentMaxSize();
          return [e.width, e.height];
        }),
        (t.setResizable = function (e) {
          return t._setStyleMask(e, NSResizableWindowMask);
        }),
        (t.isResizable = function () {
          return n.styleMask() & NSResizableWindowMask;
        }),
        (t.setMovable = function (e) {
          return n.setMovable(e);
        }),
        (t.isMovable = function () {
          return n.isMovable();
        }),
        (t.setMinimizable = function (e) {
          return t._setStyleMask(e, NSMiniaturizableWindowMask);
        }),
        (t.isMinimizable = function () {
          return n.styleMask() & NSMiniaturizableWindowMask;
        }),
        (t.setMaximizable = function (e) {
          n.standardWindowButton(NSWindowZoomButton) &&
            n.standardWindowButton(NSWindowZoomButton).setEnabled(e);
        }),
        (t.isMaximizable = function () {
          return (
            n.standardWindowButton(NSWindowZoomButton) &&
            n.standardWindowButton(NSWindowZoomButton).isEnabled()
          );
        }),
        (t.setFullScreenable = function (e) {
          t._setCollectionBehavior(
            e,
            NSWindowCollectionBehaviorFullScreenPrimary
          ),
            t._setCollectionBehavior(
              !e,
              NSWindowCollectionBehaviorFullScreenAuxiliary
            );
        }),
        (t.isFullScreenable = function () {
          var e = n.collectionBehavior();
          return e & NSWindowCollectionBehaviorFullScreenPrimary;
        }),
        (t.setClosable = function (e) {
          t._setStyleMask(e, NSClosableWindowMask);
        }),
        (t.isClosable = function () {
          return n.styleMask() & NSClosableWindowMask;
        }),
        (t.setAlwaysOnTop = function (e, i, h) {
          var g = NSNormalWindowLevel,
            a = CGWindowLevelForKey(kCGMaximumWindowLevelKey),
            N = CGWindowLevelForKey(kCGMinimumWindowLevelKey);
          e &&
            (i === "normal"
              ? (g = NSNormalWindowLevel)
              : i === "torn-off-menu"
              ? (g = NSTornOffMenuWindowLevel)
              : i === "modal-panel"
              ? (g = NSModalPanelWindowLevel)
              : i === "main-menu"
              ? (g = NSMainMenuWindowLevel)
              : i === "status"
              ? (g = NSStatusWindowLevel)
              : i === "pop-up-menu"
              ? (g = NSPopUpMenuWindowLevel)
              : i === "screen-saver"
              ? (g = NSScreenSaverWindowLevel)
              : i === "dock"
              ? (g = NSDockWindowLevel)
              : (g = NSFloatingWindowLevel));
          var _ = g + (h || 0);
          if (_ >= N && _ <= a) n.setLevel(_);
          else
            throw new Error("relativeLevel must be between " + N + " and " + a);
        }),
        (t.isAlwaysOnTop = function () {
          return n.level() !== NSNormalWindowLevel;
        }),
        (t.moveTop = function () {
          return n.orderFrontRegardless();
        }),
        (t.center = function () {
          n.center();
        }),
        (t.setPosition = function (e, i, h) {
          return t.setBounds({ x: e, y: i }, h);
        }),
        (t.getPosition = function () {
          var e = t.getBounds();
          return [e.x, e.y];
        }),
        (t.setTitle = function (e) {
          n.setTitle(e);
        }),
        (t.getTitle = function () {
          return String(n.title());
        });
      var u = 0;
      (t.flashFrame = function (e) {
        e
          ? (u = NSApp.requestUserAttention(NSInformationalRequest))
          : (NSApp.cancelUserAttentionRequest(u), (u = 0));
      }),
        (t.getNativeWindowHandle = function () {
          return n;
        }),
        (t.getNativeWebViewHandle = function () {
          return r;
        }),
        (t.loadURL = function (e) {
          if (
            (/^(?!https?|file).*\.html?$/.test(e) &&
              typeof __command < "u" &&
              __command.pluginBundle() &&
              (e =
                "file://" +
                __command.pluginBundle().urlForResourceNamed(e).path()),
            /^file:\/\/.*\.html?$/.test(e))
          ) {
            (e = NSString.alloc().initWithString(e)),
              (e = e.stringByAddingPercentEncodingWithAllowedCharacters(
                NSCharacterSet.URLQueryAllowedCharacterSet()
              )),
              r.loadFileURL_allowingReadAccessToURL(
                NSURL.URLWithString(e),
                NSURL.URLWithString("file:///")
              );
            return;
          }
          const i = NSURL.URLWithString(e),
            h = NSURLRequest.requestWithURL(i);
          r.loadRequest(h);
        }),
        (t.reload = function () {
          r.reload();
        }),
        (t.setHasShadow = function (e) {
          return n.setHasShadow(e);
        }),
        (t.hasShadow = function () {
          return n.hasShadow();
        }),
        (t.setOpacity = function (e) {
          return n.setAlphaValue(e);
        }),
        (t.getOpacity = function () {
          return n.alphaValue();
        }),
        (t.setVisibleOnAllWorkspaces = function (e) {
          return t._setCollectionBehavior(
            e,
            NSWindowCollectionBehaviorCanJoinAllSpaces
          );
        }),
        (t.isVisibleOnAllWorkspaces = function () {
          var e = n.collectionBehavior();
          return e & NSWindowCollectionBehaviorCanJoinAllSpaces;
        }),
        (t.setIgnoreMouseEvents = function (e) {
          return n.setIgnoresMouseEvents(e);
        }),
        (t.setContentProtection = function (e) {
          n.setSharingType(e ? NSWindowSharingNone : NSWindowSharingReadOnly);
        }),
        (t.setAutoHideCursor = function (e) {
          n.setDisableAutoHideCursor(e);
        }),
        (t.setVibrancy = function (e) {
          var i = t._vibrantView;
          if (!e) {
            if (i == null) return;
            i.removeFromSuperview(), n.setVibrantView(null);
            return;
          }
          if (i == null) {
            var h = n.contentView();
            (i = NSVisualEffectView.alloc().initWithFrame(h.bounds())),
              (t._vibrantView = i),
              i.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable),
              i.setBlendingMode(NSVisualEffectBlendingModeBehindWindow),
              i.setState(NSVisualEffectStateActive),
              i.setFrame(h.bounds()),
              h.addSubview_positioned_relativeTo(i, NSWindowBelow, null);
          }
          var g = NSVisualEffectMaterialLight;
          e === "appearance-based"
            ? (g = NSVisualEffectMaterialAppearanceBased)
            : e === "light"
            ? (g = NSVisualEffectMaterialLight)
            : e === "dark"
            ? (g = NSVisualEffectMaterialDark)
            : e === "titlebar"
            ? (g = NSVisualEffectMaterialTitlebar)
            : e === "selection"
            ? (g = NSVisualEffectMaterialSelection)
            : e === "menu"
            ? (g = NSVisualEffectMaterialMenu)
            : e === "popover"
            ? (g = NSVisualEffectMaterialPopover)
            : e === "sidebar"
            ? (g = NSVisualEffectMaterialSidebar)
            : e === "medium-light"
            ? (g = NSVisualEffectMaterialMediumLight)
            : e === "ultra-dark" && (g = NSVisualEffectMaterialUltraDark),
            i.setMaterial(g);
        }),
        (t._setBackgroundColor = function (e) {
          var i = l(e);
          r.setValue_forKey(!1, "drawsBackground"), (n.backgroundColor = i);
        }),
        (t._invalidate = function () {
          n.flushWindow(), n.contentView().setNeedsDisplay(!0);
        }),
        (t._setStyleMask = function (e, i) {
          var h = t.isMaximizable();
          e
            ? n.setStyleMask(n.styleMask() | i)
            : n.setStyleMask(n.styleMask() & ~i),
            t.setMaximizable(h);
        }),
        (t._setCollectionBehavior = function (e, i) {
          var h = t.isMaximizable();
          e
            ? n.setCollectionBehavior(n.collectionBehavior() | i)
            : n.setCollectionBehavior(n.collectionBehavior() & ~i),
            t.setMaximizable(h);
        }),
        (t._showWindowButton = function (e) {
          var i = n.standardWindowButton(e);
          i.superview().addSubview_positioned_relative(i, NSWindowAbove, null);
        });
    }),
    browserApi
  );
}
var executeJavascript = { exports: {} },
  constants,
  hasRequiredConstants;
function requireConstants() {
  return (
    hasRequiredConstants ||
      ((hasRequiredConstants = 1),
      (constants = {
        JS_BRIDGE: "__skpm_sketchBridge",
        JS_BRIDGE_RESULT_SUCCESS: "__skpm_sketchBridge_success",
        JS_BRIDGE_RESULT_ERROR: "__skpm_sketchBridge_error",
        START_MOVING_WINDOW: "__skpm_startMovingWindow",
        EXECUTE_JAVASCRIPT: "__skpm_executeJS",
        EXECUTE_JAVASCRIPT_SUCCESS: "__skpm_executeJS_success_",
        EXECUTE_JAVASCRIPT_ERROR: "__skpm_executeJS_error_",
      })),
    constants
  );
}
var hasRequiredExecuteJavascript;
function requireExecuteJavascript() {
  return (
    hasRequiredExecuteJavascript ||
      ((hasRequiredExecuteJavascript = 1),
      (function (l) {
        var t = requireConstants();
        (l.exports = function (n, r) {
          function y(u, e, i) {
            typeof e == "function" && ((i = e), (e = !1));
            var h = coscript.createFiber();
            return n.navigationDelegate().state &&
              n.navigationDelegate().state.wasReady == 0
              ? new Promise(function (g, a) {
                  r.once("ready-to-show", function () {
                    y(u, e, i).then(g).catch(a), h.cleanup();
                  });
                })
              : new Promise(function (g, a) {
                  var N = Math.random();
                  r.webContents.on(
                    t.EXECUTE_JAVASCRIPT_SUCCESS + N,
                    function (_) {
                      try {
                        i && i(null, _), g(_);
                      } catch (R) {
                        a(R);
                      }
                      h.cleanup();
                    }
                  ),
                    r.webContents.on(
                      t.EXECUTE_JAVASCRIPT_ERROR + N,
                      function (_) {
                        try {
                          i ? (i(_), g()) : a(_);
                        } catch (R) {
                          a(R);
                        }
                        h.cleanup();
                      }
                    ),
                    n.evaluateJavaScript_completionHandler(
                      l.exports.wrapScript(u, N),
                      null
                    );
                });
          }
          return y;
        }),
          (l.exports.wrapScript = function (n, r) {
            return (
              "window." +
              t.EXECUTE_JAVASCRIPT +
              "(" +
              r +
              ", " +
              JSON.stringify(n) +
              ")"
            );
          }),
          (l.exports.injectScript = function (n) {
            var r =
                "window." +
                t.EXECUTE_JAVASCRIPT +
                ' = function(id, script) {  try {    var res = eval(script);    if (res && typeof res.then === "function" && typeof res.catch === "function") {      res.then(function (res2) {        window.postMessage("' +
                t.EXECUTE_JAVASCRIPT_SUCCESS +
                '" + id, res2);      })      .catch(function (err) {        window.postMessage("' +
                t.EXECUTE_JAVASCRIPT_ERROR +
                '" + id, err);      })    } else {      window.postMessage("' +
                t.EXECUTE_JAVASCRIPT_SUCCESS +
                '" + id, res);    }  } catch (err) {    window.postMessage("' +
                t.EXECUTE_JAVASCRIPT_ERROR +
                '" + id, err);  }}',
              y =
                WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
                  r,
                  0,
                  !0
                );
            n.configuration().userContentController().addUserScript(y);
          });
      })(executeJavascript)),
    executeJavascript.exports
  );
}
var webviewApi, hasRequiredWebviewApi;
function requireWebviewApi() {
  if (hasRequiredWebviewApi) return webviewApi;
  hasRequiredWebviewApi = 1;
  var l = requireEvents(),
    t = requireExecuteJavascript();
  return (
    (webviewApi = function (r, y, u) {
      var e = new l();
      (e.loadURL = r.loadURL),
        (e.loadFile = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.downloadURL = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.getURL = function () {
          return String(u.URL());
        }),
        (e.getTitle = function () {
          return String(u.title());
        }),
        (e.isDestroyed = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.focus = r.focus),
        (e.isFocused = r.isFocused),
        (e.isLoading = function () {
          return !!u.loading();
        }),
        (e.isLoadingMainFrame = function () {
          return !!u.loading();
        }),
        (e.isWaitingForResponse = function () {
          return !u.loading();
        }),
        (e.stop = function () {
          u.stopLoading();
        }),
        (e.reload = function () {
          u.reload();
        }),
        (e.reloadIgnoringCache = function () {
          u.reloadFromOrigin();
        }),
        (e.canGoBack = function () {
          return !!u.canGoBack();
        }),
        (e.canGoForward = function () {
          return !!u.canGoForward();
        }),
        (e.canGoToOffset = function (i) {
          return !!u.backForwardList().itemAtIndex(i);
        }),
        (e.clearHistory = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.goBack = function () {
          u.goBack();
        }),
        (e.goForward = function () {
          u.goForward();
        }),
        (e.goToIndex = function (i) {
          var h = u.backForwardList(),
            g = h.backList(),
            a = g.count();
          if (a > i) {
            u.loadRequest(NSURLRequest.requestWithURL(g[i]));
            return;
          }
          var N = h.forwardList();
          if (N.count() > i - a) {
            u.loadRequest(NSURLRequest.requestWithURL(N[i - a]));
            return;
          }
          throw new Error("Cannot go to index " + i);
        }),
        (e.goToOffset = function (i) {
          if (!e.canGoToOffset(i)) throw new Error("Cannot go to offset " + i);
          u.loadRequest(
            NSURLRequest.requestWithURL(u.backForwardList().itemAtIndex(i))
          );
        }),
        (e.isCrashed = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.setUserAgent = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.getUserAgent = function () {
          const i = u.customUserAgent();
          return i ? String(i) : void 0;
        }),
        (e.insertCSS = function (i) {
          var h =
              "var style = document.createElement('style'); style.innerHTML = " +
              i.replace(/"/, '\\"') +
              "; document.head.appendChild(style);",
            g =
              WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
                h,
                0,
                !0
              );
          u.configuration().userContentController().addUserScript(g);
        }),
        (e.insertJS = function (i) {
          var h =
            WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
              i,
              0,
              !0
            );
          u.configuration().userContentController().addUserScript(h);
        }),
        (e.executeJavaScript = t(u, r)),
        (e.setIgnoreMenuShortcuts = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.setAudioMuted = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.isAudioMuted = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.setZoomFactor = function (i) {
          u.setMagnification_centeredAtPoint(i, CGPointMake(0, 0));
        }),
        (e.getZoomFactor = function (i) {
          i(Number(u.magnification()));
        }),
        (e.setZoomLevel = function (i) {
          e.setZoomFactor(Math.pow(1.2, i));
        }),
        (e.getZoomLevel = function (i) {
          i(Math.log(Number(u.magnification())) / Math.log(1.2));
        }),
        (e.setVisualZoomLevelLimits = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.setLayoutZoomLevelLimits = function () {
          console.warn(
            "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
          );
        }),
        (e.send = function () {
          const i =
            "window.postMessage({isSketchMessage: true,origin: '" +
            String(__command.identifier()) +
            "',args: " +
            JSON.stringify([].slice.call(arguments)) +
            '}, "*")';
          u.evaluateJavaScript_completionHandler(i, null);
        }),
        (e.getNativeWebview = function () {
          return u;
        }),
        (r.webContents = e);
    }),
    webviewApi
  );
}
var fitSubview, hasRequiredFitSubview;
function requireFitSubview() {
  if (hasRequiredFitSubview) return fitSubview;
  hasRequiredFitSubview = 1;
  function l(t, n, r, y) {
    r.addConstraint(
      NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(
        n,
        t,
        NSLayoutRelationEqual,
        r,
        t,
        1,
        y
      )
    );
  }
  return (
    (fitSubview = function (n, r, y) {
      (y = y || []),
        n.setTranslatesAutoresizingMaskIntoConstraints(!1),
        l(NSLayoutAttributeLeft, n, r, y[0] || 0),
        l(NSLayoutAttributeTop, n, r, y[1] || 0),
        l(NSLayoutAttributeRight, n, r, y[2] || 0),
        l(NSLayoutAttributeBottom, n, r, y[3] || 0);
    }),
    fitSubview
  );
}
var dispatchFirstClick, hasRequiredDispatchFirstClick;
function requireDispatchFirstClick() {
  if (hasRequiredDispatchFirstClick) return dispatchFirstClick;
  hasRequiredDispatchFirstClick = 1;
  var l =
    '["text", "textarea", "date", "datetime-local", "email", "number", "month", "password", "search", "tel", "time", "url", "week" ]';
  return (
    (dispatchFirstClick = function (t, n) {
      var r = t.convertPoint_fromView(n.locationInWindow(), null);
      return (
        "var el = document.elementFromPoint(" +
        r.x +
        ", " +
        r.y +
        '); if (el && el.tagName === "SELECT") {  var event = document.createEvent("MouseEvents");  event.initMouseEvent("mousedown", true, true, window);  el.dispatchEvent(event);} else if (el && ' +
        l +
        '.indexOf(el.type) >= 0 && el.focus) {el.focus();} else if (el) {el.dispatchEvent(new Event("click", {bubbles: true}))}'
      );
    }),
    dispatchFirstClick
  );
}
var injectClientMessaging, hasRequiredInjectClientMessaging;
function requireInjectClientMessaging() {
  if (hasRequiredInjectClientMessaging) return injectClientMessaging;
  hasRequiredInjectClientMessaging = 1;
  var l = requireConstants();
  return (
    (injectClientMessaging = function (t) {
      var n =
          `window.originalPostMessage = window.postMessage;window.postMessage = function(actionName) {  if (!actionName) {    throw new Error('missing action name')  }  var id = String(Math.random()).replace(".", "");    var args = [].slice.call(arguments);    args.unshift(id);  return new Promise(function (resolve, reject) {    window["` +
          l.JS_BRIDGE_RESULT_SUCCESS +
          '" + id] = resolve;    window["' +
          l.JS_BRIDGE_RESULT_ERROR +
          '" + id] = reject;    window.webkit.messageHandlers.' +
          l.JS_BRIDGE +
          ".postMessage(JSON.stringify(args));  });}",
        r = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
          n,
          0,
          !0
        );
      t.configuration().userContentController().addUserScript(r);
    }),
    injectClientMessaging
  );
}
var movableArea = {},
  hasRequiredMovableArea;
function requireMovableArea() {
  if (hasRequiredMovableArea) return movableArea;
  hasRequiredMovableArea = 1;
  var l = requireConstants();
  return (
    (movableArea.injectScript = function (t) {
      var n =
          `(function () {document.addEventListener('mousedown', onMouseDown);function shouldDrag(target) {  if (!target || (target.dataset || {}).appRegion === "no-drag") { return false }  if ((target.dataset || {}).appRegion === "drag") { return true }  return shouldDrag(target.parentElement)};function onMouseDown(e) {  if (e.button !== 0 || !shouldDrag(e.target)) { return }  window.postMessage("` +
          l.START_MOVING_WINDOW +
          '");};})()',
        r = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
          n,
          0,
          !0
        );
      t.configuration().userContentController().addUserScript(r);
    }),
    (movableArea.setupHandler = function (t) {
      var n = null,
        r = null,
        y = null;
      function u() {
        if (!r || NSEvent.pressedMouseButtons() !== 1) {
          clearInterval(y), (n = null), (r = null);
          return;
        }
        var e = NSEvent.mouseLocation();
        t.setPosition(r.x + (e.x - n.x), r.y + (n.y - e.y), !1);
      }
      t.webContents.on(l.START_MOVING_WINDOW, function () {
        n = NSEvent.mouseLocation();
        var e = t.getPosition();
        (r = { x: e[0], y: e[1] }), (y = setInterval(u, 1e3 / 60));
      });
    }),
    movableArea
  );
}
var mochaJsDelegate, hasRequiredMochaJsDelegate;
function requireMochaJsDelegate() {
  return (
    hasRequiredMochaJsDelegate ||
      ((hasRequiredMochaJsDelegate = 1),
      (mochaJsDelegate = function MochaDelegate(definition, superclass) {
        var uniqueClassName =
            "MochaJSDelegate_DynamicClass_" + NSUUID.UUID().UUIDString(),
          delegateClassDesc =
            MOClassDescription.allocateDescriptionForClassWithName_superclass_(
              uniqueClassName,
              superclass || NSObject
            ),
          handlers = {},
          ivars = {};
        function setHandlerForSelector(selectorString, func) {
          var handlerHasBeenSet = selectorString in handlers,
            selector = NSSelectorFromString(selectorString);
          if (((handlers[selectorString] = func), !handlerHasBeenSet)) {
            for (var args = [], regex = /:/g; regex.exec(selectorString); )
              args.push("arg" + args.length);
            var dynamicFunction = eval(
              "(function (" +
                args.join(", ") +
                ") { return handlers[selectorString].apply(this, arguments); })"
            );
            delegateClassDesc.addInstanceMethodWithSelector_function(
              selector,
              dynamicFunction
            );
          }
        }
        function setIvar(l, t) {
          var n = l in handlers;
          if (((ivars[l] = t), !n)) {
            delegateClassDesc.addInstanceVariableWithName_typeEncoding(l, "@");
            var r = MOPropertyDescription.new();
            (r.name = l),
              (r.typeEncoding = "@"),
              (r.weak = !0),
              (r.ivarName = l),
              delegateClassDesc.addProperty(r);
          }
        }
        (this.getClass = function () {
          return NSClassFromString(uniqueClassName);
        }),
          (this.getClassInstance = function (l) {
            var t = NSClassFromString(uniqueClassName).new();
            return (
              Object.keys(ivars).forEach(function (n) {
                t[n] = ivars[n];
              }),
              Object.keys(l || {}).forEach(function (n) {
                t[n] = l[n];
              }),
              t
            );
          }),
          (this.new = this.getClassInstance),
          typeof definition == "object" &&
            Object.keys(definition).forEach(function (l) {
              typeof definition[l] == "function"
                ? setHandlerForSelector(l, definition[l])
                : setIvar(l, definition[l]);
            }),
          delegateClassDesc.registerClass();
      })),
    mochaJsDelegate
  );
}
var parseWebArguments, hasRequiredParseWebArguments;
function requireParseWebArguments() {
  return (
    hasRequiredParseWebArguments ||
      ((hasRequiredParseWebArguments = 1),
      (parseWebArguments = function (l) {
        var t = null;
        try {
          t = JSON.parse(l);
        } catch {}
        return !t || !t.constructor || t.constructor !== Array || t.length == 0
          ? null
          : t;
      })),
    parseWebArguments
  );
}
var setDelegates, hasRequiredSetDelegates;
function requireSetDelegates() {
  if (hasRequiredSetDelegates) return setDelegates;
  hasRequiredSetDelegates = 1;
  var l = requireMochaJsDelegate(),
    t = requireParseWebArguments(),
    n = requireConstants(),
    r,
    y,
    u,
    e;
  return (
    (setDelegates = function (i, h, g, a) {
      e ||
        (e = new l({
          utils: null,
          "observeValueForKeyPath:ofObject:change:context:": function (
            c,
            m,
            S
          ) {
            const s = S[NSKeyValueChangeNewKey],
              p =
                String(
                  s.bestMatchFromAppearancesWithNames([
                    "NSAppearanceNameAqua",
                    "NSAppearanceNameDarkAqua",
                  ])
                ) === "NSAppearanceNameDarkAqua";
            this.utils.executeJavaScript(
              "document.body.classList.remove('__skpm-" +
                (p ? "light" : "dark") +
                "'); document.body.classList.add('__skpm-" +
                (p ? "dark" : "light") +
                "')"
            );
          },
        })),
        r ||
          (r = new l({
            utils: null,
            panel: null,
            "windowDidResize:": function () {
              this.utils.emit("resize");
            },
            "windowDidMiniaturize:": function () {
              this.utils.emit("minimize");
            },
            "windowDidDeminiaturize:": function () {
              this.utils.emit("restore");
            },
            "windowDidEnterFullScreen:": function () {
              this.utils.emit("enter-full-screen");
            },
            "windowDidExitFullScreen:": function () {
              this.utils.emit("leave-full-screen");
            },
            "windowDidMove:": function () {
              this.utils.emit("move"), this.utils.emit("moved");
            },
            "windowShouldClose:": function () {
              var c = 1;
              return (
                this.utils.emit("close", {
                  get defaultPrevented() {
                    return !c;
                  },
                  preventDefault: function () {
                    c = 0;
                  },
                }),
                c
              );
            },
            "windowWillClose:": function () {
              this.utils.emit("closed");
            },
            "windowDidBecomeKey:": function () {
              this.utils.emit("focus", this.panel.currentEvent());
            },
            "windowDidResignKey:": function () {
              this.utils.emit("blur");
            },
          })),
        y ||
          (y = new l({
            state: { wasReady: 0 },
            utils: null,
            "webView:didCommitNavigation:": function (c) {
              this.utils.emit("will-navigate", {}, String(String(c.URL())));
            },
            "webView:didStartProvisionalNavigation:": function () {
              this.utils.emit("did-start-navigation"),
                this.utils.emit("did-start-loading");
            },
            "webView:didReceiveServerRedirectForProvisionalNavigation:":
              function () {
                this.utils.emit("did-get-redirect-request");
              },
            "webView:didFailProvisionalNavigation:withError:": function (
              c,
              m,
              S
            ) {
              this.utils.emit("did-fail-load", S);
            },
            "webView:didFinishNavigation:": function () {
              this.state.wasReady == 0 &&
                ((this.state.wasReady = 1),
                this.utils.emitBrowserEvent("ready-to-show")),
                this.utils.emit("did-navigate"),
                this.utils.emit("did-frame-navigate"),
                this.utils.emit("did-stop-loading"),
                this.utils.emit("did-finish-load"),
                this.utils.emit("did-frame-finish-load");
            },
            "webViewWebContentProcessDidTerminate:": function () {
              this.utils.emit("dom-ready");
            },
          })),
        u ||
          (u = new l({
            utils: null,
            "userContentController:didReceiveScriptMessage:": function (c, m) {
              var S = this.utils.parseWebArguments(String(m.body()));
              S &&
                (!S[0] ||
                  typeof S[0] != "string" ||
                  ((S[0] = String(S[0])), this.utils.emit.apply(this, S)));
            },
          }));
      var N = e.new({
          utils: {
            executeJavaScript(c) {
              g.evaluateJavaScript_completionHandler(c, null);
            },
          },
        }),
        _ = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
          "document.addEventListener('DOMContentLoaded', function() { document.body.classList.add('__skpm-" +
            (typeof MSTheme < "u" && MSTheme.sharedTheme().isDark()
              ? "dark"
              : "light") +
            "') }, false)",
          0,
          !0
        );
      g.configuration().userContentController().addUserScript(_),
        NSApplication.sharedApplication().addObserver_forKeyPath_options_context(
          N,
          "effectiveAppearance",
          NSKeyValueObservingOptionNew,
          null
        );
      var R = NSThread.mainThread().threadDictionary();
      R[i.id + ".themeObserver"] = N;
      var C = y.new({
        utils: {
          setTitle: i.setTitle.bind(i),
          emitBrowserEvent() {
            try {
              i.emit.apply(i, arguments);
            } catch (c) {
              if (
                typeof process < "u" &&
                process.listenerCount &&
                process.listenerCount("uncaughtException")
              )
                process.emit("uncaughtException", c, "uncaughtException");
              else throw (console.error(c), c);
            }
          },
          emit() {
            try {
              i.webContents.emit.apply(i.webContents, arguments);
            } catch (c) {
              if (
                typeof process < "u" &&
                process.listenerCount &&
                process.listenerCount("uncaughtException")
              )
                process.emit("uncaughtException", c, "uncaughtException");
              else throw (console.error(c), c);
            }
          },
        },
        state: { wasReady: 0 },
      });
      g.setNavigationDelegate(C);
      var b = u.new({
        utils: {
          emit(c, m) {
            if (!m) {
              g.evaluateJavaScript_completionHandler(
                n.JS_BRIDGE_RESULT_SUCCESS + c + "()",
                null
              );
              return;
            }
            for (var S = [], s = 2; s < arguments.length; s += 1)
              S.push(arguments[s]);
            var p = i.webContents.listeners(m);
            Promise.all(
              p.map(function (v) {
                return Promise.resolve().then(function () {
                  return v.apply(v, S);
                });
              })
            )
              .then(function (v) {
                g.evaluateJavaScript_completionHandler(
                  n.JS_BRIDGE_RESULT_SUCCESS +
                    c +
                    "(" +
                    JSON.stringify(v) +
                    ")",
                  null
                );
              })
              .catch(function (v) {
                g.evaluateJavaScript_completionHandler(
                  n.JS_BRIDGE_RESULT_ERROR + c + "(" + JSON.stringify(v) + ")",
                  null
                );
              });
          },
          parseWebArguments: t,
        },
      });
      g.configuration()
        .userContentController()
        .addScriptMessageHandler_name(b, n.JS_BRIDGE);
      var d = {
        emit() {
          try {
            i.emit.apply(i, arguments);
          } catch (c) {
            if (
              typeof process < "u" &&
              process.listenerCount &&
              process.listenerCount("uncaughtException")
            )
              process.emit("uncaughtException", c, "uncaughtException");
            else throw (console.error(c), c);
          }
        },
      };
      if (a.modal) {
        var o;
        a.parent.type === "Document"
          ? (o = a.parent.sketchObject)
          : (o = a.parent),
          o && String(o.class()) === "MSDocumentData" && (o = o.delegate()),
          (d.parentWindow = o.windowForSheet());
      }
      var f = r.new({ utils: d, panel: h });
      h.setDelegate(f);
    }),
    setDelegates
  );
}
var lib, hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  var l = requireEvents(),
    t = requireBrowserApi(),
    n = requireWebviewApi(),
    r = requireFitSubview(),
    y = requireDispatchFirstClick(),
    u = requireInjectClientMessaging(),
    e = requireMovableArea(),
    i = requireExecuteJavascript(),
    h = requireSetDelegates();
  function g(a) {
    a = a || {};
    var N = a.identifier || String(NSUUID.UUID().UUIDString()),
      _ = NSThread.mainThread().threadDictionary(),
      R = g.fromId(N);
    if (R) return R;
    var C = new l();
    if (((C.id = N), a.modal && !a.parent))
      throw new Error("A modal needs to have a parent.");
    var b = coscript.createFiber(),
      d = a.width || 800,
      o = a.height || 600,
      f = NSScreen.screens().firstObject().frame(),
      c = NSMakeRect(
        typeof a.x < "u" ? a.x : Math.round((NSWidth(f) - d) / 2),
        typeof a.y < "u"
          ? NSHeight(f) - a.y
          : Math.round((NSHeight(f) - o) / 2),
        d,
        o
      );
    a.titleBarStyle && a.titleBarStyle !== "default" && (a.frame = !1);
    var m = a.windowType !== "textured",
      S = NSTitledWindowMask;
    a.minimizable !== !1 && (S |= NSMiniaturizableWindowMask),
      a.closable !== !1 && (S |= NSClosableWindowMask),
      a.resizable !== !1 && (S |= NSResizableWindowMask),
      (!m || a.transparent || a.frame === !1) &&
        (S |= NSTexturedBackgroundWindowMask);
    var s = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(
        c,
        S,
        NSBackingStoreBuffered,
        !0
      ),
      p = WKWebViewConfiguration.alloc().init(),
      v = WKWebView.alloc().initWithFrame_configuration(
        CGRectMake(0, 0, a.width || 800, a.height || 600),
        p
      );
    if (
      (u(v),
      v.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable),
      t(C, s, v),
      n(C, s, v),
      h(C, s, v, a),
      a.windowType === "desktop" &&
        (s.setLevel(kCGDesktopWindowLevel - 1),
        s.setCollectionBehavior(
          NSWindowCollectionBehaviorCanJoinAllSpaces |
            NSWindowCollectionBehaviorStationary |
            NSWindowCollectionBehaviorIgnoresCycle
        )),
      (typeof a.minWidth < "u" || typeof a.minHeight < "u") &&
        C.setMinimumSize(a.minWidth || 0, a.minHeight || 0),
      (typeof a.maxWidth < "u" || typeof a.maxHeight < "u") &&
        C.setMaximumSize(a.maxWidth || 1e4, a.maxHeight || 1e4),
      a.transparent || a.frame === !1)
    ) {
      (s.titlebarAppearsTransparent = !0),
        (s.titleVisibility = NSWindowTitleHidden),
        s.setOpaque(0),
        (s.isMovableByWindowBackground = !0);
      var M = NSToolbar.alloc().initWithIdentifier("titlebarStylingToolbar");
      M.setShowsBaselineSeparator(!1), s.setToolbar(M);
    }
    if (a.titleBarStyle === "hiddenInset") {
      var A = NSToolbar.alloc().initWithIdentifier("titlebarStylingToolbar");
      A.setShowsBaselineSeparator(!1), s.setToolbar(A);
    }
    (a.frame === !1 || !a.useContentSize) && C.setSize(d, o),
      a.center && C.center(),
      a.alwaysOnTop && C.setAlwaysOnTop(!0),
      a.fullscreen && C.setFullScreen(!0),
      C.setFullScreenable(!!a.fullscreenable);
    let w = a.title;
    a.frame === !1
      ? (w = void 0)
      : typeof w > "u" &&
        typeof __command < "u" &&
        __command.pluginBundle() &&
        (w = __command.pluginBundle().name()),
      w && C.setTitle(w);
    var L = a.backgroundColor;
    a.transparent && (L = NSColor.clearColor()),
      !L && a.frame === !1 && a.vibrancy && (L = NSColor.clearColor()),
      C._setBackgroundColor(L || NSColor.windowBackgroundColor()),
      a.hasShadow === !1 && C.setHasShadow(!1),
      typeof a.opacity < "u" && C.setOpacity(a.opacity),
      (a.webPreferences = a.webPreferences || {}),
      v
        .configuration()
        .preferences()
        .setValue_forKey(
          a.webPreferences.devTools !== !1,
          "developerExtrasEnabled"
        ),
      v
        .configuration()
        .preferences()
        .setValue_forKey(
          a.webPreferences.javascript !== !1,
          "javaScriptEnabled"
        ),
      v
        .configuration()
        .preferences()
        .setValue_forKey(!!a.webPreferences.plugins, "plugInsEnabled"),
      v
        .configuration()
        .preferences()
        .setValue_forKey(
          a.webPreferences.minimumFontSize || 0,
          "minimumFontSize"
        ),
      a.webPreferences.zoomFactor &&
        v.setMagnification(a.webPreferences.zoomFactor);
    var E = s.contentView();
    return (
      a.frame !== !1
        ? (v.setFrame(E.bounds()), E.addSubview(v))
        : (E.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable),
          r(E, E.superview()),
          v.setFrame(E.bounds()),
          E.addSubview(v),
          s.standardWindowButton(NSWindowFullScreenButton) &&
            s.standardWindowButton(NSWindowFullScreenButton).setHidden(!0),
          (!a.titleBarStyle || a.titleBarStyle === "default") &&
            (s.standardWindowButton(NSWindowZoomButton).setHidden(!0),
            s.standardWindowButton(NSWindowMiniaturizeButton).setHidden(!0),
            s.standardWindowButton(NSWindowCloseButton).setHidden(!0),
            s.standardWindowButton(NSWindowZoomButton).setEnabled(!1))),
      a.vibrancy && C.setVibrancy(a.vibrancy),
      C.setMaximizable(a.maximizable !== !1),
      s.setHidesOnDeactivate(a.hidesOnDeactivate !== !1),
      a.remembersWindowFrame &&
        (s.setFrameAutosaveName(N),
        s.setFrameUsingName_force(s.frameAutosaveName(), !1)),
      a.acceptsFirstMouse &&
        C.on("focus", function (k) {
          k.type() === NSEventTypeLeftMouseDown &&
            C.webContents.executeJavaScript(y(v, k)).catch(() => {});
        }),
      i.injectScript(v),
      e.injectScript(v),
      e.setupHandler(C),
      a.show !== !1 && C.show(),
      C.on("closed", function () {
        (C._destroyed = !0), _.removeObjectForKey(N);
        var k = _[N + ".themeObserver"];
        k &&
          (NSApplication.sharedApplication().removeObserver_forKeyPath(
            k,
            "effectiveAppearance"
          ),
          _.removeObjectForKey(N + ".themeObserver")),
          b.cleanup();
      }),
      (_[N] = s),
      b.onCleanup(function () {
        C._destroyed || C.destroy();
      }),
      C
    );
  }
  return (
    (g.fromId = function (a) {
      var N = NSThread.mainThread().threadDictionary();
      if (N[a]) return g.fromPanel(N[a], a);
    }),
    (g.fromPanel = function (a, N) {
      var _ = new l();
      if (((_.id = N), !a || !a.contentView))
        throw new Error("needs to pass an NSPanel");
      for (
        var R = null, C = a.contentView().subviews(), b = 0;
        b < C.length;
        b += 1
      )
        !R &&
          !C[b].isKindOfClass(WKInspectorWKWebView) &&
          C[b].isKindOfClass(WKWebView) &&
          (R = C[b]);
      if (!R) throw new Error("The panel needs to have a webview");
      return t(_, a, R), n(_, a, R), _;
    }),
    (lib = g),
    lib
  );
}
var libExports = requireLib();
const BrowserWindow = getDefaultExportFromCjs(libExports);
var remote = { exports: {} };
(function (l) {
  var t = NSThread.mainThread().threadDictionary();
  (l.exports.getWebview = function (n) {
    return requireLib().fromId(n);
  }),
    (l.exports.isWebviewPresent = function (r) {
      return !!t[r];
    }),
    (l.exports.sendToWebview = function (r, y) {
      if (l.exports.isWebviewPresent(r)) {
        for (
          var u = t[r], e = null, i = u.contentView().subviews(), h = 0;
          h < i.length;
          h += 1
        )
          !e &&
            !i[h].isKindOfClass(WKInspectorWKWebView) &&
            i[h].isKindOfClass(WKWebView) &&
            (e = i[h]);
        if (!e || !e.evaluateJavaScript_completionHandler)
          throw new Error("Webview " + r + " not found");
        e.evaluateJavaScript_completionHandler(y, null);
      }
    });
})(remote);
var remoteExports = remote.exports;
const version = "2.12.2",
  pack = { version },
  PREFUNIQUKEY = "cx.ap.sketch-find-and-replace.pref",
  SATEUNIQUKEY = "cx.ap.sketch-find-and-replace.state",
  defaultSettings = {
    findString: "",
    replaceString: "",
    document: !1,
    regexActive: !1,
    caseSensitive: !1,
    wholeWord: !1,
    count: 0,
  };
function escapeRegExp(l) {
  return l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function escapeReplaceString(l) {
  return l;
}
const debounce = (l, t) => {
  let n;
  return function () {
    const r = () => l.apply(this, arguments);
    clearTimeout(n), (n = setTimeout(r, t));
  };
};
function FindAndReplace(l) {
  let t = "";
  UI && UI.getTheme && (t = UI.getTheme()),
    t === "dark"
      ? (defaultSettings.darkMode = !0)
      : (defaultSettings.darkMode = !1);
  const n = Settings.settingForKey(SATEUNIQUKEY);
  let r = Object.assign({}, defaultSettings);
  if (typeof n == "string" && n == "Loaded") {
    Settings.setSettingForKey(SATEUNIQUKEY, "");
    const s = Settings.settingForKey(PREFUNIQUKEY);
    typeof s == "string" && typeof JSON.parse(s) == "object"
      ? (r = Object.assign({}, defaultSettings, JSON.parse(s)))
      : Settings.setSettingForKey(PREFUNIQUKEY, JSON.stringify({}));
  }
  Settings.setSettingForKey(SATEUNIQUKEY, "Loaded");
  let y = [],
    u = [];
  const e = Document.getSelectedDocument();
  let i = null;
  if (e) {
    const s = e.selectedLayers;
    (i = s.layers),
      s.length > 0
        ? (UI.message(
            "Find and replace in the selection (v" + pack.version + ")",
            e
          ),
          (r = Object.assign({}, r, { findMode: 1, selection: !0 })))
        : (UI.message(
            "Find and replace in the current page (v" + pack.version + ")",
            e
          ),
          (i = e.selectedPage.layers),
          (r = Object.assign({}, r, { findMode: 2, selection: !1 })));
  }
  const h = (s) => {
      const p = JSON.stringify(s, null, 1);
      Settings.setSettingForKey(PREFUNIQUKEY, p);
    },
    g = {
      identifier: "cx.ap.sketch-find-and-replace.webWiew",
      width: 460,
      height: 240,
      resizable: !1,
      alwaysOnTop: !0,
      fullscreenable: !1,
      title: "Find and Replace V3",
      acceptFirstMouse: !0,
      minimizable: !1,
      maximizable: !1,
    };
  let a = new BrowserWindow(g);
  a.on("closed", () => {
    a = null;
  });
  const C = l.plugin
    .url()
    .URLByAppendingPathComponent("Contents")
    .URLByAppendingPathComponent("Resources")
    .URLByAppendingPathComponent("resources/index.html");
  console.log("htmlUrl: " + C.absoluteString()), a.loadURL(C.absoluteString());
  let b = a.webContents;
  const d = (s) => {
      (r = s),
        UI.message(`${r.findString} replace by ${r.replaceString}`),
        (y = []),
        (u = []);
      const p = `g${r.caseSensitive == !0 ? "" : "i"}`,
        v = r.wholeWord ? "(?:\\^|\\b)" : "",
        M = r.wholeWord ? "(?=\\b|\\$)" : "",
        A = r.regexActive
          ? `${v}${r.findString}${M}`
          : `${v}(?:${escapeRegExp(r.findString)})${M}`,
        w = new RegExp(A, p),
        { findMode: L } = r;
      switch (L) {
        case 1:
          e && e.selectedLayers.length > 0 && (i = e.selectedLayers.layers);
          break;
        case 3:
          i = e.pages;
          break;
        default:
          i = e.selectedPage.layers;
      }
      (r = Object.assign({}, r, { regex: w })), m(i);
      const E = y.length + u.length;
      (r = Object.assign({}, r, { count: E })), c();
    },
    o = (s) => {
      const p = s.text.replace(r.regex, r.replaceString);
      (s.text = p), s.text != p && y.push(s);
    },
    f = (s) => {
      const p = s.value.replace(r.regex, r.replaceString);
      (s.value = p), s.value != p && u.push(s);
    },
    c = (s) => {
      s && (r = Object.assign({}, r, { init: s })),
        remoteExports.isWebviewPresent(g.identifier),
        (r = Object.assign({}, r, { init: !1 }));
    },
    m = (s) => {
      const { findMode: p } = r;
      s.forEach((v) => {
        switch (v.type) {
          case "Artboard":
            v.layers && v.layers.length > 0 && m(v.layers);
            break;
          case "Group":
            v.layers && m(v.layers);
            break;
          case "Text":
            o(v);
            break;
          case "ShapePath":
            break;
          case "Shape":
            break;
          case "SymbolMaster":
            (p === 1 || e.selectedPage.name === "Symbols") && m(v.layers);
            break;
          case "SymbolInstance":
            v.overrides && S(v.overrides);
            break;
          case "Image":
            break;
          default:
            v.layers && m(v.layers);
        }
      });
    },
    S = (s) => {
      s.forEach((p) => {
        switch (p.affectedLayer.type) {
          case "Text":
            p.editable && p.property == "stringValue" && f(p);
            break;
        }
      });
    };
  b.once("did-finish-load", () => {
    c(!0);
  }),
    b.once("close", () => {
      a.close();
    }),
    b.on("message", (s) => {
      UI.message(s);
    }),
    b.on("resetPref", () => {
      Settings.setSettingForKey(SATEUNIQUKEY, ""),
        Settings.setSettingForKey(PREFUNIQUKEY, JSON.stringify({})),
        UI.message("Reset Preference Settings 🖖! Done");
    }),
    b.on("setDarkMode", (s) => {
      (r = Object.assign({}, r, { darkMode: s })),
        h(r),
        UI.message(`Set darkMode ${s ? "on 🌙" : "off 😎"}!`);
    }),
    b.on(
      "find",
      debounce((s) => {
        Object.assign({}, JSON.parse(s)).findString != r.findString;
      }, 100)
    ),
    b.on(
      "replace",
      debounce((s) => {
        const p = Object.assign({}, JSON.parse(s));
        d(p), h(r), a.close();
      }, 100)
    ),
    b.on(
      "selection",
      debounce((s) => {
        r = Object.assign({}, JSON.parse(s));
        const { findMode: p } = r;
        e &&
          ((i = e.selectedLayers),
          i.length > 0 && p == 1
            ? (UI.message("Find and replace in the selection"),
              (r = Object.assign({}, r, { findMode: 1, selection: !0 })))
            : (UI.message("Find and replace in the current page"),
              (i = e.selectedPage.layers),
              (r = Object.assign({}, r, { findMode: 2, selection: !1 })))),
          h(r),
          c(!1);
      }, 100)
    );
}
globalThis["onRun"] = FindAndReplace;
