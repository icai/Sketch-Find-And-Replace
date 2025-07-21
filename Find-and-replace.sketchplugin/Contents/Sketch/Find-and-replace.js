const events = require("events");
const UI = require("sketch/ui");
const Settings = require("sketch/settings");
const Document = require("sketch/dom");
function parseHexColor(color) {
  if (!color || color[0] !== "#") {
    if (color && typeof color.isKindOfClass === "function" && color.isKindOfClass(NSColor)) {
      return color;
    }
    throw new Error(
      "Incorrect color formating. It should be an hex color: #RRGGBBAA"
    );
  }
  var source = color.substr(1);
  if (source.length === 3) {
    source += "F";
  } else if (source.length === 6) {
    source += "FF";
  }
  var hex;
  if (source.length === 4) {
    for (var i = 0; i < 4; i += 1) {
      hex += source[i];
      hex += source[i];
    }
  } else if (source.length === 8) {
    hex = source;
  } else {
    return NSColor.whiteColor();
  }
  var r = parseInt(hex.slice(0, 2), 16) / 255;
  var g = parseInt(hex.slice(2, 4), 16) / 255;
  var b = parseInt(hex.slice(4, 6), 16) / 255;
  var a = parseInt(hex.slice(6, 8), 16) / 255;
  return NSColor.colorWithSRGBRed_green_blue_alpha(r, g, b, a);
}
function buildBrowserAPI(browserWindow, panel, webview) {
  browserWindow._panel = panel;
  browserWindow._webview = webview;
  browserWindow._destroyed = false;
  browserWindow.destroy = function() {
    return panel.close();
  };
  browserWindow.close = function() {
    if (panel.delegate().utils && panel.delegate().utils.parentWindow) {
      var shouldClose = true;
      browserWindow.emit("close", {
        get defaultPrevented() {
          return !shouldClose;
        },
        preventDefault: function() {
          shouldClose = false;
        }
      });
      if (shouldClose) {
        panel.delegate().utils.parentWindow.endSheet(panel);
      }
      return;
    }
    if (!browserWindow.isClosable()) {
      return;
    }
    panel.performClose(null);
  };
  function focus(focused) {
    if (!browserWindow.isVisible()) {
      return;
    }
    if (focused) {
      NSApplication.sharedApplication().activateIgnoringOtherApps(true);
      panel.makeKeyAndOrderFront(null);
    } else {
      panel.orderBack(null);
      NSApp.mainWindow().makeKeyAndOrderFront(null);
    }
  }
  browserWindow.focus = focus.bind(this, true);
  browserWindow.blur = focus.bind(this, false);
  browserWindow.isFocused = function() {
    return panel.isKeyWindow();
  };
  browserWindow.isDestroyed = function() {
    return browserWindow._destroyed;
  };
  browserWindow.show = function() {
    NSApp.activateIgnoringOtherApps(true);
    if (panel.delegate().utils && panel.delegate().utils.parentWindow) {
      return panel.delegate().utils.parentWindow.beginSheet_completionHandler(
        panel,
        __mocha__.createBlock_function("v16@?0q8", function() {
          browserWindow.emit("closed");
        })
      );
    }
    return panel.makeKeyAndOrderFront(null);
  };
  browserWindow.showInactive = function() {
    return panel.orderFrontRegardless();
  };
  browserWindow.hide = function() {
    return panel.orderOut(null);
  };
  browserWindow.isVisible = function() {
    return panel.isVisible();
  };
  browserWindow.isModal = function() {
    return false;
  };
  browserWindow.maximize = function() {
    if (!browserWindow.isMaximized()) {
      panel.zoom(null);
    }
  };
  browserWindow.unmaximize = function() {
    if (browserWindow.isMaximized()) {
      panel.zoom(null);
    }
  };
  browserWindow.isMaximized = function() {
    if ((panel.styleMask() & NSResizableWindowMask) !== 0) {
      return panel.isZoomed();
    }
    var rectScreen = NSScreen.mainScreen().visibleFrame();
    var rectWindow = panel.frame();
    return rectScreen.origin.x == rectWindow.origin.x && rectScreen.origin.y == rectWindow.origin.y && rectScreen.size.width == rectWindow.size.width && rectScreen.size.height == rectWindow.size.height;
  };
  browserWindow.minimize = function() {
    return panel.miniaturize(null);
  };
  browserWindow.restore = function() {
    return panel.deminiaturize(null);
  };
  browserWindow.isMinimized = function() {
    return panel.isMiniaturized();
  };
  browserWindow.setFullScreen = function(fullscreen) {
    if (fullscreen !== browserWindow.isFullscreen()) {
      panel.toggleFullScreen(null);
    }
  };
  browserWindow.isFullscreen = function() {
    return panel.styleMask() & NSFullScreenWindowMask;
  };
  browserWindow.setAspectRatio = function(aspectRatio) {
    if (aspectRatio > 0) {
      panel.setAspectRatio(NSMakeSize(aspectRatio, 1));
    } else {
      panel.setResizeIncrements(NSMakeSize(1, 1));
    }
  };
  browserWindow.setBounds = function(bounds, animate) {
    if (!bounds) {
      return;
    }
    if (browserWindow.isFullscreen()) {
      return;
    }
    const newBounds = Object.assign(browserWindow.getBounds(), bounds);
    var cocoaBounds = NSMakeRect(
      newBounds.x,
      0,
      newBounds.width,
      newBounds.height
    );
    var screen = NSScreen.screens().firstObject();
    cocoaBounds.origin.y = NSHeight(screen.frame()) - newBounds.y;
    panel.setFrame_display_animate(cocoaBounds, true, animate);
  };
  browserWindow.getBounds = function() {
    const cocoaBounds = panel.frame();
    var mainScreenRect = NSScreen.screens().firstObject().frame();
    return {
      x: cocoaBounds.origin.x,
      y: Math.round(NSHeight(mainScreenRect) - cocoaBounds.origin.y),
      width: cocoaBounds.size.width,
      height: cocoaBounds.size.height
    };
  };
  browserWindow.setContentBounds = function(bounds, animate) {
    browserWindow.setBounds(bounds, animate);
  };
  browserWindow.getContentBounds = function() {
    return browserWindow.getBounds();
  };
  browserWindow.setSize = function(width, height, animate) {
    return browserWindow.setBounds({ width, height }, animate);
  };
  browserWindow.getSize = function() {
    var bounds = browserWindow.getBounds();
    return [bounds.width, bounds.height];
  };
  browserWindow.setContentSize = function(width, height, animate) {
    return browserWindow.setContentBounds(
      { width, height },
      animate
    );
  };
  browserWindow.getContentSize = function() {
    var bounds = browserWindow.getContentBounds();
    return [bounds.width, bounds.height];
  };
  browserWindow.setMinimumSize = function(width, height) {
    const minSize = CGSizeMake(width, height);
    panel.setContentMinSize(minSize);
  };
  browserWindow.getMinimumSize = function() {
    const size = panel.contentMinSize();
    return [size.width, size.height];
  };
  browserWindow.setMaximumSize = function(width, height) {
    const maxSize = CGSizeMake(width, height);
    panel.setContentMaxSize(maxSize);
  };
  browserWindow.getMaximumSize = function() {
    const size = panel.contentMaxSize();
    return [size.width, size.height];
  };
  browserWindow.setResizable = function(resizable) {
    return browserWindow._setStyleMask(resizable, NSResizableWindowMask);
  };
  browserWindow.isResizable = function() {
    return panel.styleMask() & NSResizableWindowMask;
  };
  browserWindow.setMovable = function(movable) {
    return panel.setMovable(movable);
  };
  browserWindow.isMovable = function() {
    return panel.isMovable();
  };
  browserWindow.setMinimizable = function(minimizable) {
    return browserWindow._setStyleMask(minimizable, NSMiniaturizableWindowMask);
  };
  browserWindow.isMinimizable = function() {
    return panel.styleMask() & NSMiniaturizableWindowMask;
  };
  browserWindow.setMaximizable = function(maximizable) {
    if (panel.standardWindowButton(NSWindowZoomButton)) {
      panel.standardWindowButton(NSWindowZoomButton).setEnabled(maximizable);
    }
  };
  browserWindow.isMaximizable = function() {
    return panel.standardWindowButton(NSWindowZoomButton) && panel.standardWindowButton(NSWindowZoomButton).isEnabled();
  };
  browserWindow.setFullScreenable = function(fullscreenable) {
    browserWindow._setCollectionBehavior(
      fullscreenable,
      NSWindowCollectionBehaviorFullScreenPrimary
    );
    browserWindow._setCollectionBehavior(
      !fullscreenable,
      NSWindowCollectionBehaviorFullScreenAuxiliary
    );
  };
  browserWindow.isFullScreenable = function() {
    var collectionBehavior = panel.collectionBehavior();
    return collectionBehavior & NSWindowCollectionBehaviorFullScreenPrimary;
  };
  browserWindow.setClosable = function(closable) {
    browserWindow._setStyleMask(closable, NSClosableWindowMask);
  };
  browserWindow.isClosable = function() {
    return panel.styleMask() & NSClosableWindowMask;
  };
  browserWindow.setAlwaysOnTop = function(top, level, relativeLevel) {
    var windowLevel = NSNormalWindowLevel;
    var maxWindowLevel = CGWindowLevelForKey(kCGMaximumWindowLevelKey);
    var minWindowLevel = CGWindowLevelForKey(kCGMinimumWindowLevelKey);
    if (top) {
      if (level === "normal") {
        windowLevel = NSNormalWindowLevel;
      } else if (level === "torn-off-menu") {
        windowLevel = NSTornOffMenuWindowLevel;
      } else if (level === "modal-panel") {
        windowLevel = NSModalPanelWindowLevel;
      } else if (level === "main-menu") {
        windowLevel = NSMainMenuWindowLevel;
      } else if (level === "status") {
        windowLevel = NSStatusWindowLevel;
      } else if (level === "pop-up-menu") {
        windowLevel = NSPopUpMenuWindowLevel;
      } else if (level === "screen-saver") {
        windowLevel = NSScreenSaverWindowLevel;
      } else if (level === "dock") {
        windowLevel = NSDockWindowLevel;
      } else {
        windowLevel = NSFloatingWindowLevel;
      }
    }
    var newLevel = windowLevel + (relativeLevel || 0);
    if (newLevel >= minWindowLevel && newLevel <= maxWindowLevel) {
      panel.setLevel(newLevel);
    } else {
      throw new Error(
        "relativeLevel must be between " + minWindowLevel + " and " + maxWindowLevel
      );
    }
  };
  browserWindow.isAlwaysOnTop = function() {
    return panel.level() !== NSNormalWindowLevel;
  };
  browserWindow.moveTop = function() {
    return panel.orderFrontRegardless();
  };
  browserWindow.center = function() {
    panel.center();
  };
  browserWindow.setPosition = function(x, y, animate) {
    return browserWindow.setBounds({ x, y }, animate);
  };
  browserWindow.getPosition = function() {
    var bounds = browserWindow.getBounds();
    return [bounds.x, bounds.y];
  };
  browserWindow.setTitle = function(title) {
    panel.setTitle(title);
  };
  browserWindow.getTitle = function() {
    return String(panel.title());
  };
  var attentionRequestId = 0;
  browserWindow.flashFrame = function(flash) {
    if (flash) {
      attentionRequestId = NSApp.requestUserAttention(NSInformationalRequest);
    } else {
      NSApp.cancelUserAttentionRequest(attentionRequestId);
      attentionRequestId = 0;
    }
  };
  browserWindow.getNativeWindowHandle = function() {
    return panel;
  };
  browserWindow.getNativeWebViewHandle = function() {
    return webview;
  };
  browserWindow.loadURL = function(url) {
    if (/^(?!https?|file).*\.html?$/.test(url)) {
      if (typeof __command !== "undefined" && __command.pluginBundle()) {
        url = "file://" + __command.pluginBundle().urlForResourceNamed(url).path();
      }
    }
    if (/^file:\/\/.*\.html?$/.test(url)) {
      url = NSString.alloc().initWithString(url);
      url = url.stringByAddingPercentEncodingWithAllowedCharacters(
        NSCharacterSet.URLQueryAllowedCharacterSet()
      );
      webview.loadFileURL_allowingReadAccessToURL(
        NSURL.URLWithString(url),
        NSURL.URLWithString("file:///")
      );
      return;
    }
    const properURL = NSURL.URLWithString(url);
    const urlRequest = NSURLRequest.requestWithURL(properURL);
    webview.loadRequest(urlRequest);
  };
  browserWindow.reload = function() {
    webview.reload();
  };
  browserWindow.setHasShadow = function(hasShadow) {
    return panel.setHasShadow(hasShadow);
  };
  browserWindow.hasShadow = function() {
    return panel.hasShadow();
  };
  browserWindow.setOpacity = function(opacity) {
    return panel.setAlphaValue(opacity);
  };
  browserWindow.getOpacity = function() {
    return panel.alphaValue();
  };
  browserWindow.setVisibleOnAllWorkspaces = function(visible) {
    return browserWindow._setCollectionBehavior(
      visible,
      NSWindowCollectionBehaviorCanJoinAllSpaces
    );
  };
  browserWindow.isVisibleOnAllWorkspaces = function() {
    var collectionBehavior = panel.collectionBehavior();
    return collectionBehavior & NSWindowCollectionBehaviorCanJoinAllSpaces;
  };
  browserWindow.setIgnoreMouseEvents = function(ignore) {
    return panel.setIgnoresMouseEvents(ignore);
  };
  browserWindow.setContentProtection = function(enable) {
    panel.setSharingType(enable ? NSWindowSharingNone : NSWindowSharingReadOnly);
  };
  browserWindow.setAutoHideCursor = function(autoHide) {
    panel.setDisableAutoHideCursor(autoHide);
  };
  browserWindow.setVibrancy = function(type) {
    var effectView = browserWindow._vibrantView;
    if (!type) {
      if (effectView == null) {
        return;
      }
      effectView.removeFromSuperview();
      panel.setVibrantView(null);
      return;
    }
    if (effectView == null) {
      var contentView = panel.contentView();
      effectView = NSVisualEffectView.alloc().initWithFrame(
        contentView.bounds()
      );
      browserWindow._vibrantView = effectView;
      effectView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
      effectView.setBlendingMode(NSVisualEffectBlendingModeBehindWindow);
      effectView.setState(NSVisualEffectStateActive);
      effectView.setFrame(contentView.bounds());
      contentView.addSubview_positioned_relativeTo(
        effectView,
        NSWindowBelow,
        null
      );
    }
    var vibrancyType = NSVisualEffectMaterialLight;
    if (type === "appearance-based") {
      vibrancyType = NSVisualEffectMaterialAppearanceBased;
    } else if (type === "light") {
      vibrancyType = NSVisualEffectMaterialLight;
    } else if (type === "dark") {
      vibrancyType = NSVisualEffectMaterialDark;
    } else if (type === "titlebar") {
      vibrancyType = NSVisualEffectMaterialTitlebar;
    } else if (type === "selection") {
      vibrancyType = NSVisualEffectMaterialSelection;
    } else if (type === "menu") {
      vibrancyType = NSVisualEffectMaterialMenu;
    } else if (type === "popover") {
      vibrancyType = NSVisualEffectMaterialPopover;
    } else if (type === "sidebar") {
      vibrancyType = NSVisualEffectMaterialSidebar;
    } else if (type === "medium-light") {
      vibrancyType = NSVisualEffectMaterialMediumLight;
    } else if (type === "ultra-dark") {
      vibrancyType = NSVisualEffectMaterialUltraDark;
    }
    effectView.setMaterial(vibrancyType);
  };
  browserWindow._setBackgroundColor = function(colorName) {
    var color = parseHexColor(colorName);
    webview.setValue_forKey(false, "drawsBackground");
    panel.backgroundColor = color;
  };
  browserWindow._invalidate = function() {
    panel.flushWindow();
    panel.contentView().setNeedsDisplay(true);
  };
  browserWindow._setStyleMask = function(on, flag) {
    var wasMaximizable = browserWindow.isMaximizable();
    if (on) {
      panel.setStyleMask(panel.styleMask() | flag);
    } else {
      panel.setStyleMask(panel.styleMask() & ~flag);
    }
    browserWindow.setMaximizable(wasMaximizable);
  };
  browserWindow._setCollectionBehavior = function(on, flag) {
    var wasMaximizable = browserWindow.isMaximizable();
    if (on) {
      panel.setCollectionBehavior(panel.collectionBehavior() | flag);
    } else {
      panel.setCollectionBehavior(panel.collectionBehavior() & ~flag);
    }
    browserWindow.setMaximizable(wasMaximizable);
  };
  browserWindow._showWindowButton = function(button) {
    var view = panel.standardWindowButton(button);
    view.superview().addSubview_positioned_relative(view, NSWindowAbove, null);
  };
}
const CONSTANTS = {
  JS_BRIDGE: "__skpm_sketchBridge",
  JS_BRIDGE_RESULT_SUCCESS: "__skpm_sketchBridge_success",
  JS_BRIDGE_RESULT_ERROR: "__skpm_sketchBridge_error",
  START_MOVING_WINDOW: "__skpm_startMovingWindow",
  EXECUTE_JAVASCRIPT: "__skpm_executeJS",
  EXECUTE_JAVASCRIPT_SUCCESS: "__skpm_executeJS_success_",
  EXECUTE_JAVASCRIPT_ERROR: "__skpm_executeJS_error_"
};
function executeJavaScript(webview, browserWindow) {
  function executeJavaScript2(script, userGesture, callback) {
    if (typeof userGesture === "function") {
      callback = userGesture;
      userGesture = false;
    }
    var fiber = coscript.createFiber();
    if (webview.navigationDelegate().state && webview.navigationDelegate().state.wasReady == 0) {
      return new Promise(function(resolve, reject) {
        browserWindow.once("ready-to-show", function() {
          executeJavaScript2(script, userGesture, callback).then(resolve).catch(reject);
          fiber.cleanup();
        });
      });
    }
    return new Promise(function(resolve, reject) {
      var requestId = Math.random();
      browserWindow.webContents.on(
        CONSTANTS.EXECUTE_JAVASCRIPT_SUCCESS + requestId,
        function(res) {
          try {
            if (callback) {
              callback(null, res);
            }
            resolve(res);
          } catch (err) {
            reject(err);
          }
          fiber.cleanup();
        }
      );
      browserWindow.webContents.on(
        CONSTANTS.EXECUTE_JAVASCRIPT_ERROR + requestId,
        function(err) {
          try {
            if (callback) {
              callback(err);
              resolve();
            } else {
              reject(err);
            }
          } catch (err2) {
            reject(err2);
          }
          fiber.cleanup();
        }
      );
      webview.evaluateJavaScript_completionHandler(
        wrapScript(script, requestId),
        null
      );
    });
  }
  return executeJavaScript2;
}
const wrapScript = function(script, requestId) {
  return "window." + CONSTANTS.EXECUTE_JAVASCRIPT + "(" + requestId + ", " + JSON.stringify(script) + ")";
};
const injectScript$1 = function(webView) {
  var source = "window." + CONSTANTS.EXECUTE_JAVASCRIPT + ' = function(id, script) {  try {    var res = eval(script);    if (res && typeof res.then === "function" && typeof res.catch === "function") {      res.then(function (res2) {        window.postMessage("' + CONSTANTS.EXECUTE_JAVASCRIPT_SUCCESS + '" + id, res2);      })      .catch(function (err) {        window.postMessage("' + CONSTANTS.EXECUTE_JAVASCRIPT_ERROR + '" + id, err);      })    } else {      window.postMessage("' + CONSTANTS.EXECUTE_JAVASCRIPT_SUCCESS + '" + id, res);    }  } catch (err) {    window.postMessage("' + CONSTANTS.EXECUTE_JAVASCRIPT_ERROR + '" + id, err);  }}';
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  );
  webView.configuration().userContentController().addUserScript(script);
};
function buildAPI(browserWindow, panel, webview) {
  var webContents = new events.EventEmitter();
  webContents.loadURL = browserWindow.loadURL;
  webContents.loadFile = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.downloadURL = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.getURL = function() {
    return String(webview.URL());
  };
  webContents.getTitle = function() {
    return String(webview.title());
  };
  webContents.isDestroyed = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.focus = browserWindow.focus;
  webContents.isFocused = browserWindow.isFocused;
  webContents.isLoading = function() {
    return !!webview.loading();
  };
  webContents.isLoadingMainFrame = function() {
    return !!webview.loading();
  };
  webContents.isWaitingForResponse = function() {
    return !webview.loading();
  };
  webContents.stop = function() {
    webview.stopLoading();
  };
  webContents.reload = function() {
    webview.reload();
  };
  webContents.reloadIgnoringCache = function() {
    webview.reloadFromOrigin();
  };
  webContents.canGoBack = function() {
    return !!webview.canGoBack();
  };
  webContents.canGoForward = function() {
    return !!webview.canGoForward();
  };
  webContents.canGoToOffset = function(offset) {
    return !!webview.backForwardList().itemAtIndex(offset);
  };
  webContents.clearHistory = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.goBack = function() {
    webview.goBack();
  };
  webContents.goForward = function() {
    webview.goForward();
  };
  webContents.goToIndex = function(index) {
    var backForwardList = webview.backForwardList();
    var backList = backForwardList.backList();
    var backListLength = backList.count();
    if (backListLength > index) {
      webview.loadRequest(NSURLRequest.requestWithURL(backList[index]));
      return;
    }
    var forwardList = backForwardList.forwardList();
    if (forwardList.count() > index - backListLength) {
      webview.loadRequest(
        NSURLRequest.requestWithURL(forwardList[index - backListLength])
      );
      return;
    }
    throw new Error("Cannot go to index " + index);
  };
  webContents.goToOffset = function(offset) {
    if (!webContents.canGoToOffset(offset)) {
      throw new Error("Cannot go to offset " + offset);
    }
    webview.loadRequest(
      NSURLRequest.requestWithURL(webview.backForwardList().itemAtIndex(offset))
    );
  };
  webContents.isCrashed = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.setUserAgent = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.getUserAgent = function() {
    const userAgent = webview.customUserAgent();
    return userAgent ? String(userAgent) : void 0;
  };
  webContents.insertCSS = function(css) {
    var source = "var style = document.createElement('style'); style.innerHTML = " + css.replace(/"/, '\\"') + "; document.head.appendChild(style);";
    var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
      source,
      0,
      true
    );
    webview.configuration().userContentController().addUserScript(script);
  };
  webContents.insertJS = function(source) {
    var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
      source,
      0,
      true
    );
    webview.configuration().userContentController().addUserScript(script);
  };
  webContents.executeJavaScript = executeJavaScript(webview, browserWindow);
  webContents.setIgnoreMenuShortcuts = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.setAudioMuted = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.isAudioMuted = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.setZoomFactor = function(factor) {
    webview.setMagnification_centeredAtPoint(factor, CGPointMake(0, 0));
  };
  webContents.getZoomFactor = function(callback) {
    callback(Number(webview.magnification()));
  };
  webContents.setZoomLevel = function(level) {
    webContents.setZoomFactor(Math.pow(1.2, level));
  };
  webContents.getZoomLevel = function(callback) {
    callback(Math.log(Number(webview.magnification())) / Math.log(1.2));
  };
  webContents.setVisualZoomLevelLimits = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.setLayoutZoomLevelLimits = function() {
    console.warn(
      "Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)"
    );
  };
  webContents.send = function() {
    const script = "window.postMessage({isSketchMessage: true,origin: '" + String(__command.identifier()) + "',args: " + JSON.stringify([].slice.call(arguments)) + '}, "*")';
    webview.evaluateJavaScript_completionHandler(script, null);
  };
  webContents.getNativeWebview = function() {
    return webview;
  };
  browserWindow.webContents = webContents;
}
function addEdgeConstraint(edge, subview, view, constant) {
  view.addConstraint(
    NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(
      subview,
      edge,
      NSLayoutRelationEqual,
      view,
      edge,
      1,
      constant
    )
  );
}
function fitSubviewToView(subview, view, constants) {
  constants = constants || [];
  subview.setTranslatesAutoresizingMaskIntoConstraints(false);
  addEdgeConstraint(NSLayoutAttributeLeft, subview, view, constants[0] || 0);
  addEdgeConstraint(NSLayoutAttributeTop, subview, view, constants[1] || 0);
  addEdgeConstraint(NSLayoutAttributeRight, subview, view, constants[2] || 0);
  addEdgeConstraint(NSLayoutAttributeBottom, subview, view, constants[3] || 0);
}
var tagsToFocus = '["text", "textarea", "date", "datetime-local", "email", "number", "month", "password", "search", "tel", "time", "url", "week" ]';
function dispatchFirstClick(webView, event) {
  var point = webView.convertPoint_fromView(event.locationInWindow(), null);
  return "var el = document.elementFromPoint(" + // get the DOM element that match the event
  point.x + ", " + point.y + '); if (el && el.tagName === "SELECT") {  var event = document.createEvent("MouseEvents");  event.initMouseEvent("mousedown", true, true, window);  el.dispatchEvent(event);} else if (el && ' + // some tags need to be focused instead of clicked
  tagsToFocus + '.indexOf(el.type) >= 0 && el.focus) {el.focus();} else if (el) {el.dispatchEvent(new Event("click", {bubbles: true}))}';
}
function injectClientMessaging(webView) {
  var source = `window.originalPostMessage = window.postMessage;window.postMessage = function(actionName) {  if (!actionName) {    throw new Error('missing action name')  }  var id = String(Math.random()).replace(".", "");    var args = [].slice.call(arguments);    args.unshift(id);  return new Promise(function (resolve, reject) {    window["` + CONSTANTS.JS_BRIDGE_RESULT_SUCCESS + '" + id] = resolve;    window["' + CONSTANTS.JS_BRIDGE_RESULT_ERROR + '" + id] = reject;    window.webkit.messageHandlers.' + CONSTANTS.JS_BRIDGE + ".postMessage(JSON.stringify(args));  });}";
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  );
  webView.configuration().userContentController().addUserScript(script);
}
const injectScript = function(webView) {
  var source = `(function () {document.addEventListener('mousedown', onMouseDown);function shouldDrag(target) {  if (!target || (target.dataset || {}).appRegion === "no-drag") { return false }  if ((target.dataset || {}).appRegion === "drag") { return true }  return shouldDrag(target.parentElement)};function onMouseDown(e) {  if (e.button !== 0 || !shouldDrag(e.target)) { return }  window.postMessage("` + CONSTANTS.START_MOVING_WINDOW + '");};})()';
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  );
  webView.configuration().userContentController().addUserScript(script);
};
const setupHandler = function(browserWindow) {
  var initialMouseLocation = null;
  var initialWindowPosition = null;
  var interval = null;
  function moveWindow() {
    if (!initialWindowPosition || NSEvent.pressedMouseButtons() !== 1) {
      clearInterval(interval);
      initialMouseLocation = null;
      initialWindowPosition = null;
      return;
    }
    var mouse = NSEvent.mouseLocation();
    browserWindow.setPosition(
      initialWindowPosition.x + (mouse.x - initialMouseLocation.x),
      initialWindowPosition.y + (initialMouseLocation.y - mouse.y),
      // y is inverted
      false
    );
  }
  browserWindow.webContents.on(CONSTANTS.START_MOVING_WINDOW, function() {
    initialMouseLocation = NSEvent.mouseLocation();
    var position = browserWindow.getPosition();
    initialWindowPosition = {
      x: position[0],
      y: position[1]
    };
    interval = setInterval(moveWindow, 1e3 / 60);
  });
};
function MochaDelegate(definition, superclass) {
  var uniqueClassName = "MochaJSDelegate_DynamicClass_" + NSUUID.UUID().UUIDString();
  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(
    uniqueClassName,
    superclass || NSObject
  );
  var handlers = {};
  var ivars = {};
  function setHandlerForSelector(selectorString, func) {
    var handlerHasBeenSet = selectorString in handlers;
    var selector = NSSelectorFromString(selectorString);
    handlers[selectorString] = func;
    if (!handlerHasBeenSet) {
      var args = [];
      var regex = /:/g;
      while (regex.exec(selectorString)) {
        args.push("arg" + args.length);
      }
      var dynamicFunction = eval(
        "(function (" + args.join(", ") + ") { return handlers[selectorString].apply(this, arguments); })"
      );
      delegateClassDesc.addInstanceMethodWithSelector_function(
        selector,
        dynamicFunction
      );
    }
  }
  function setIvar(key, value) {
    var ivarHasBeenSet = key in handlers;
    ivars[key] = value;
    if (!ivarHasBeenSet) {
      delegateClassDesc.addInstanceVariableWithName_typeEncoding(key, "@");
      var description = MOPropertyDescription.new();
      description.name = key;
      description.typeEncoding = "@";
      description.weak = true;
      description.ivarName = key;
      delegateClassDesc.addProperty(description);
    }
  }
  this.getClass = function() {
    return NSClassFromString(uniqueClassName);
  };
  this.getClassInstance = function(instanceVariables) {
    var instance = NSClassFromString(uniqueClassName).new();
    Object.keys(ivars).forEach(function(key) {
      instance[key] = ivars[key];
    });
    Object.keys(instanceVariables || {}).forEach(function(key) {
      instance[key] = instanceVariables[key];
    });
    return instance;
  };
  this.new = this.getClassInstance;
  if (typeof definition === "object") {
    Object.keys(definition).forEach(
      function(key) {
        if (typeof definition[key] === "function") {
          setHandlerForSelector(key, definition[key]);
        } else {
          setIvar(key, definition[key]);
        }
      }
    );
  }
  delegateClassDesc.registerClass();
}
function parseWebArguments(webArguments) {
  var args2 = null;
  try {
    args2 = JSON.parse(webArguments);
  } catch (e) {
  }
  if (!args2 || !args2.constructor || args2.constructor !== Array || args2.length == 0) {
    return null;
  }
  return args2;
}
var WindowDelegateClass;
var NavigationDelegateClass;
var WebScriptHandlerClass;
var ThemeObserverClass;
function setDelegates(browserWindow, panel, webview, options) {
  if (!ThemeObserverClass) {
    ThemeObserverClass = new MochaDelegate({
      utils: null,
      "observeValueForKeyPath:ofObject:change:context:": function(keyPath, object, change) {
        const newAppearance = change[NSKeyValueChangeNewKey];
        const isDark = String(
          newAppearance.bestMatchFromAppearancesWithNames([
            "NSAppearanceNameAqua",
            "NSAppearanceNameDarkAqua"
          ])
        ) === "NSAppearanceNameDarkAqua";
        this.utils.executeJavaScript(
          "document.body.classList.remove('__skpm-" + (isDark ? "light" : "dark") + "'); document.body.classList.add('__skpm-" + (isDark ? "dark" : "light") + "')"
        );
      }
    });
  }
  if (!WindowDelegateClass) {
    WindowDelegateClass = new MochaDelegate({
      utils: null,
      panel: null,
      "windowDidResize:": function() {
        this.utils.emit("resize");
      },
      "windowDidMiniaturize:": function() {
        this.utils.emit("minimize");
      },
      "windowDidDeminiaturize:": function() {
        this.utils.emit("restore");
      },
      "windowDidEnterFullScreen:": function() {
        this.utils.emit("enter-full-screen");
      },
      "windowDidExitFullScreen:": function() {
        this.utils.emit("leave-full-screen");
      },
      "windowDidMove:": function() {
        this.utils.emit("move");
        this.utils.emit("moved");
      },
      "windowShouldClose:": function() {
        var shouldClose = 1;
        this.utils.emit("close", {
          get defaultPrevented() {
            return !shouldClose;
          },
          preventDefault: function() {
            shouldClose = 0;
          }
        });
        return shouldClose;
      },
      "windowWillClose:": function() {
        this.utils.emit("closed");
      },
      "windowDidBecomeKey:": function() {
        this.utils.emit("focus", this.panel.currentEvent());
      },
      "windowDidResignKey:": function() {
        this.utils.emit("blur");
      }
    });
  }
  if (!NavigationDelegateClass) {
    NavigationDelegateClass = new MochaDelegate({
      state: {
        wasReady: 0
      },
      utils: null,
      // // Called when the web view begins to receive web content.
      "webView:didCommitNavigation:": function(webView) {
        this.utils.emit("will-navigate", {}, String(String(webView.URL())));
      },
      // // Called when web content begins to load in a web view.
      "webView:didStartProvisionalNavigation:": function() {
        this.utils.emit("did-start-navigation");
        this.utils.emit("did-start-loading");
      },
      // Called when a web view receives a server redirect.
      "webView:didReceiveServerRedirectForProvisionalNavigation:": function() {
        this.utils.emit("did-get-redirect-request");
      },
      // // Called when the web view needs to respond to an authentication challenge.
      // 'webView:didReceiveAuthenticationChallenge:completionHandler:': function(
      //   webView,
      //   challenge,
      //   completionHandler
      // ) {
      //   function callback(username, password) {
      //     completionHandler(
      //       0,
      //       NSURLCredential.credentialWithUser_password_persistence(
      //         username,
      //         password,
      //         1
      //       )
      //     )
      //   }
      //   var protectionSpace = challenge.protectionSpace()
      //   this.utils.emit(
      //     'login',
      //     {},
      //     {
      //       method: String(protectionSpace.authenticationMethod()),
      //       url: 'not implemented', // TODO:
      //       referrer: 'not implemented', // TODO:
      //     },
      //     {
      //       isProxy: !!protectionSpace.isProxy(),
      //       scheme: String(protectionSpace.protocol()),
      //       host: String(protectionSpace.host()),
      //       port: Number(protectionSpace.port()),
      //       realm: String(protectionSpace.realm()),
      //     },
      //     callback
      //   )
      // },
      // Called when an error occurs during navigation.
      // 'webView:didFailNavigation:withError:': function(
      //   webView,
      //   navigation,
      //   error
      // ) {},
      // Called when an error occurs while the web view is loading content.
      "webView:didFailProvisionalNavigation:withError:": function(webView, navigation, error) {
        this.utils.emit("did-fail-load", error);
      },
      // Called when the navigation is complete.
      "webView:didFinishNavigation:": function() {
        if (this.state.wasReady == 0) {
          this.state.wasReady = 1;
          this.utils.emitBrowserEvent("ready-to-show");
        }
        this.utils.emit("did-navigate");
        this.utils.emit("did-frame-navigate");
        this.utils.emit("did-stop-loading");
        this.utils.emit("did-finish-load");
        this.utils.emit("did-frame-finish-load");
      },
      // Called when the web view’s web content process is terminated.
      "webViewWebContentProcessDidTerminate:": function() {
        this.utils.emit("dom-ready");
      }
      // Decides whether to allow or cancel a navigation.
      // webView:decidePolicyForNavigationAction:decisionHandler:
      // Decides whether to allow or cancel a navigation after its response is known.
      // webView:decidePolicyForNavigationResponse:decisionHandler:
    });
  }
  if (!WebScriptHandlerClass) {
    WebScriptHandlerClass = new MochaDelegate({
      utils: null,
      "userContentController:didReceiveScriptMessage:": function(_, message) {
        var args2 = this.utils.parseWebArguments(String(message.body()));
        if (!args2) {
          return;
        }
        if (!args2[0] || typeof args2[0] !== "string") {
          return;
        }
        args2[0] = String(args2[0]);
        this.utils.emit.apply(this, args2);
      }
    });
  }
  var themeObserver = ThemeObserverClass.new({
    utils: {
      executeJavaScript(script2) {
        webview.evaluateJavaScript_completionHandler(script2, null);
      }
    }
  });
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    "document.addEventListener('DOMContentLoaded', function() { document.body.classList.add('__skpm-" + (typeof MSTheme !== "undefined" && MSTheme.sharedTheme().isDark() ? "dark" : "light") + "') }, false)",
    0,
    true
  );
  webview.configuration().userContentController().addUserScript(script);
  NSApplication.sharedApplication().addObserver_forKeyPath_options_context(
    themeObserver,
    "effectiveAppearance",
    NSKeyValueObservingOptionNew,
    null
  );
  var threadDictionary2 = NSThread.mainThread().threadDictionary();
  threadDictionary2[browserWindow.id + ".themeObserver"] = themeObserver;
  var navigationDelegate = NavigationDelegateClass.new({
    utils: {
      setTitle: browserWindow.setTitle.bind(browserWindow),
      emitBrowserEvent() {
        try {
          browserWindow.emit.apply(browserWindow, arguments);
        } catch (err) {
          if (typeof process !== "undefined" && process.listenerCount && process.listenerCount("uncaughtException")) {
            process.emit("uncaughtException", err, "uncaughtException");
          } else {
            console.error(err);
            throw err;
          }
        }
      },
      emit() {
        try {
          browserWindow.webContents.emit.apply(
            browserWindow.webContents,
            arguments
          );
        } catch (err) {
          if (typeof process !== "undefined" && process.listenerCount && process.listenerCount("uncaughtException")) {
            process.emit("uncaughtException", err, "uncaughtException");
          } else {
            console.error(err);
            throw err;
          }
        }
      }
    },
    state: {
      wasReady: 0
    }
  });
  webview.setNavigationDelegate(navigationDelegate);
  var webScriptHandler = WebScriptHandlerClass.new({
    utils: {
      emit(id, type) {
        if (!type) {
          webview.evaluateJavaScript_completionHandler(
            CONSTANTS.JS_BRIDGE_RESULT_SUCCESS + id + "()",
            null
          );
          return;
        }
        var args2 = [];
        for (var i = 2; i < arguments.length; i += 1) args2.push(arguments[i]);
        var listeners = browserWindow.webContents.listeners(type);
        Promise.all(
          listeners.map(function(l) {
            return Promise.resolve().then(function() {
              return l.apply(l, args2);
            });
          })
        ).then(function(res) {
          webview.evaluateJavaScript_completionHandler(
            CONSTANTS.JS_BRIDGE_RESULT_SUCCESS + id + "(" + JSON.stringify(res) + ")",
            null
          );
        }).catch(function(err) {
          webview.evaluateJavaScript_completionHandler(
            CONSTANTS.JS_BRIDGE_RESULT_ERROR + id + "(" + JSON.stringify(err) + ")",
            null
          );
        });
      },
      parseWebArguments
    }
  });
  webview.configuration().userContentController().addScriptMessageHandler_name(webScriptHandler, CONSTANTS.JS_BRIDGE);
  var utils = {
    emit() {
      try {
        browserWindow.emit.apply(browserWindow, arguments);
      } catch (err) {
        if (typeof process !== "undefined" && process.listenerCount && process.listenerCount("uncaughtException")) {
          process.emit("uncaughtException", err, "uncaughtException");
        } else {
          console.error(err);
          throw err;
        }
      }
    }
  };
  if (options.modal) {
    var msdocument;
    if (options.parent.type === "Document") {
      msdocument = options.parent.sketchObject;
    } else {
      msdocument = options.parent;
    }
    if (msdocument && String(msdocument.class()) === "MSDocumentData") {
      msdocument = msdocument.delegate();
    }
    utils.parentWindow = msdocument.windowForSheet();
  }
  var windowDelegate = WindowDelegateClass.new({
    utils,
    panel
  });
  panel.setDelegate(windowDelegate);
}
function BrowserWindow(options) {
  options = options || {};
  var identifier = options.identifier || String(NSUUID.UUID().UUIDString());
  var threadDictionary2 = NSThread.mainThread().threadDictionary();
  var existingBrowserWindow = fromId(identifier);
  if (existingBrowserWindow) {
    return existingBrowserWindow;
  }
  var browserWindow = new events.EventEmitter();
  browserWindow.id = identifier;
  if (options.modal && !options.parent) {
    throw new Error("A modal needs to have a parent.");
  }
  var fiber = coscript.createFiber();
  var width = options.width || 800;
  var height = options.height || 600;
  var mainScreenRect = NSScreen.screens().firstObject().frame();
  var cocoaBounds = NSMakeRect(
    typeof options.x !== "undefined" ? options.x : Math.round((NSWidth(mainScreenRect) - width) / 2),
    typeof options.y !== "undefined" ? NSHeight(mainScreenRect) - options.y : Math.round((NSHeight(mainScreenRect) - height) / 2),
    width,
    height
  );
  if (options.titleBarStyle && options.titleBarStyle !== "default") {
    options.frame = false;
  }
  var useStandardWindow = options.windowType !== "textured";
  var styleMask = NSTitledWindowMask;
  if (options.minimizable !== false) {
    styleMask |= NSMiniaturizableWindowMask;
  }
  if (options.closable !== false) {
    styleMask |= NSClosableWindowMask;
  }
  if (options.resizable !== false) {
    styleMask |= NSResizableWindowMask;
  }
  if (!useStandardWindow || options.transparent || options.frame === false) {
    styleMask |= NSTexturedBackgroundWindowMask;
  }
  var panel = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(
    cocoaBounds,
    styleMask,
    NSBackingStoreBuffered,
    true
  );
  var wkwebviewConfig = WKWebViewConfiguration.alloc().init();
  var webView = WKWebView.alloc().initWithFrame_configuration(
    CGRectMake(0, 0, options.width || 800, options.height || 600),
    wkwebviewConfig
  );
  injectClientMessaging(webView);
  webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
  buildBrowserAPI(browserWindow, panel, webView);
  buildAPI(browserWindow, panel, webView);
  setDelegates(browserWindow, panel, webView, options);
  if (options.windowType === "desktop") {
    panel.setLevel(kCGDesktopWindowLevel - 1);
    panel.setCollectionBehavior(
      NSWindowCollectionBehaviorCanJoinAllSpaces | NSWindowCollectionBehaviorStationary | NSWindowCollectionBehaviorIgnoresCycle
    );
  }
  if (typeof options.minWidth !== "undefined" || typeof options.minHeight !== "undefined") {
    browserWindow.setMinimumSize(options.minWidth || 0, options.minHeight || 0);
  }
  if (typeof options.maxWidth !== "undefined" || typeof options.maxHeight !== "undefined") {
    browserWindow.setMaximumSize(
      options.maxWidth || 1e4,
      options.maxHeight || 1e4
    );
  }
  if (options.transparent || options.frame === false) {
    panel.titlebarAppearsTransparent = true;
    panel.titleVisibility = NSWindowTitleHidden;
    panel.setOpaque(0);
    panel.isMovableByWindowBackground = true;
    var toolbar2 = NSToolbar.alloc().initWithIdentifier(
      "titlebarStylingToolbar"
    );
    toolbar2.setShowsBaselineSeparator(false);
    panel.setToolbar(toolbar2);
  }
  if (options.titleBarStyle === "hiddenInset") {
    var toolbar = NSToolbar.alloc().initWithIdentifier("titlebarStylingToolbar");
    toolbar.setShowsBaselineSeparator(false);
    panel.setToolbar(toolbar);
  }
  if (options.frame === false || !options.useContentSize) {
    browserWindow.setSize(width, height);
  }
  if (options.center) {
    browserWindow.center();
  }
  if (options.alwaysOnTop) {
    browserWindow.setAlwaysOnTop(true);
  }
  if (options.fullscreen) {
    browserWindow.setFullScreen(true);
  }
  browserWindow.setFullScreenable(!!options.fullscreenable);
  let title = options.title;
  if (options.frame === false) {
    title = void 0;
  } else if (typeof title === "undefined" && typeof __command !== "undefined" && __command.pluginBundle()) {
    title = __command.pluginBundle().name();
  }
  if (title) {
    browserWindow.setTitle(title);
  }
  var backgroundColor = options.backgroundColor;
  if (options.transparent) {
    backgroundColor = NSColor.clearColor();
  }
  if (!backgroundColor && options.frame === false && options.vibrancy) {
    backgroundColor = NSColor.clearColor();
  }
  browserWindow._setBackgroundColor(
    backgroundColor || NSColor.windowBackgroundColor()
  );
  if (options.hasShadow === false) {
    browserWindow.setHasShadow(false);
  }
  if (typeof options.opacity !== "undefined") {
    browserWindow.setOpacity(options.opacity);
  }
  options.webPreferences = options.webPreferences || {};
  webView.configuration().preferences().setValue_forKey(
    options.webPreferences.devTools !== false,
    "developerExtrasEnabled"
  );
  webView.configuration().preferences().setValue_forKey(
    options.webPreferences.javascript !== false,
    "javaScriptEnabled"
  );
  webView.configuration().preferences().setValue_forKey(!!options.webPreferences.plugins, "plugInsEnabled");
  webView.configuration().preferences().setValue_forKey(
    options.webPreferences.minimumFontSize || 0,
    "minimumFontSize"
  );
  if (options.webPreferences.zoomFactor) {
    webView.setMagnification(options.webPreferences.zoomFactor);
  }
  var contentView = panel.contentView();
  if (options.frame !== false) {
    webView.setFrame(contentView.bounds());
    contentView.addSubview(webView);
  } else {
    contentView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
    fitSubviewToView(contentView, contentView.superview());
    webView.setFrame(contentView.bounds());
    contentView.addSubview(webView);
    if (panel.standardWindowButton(NSWindowFullScreenButton)) {
      panel.standardWindowButton(NSWindowFullScreenButton).setHidden(true);
    }
    if (!options.titleBarStyle || options.titleBarStyle === "default") {
      panel.standardWindowButton(NSWindowZoomButton).setHidden(true);
      panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
      panel.standardWindowButton(NSWindowCloseButton).setHidden(true);
      panel.standardWindowButton(NSWindowZoomButton).setEnabled(false);
    }
  }
  if (options.vibrancy) {
    browserWindow.setVibrancy(options.vibrancy);
  }
  browserWindow.setMaximizable(options.maximizable !== false);
  panel.setHidesOnDeactivate(options.hidesOnDeactivate !== false);
  if (options.remembersWindowFrame) {
    panel.setFrameAutosaveName(identifier);
    panel.setFrameUsingName_force(panel.frameAutosaveName(), false);
  }
  if (options.acceptsFirstMouse) {
    browserWindow.on("focus", function(event) {
      if (event.type() === NSEventTypeLeftMouseDown) {
        browserWindow.webContents.executeJavaScript(dispatchFirstClick(webView, event)).catch(() => {
        });
      }
    });
  }
  injectScript$1(webView);
  injectScript(webView);
  setupHandler(browserWindow);
  if (options.show !== false) {
    browserWindow.show();
  }
  browserWindow.on("closed", function() {
    browserWindow._destroyed = true;
    threadDictionary2.removeObjectForKey(identifier);
    var observer = threadDictionary2[identifier + ".themeObserver"];
    if (observer) {
      NSApplication.sharedApplication().removeObserver_forKeyPath(
        observer,
        "effectiveAppearance"
      );
      threadDictionary2.removeObjectForKey(identifier + ".themeObserver");
    }
    fiber.cleanup();
  });
  threadDictionary2[identifier] = panel;
  fiber.onCleanup(function() {
    if (!browserWindow._destroyed) {
      browserWindow.destroy();
    }
  });
  return browserWindow;
}
const fromId = function(identifier) {
  var threadDictionary2 = NSThread.mainThread().threadDictionary();
  if (threadDictionary2[identifier]) {
    return fromPanel(threadDictionary2[identifier], identifier);
  }
  return void 0;
};
const fromPanel = function(panel, identifier) {
  var browserWindow = new events.EventEmitter();
  browserWindow.id = identifier;
  if (!panel || !panel.contentView) {
    throw new Error("needs to pass an NSPanel");
  }
  var webView = null;
  var subviews = panel.contentView().subviews();
  for (var i = 0; i < subviews.length; i += 1) {
    if (!webView && !subviews[i].isKindOfClass(WKInspectorWKWebView) && subviews[i].isKindOfClass(WKWebView)) {
      webView = subviews[i];
    }
  }
  if (!webView) {
    throw new Error("The panel needs to have a webview");
  }
  buildBrowserAPI(browserWindow, panel, webView);
  buildAPI(browserWindow, panel, webView);
  return browserWindow;
};
var threadDictionary = NSThread.mainThread().threadDictionary();
const isWebviewPresent = function isWebviewPresent2(identifier) {
  return !!threadDictionary[identifier];
};
const sendToWebview = function sendToWebview2(identifier, evalString) {
  if (!isWebviewPresent(identifier)) {
    return;
  }
  var panel = threadDictionary[identifier];
  var webview = null;
  var subviews = panel.contentView().subviews();
  for (var i = 0; i < subviews.length; i += 1) {
    if (!webview && !subviews[i].isKindOfClass(WKInspectorWKWebView) && subviews[i].isKindOfClass(WKWebView)) {
      webview = subviews[i];
    }
  }
  if (!webview || !webview.evaluateJavaScript_completionHandler) {
    throw new Error("Webview " + identifier + " not found");
  }
  webview.evaluateJavaScript_completionHandler(evalString, null);
};
const version = "3.0.1";
const pack = {
  version
};
const PREFUNIQUKEY = "github.icai.sketch-find-and-replace.pref";
const SATEUNIQUKEY = "github.icai.sketch-find-and-replace.state";
const defaultSettings = {
  findString: "",
  replaceString: "",
  document: false,
  regexActive: false,
  caseSensitive: false,
  wholeWord: false,
  count: 0
};
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function escapeReplaceString(string) {
  return string;
}
const debounce = (fn, time) => {
  let timeout;
  return function() {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};
function FindAndReplace(context) {
  let theme = "";
  if (UI && UI.getTheme) {
    theme = UI.getTheme();
  }
  if (theme === "dark") {
    defaultSettings.darkMode = true;
  } else {
    defaultSettings.darkMode = false;
  }
  const savedSate = Settings.settingForKey(SATEUNIQUKEY);
  let state = Object.assign({}, defaultSettings);
  if (typeof savedSate === "string" && savedSate == "Loaded") {
    Settings.setSettingForKey(SATEUNIQUKEY, "");
    const savedSettings = Settings.settingForKey(PREFUNIQUKEY);
    if (typeof savedSettings === "string" && typeof JSON.parse(savedSettings) === "object") {
      state = Object.assign({}, defaultSettings, JSON.parse(savedSettings));
    } else {
      Settings.setSettingForKey(PREFUNIQUKEY, JSON.stringify({}));
    }
  }
  Settings.setSettingForKey(SATEUNIQUKEY, "Loaded");
  let layers = [];
  let overrides = [];
  const document = Document.getSelectedDocument();
  let selection = null;
  if (document) {
    const selectedLayers = document.selectedLayers;
    selection = selectedLayers.layers;
    if (selectedLayers.length > 0) {
      UI.message("Find and replace in the selection (v" + pack.version + ")", document);
      state = Object.assign({}, state, { findMode: 1, selection: true });
    } else {
      UI.message("Find and replace in the current page (v" + pack.version + ")", document);
      const page = document.selectedPage;
      selection = page.layers;
      state = Object.assign({}, state, { findMode: 2, selection: false });
    }
  }
  const saveSettings = (obj) => {
    const str = JSON.stringify(obj, null, 1);
    Settings.setSettingForKey(PREFUNIQUKEY, str);
  };
  const windowOptions = {
    identifier: "github.icai.sketch-find-and-replace",
    width: 460,
    height: 250,
    resizable: false,
    alwaysOnTop: true,
    fullscreenable: false,
    title: "Find and Replace V3",
    acceptFirstMouse: true,
    minimizable: false,
    maximizable: false
  };
  let browserWindow = new BrowserWindow(windowOptions);
  browserWindow.on("closed", () => {
    browserWindow = null;
  });
  const pluginUrl = context.plugin.url();
  const htmlUrl = pluginUrl.URLByAppendingPathComponent("Contents/Resources/resources/index.html");
  browserWindow.loadURL(htmlUrl.absoluteString());
  let contents = browserWindow.webContents;
  const initRegExp = (newState) => {
    state = newState;
    UI.message(`${state.findString} replace by ${state.replaceString}`);
    layers = [];
    overrides = [];
    const rexExpFlag = `g${state.caseSensitive == true ? "" : "i"}`;
    const regExpPrefix = state.wholeWord ? "(?:\\^|\\b)" : "";
    const regExpSufix = state.wholeWord ? "(?=\\b|\\$)" : "";
    const regExpPattern = state.regexActive ? `${regExpPrefix}${state.findString}${regExpSufix}` : `${regExpPrefix}(?:${escapeRegExp(state.findString)})${regExpSufix}`;
    const regex2 = new RegExp(regExpPattern, rexExpFlag);
    const { findMode } = state;
    switch (findMode) {
      case 1:
        if (document && document.selectedLayers.length > 0) {
          selection = document.selectedLayers.layers;
        }
        break;
      case 3:
        selection = document.pages;
        break;
      default:
        selection = document.selectedPage.layers;
    }
    state = Object.assign({}, state, {
      regex: regex2
    });
    parseLayers(selection);
    const count = layers.length + overrides.length;
    state = Object.assign({}, state, { count });
    updateSateWebview();
  };
  const replaceInLayer = (layer) => {
    const newStringValue = layer.text.replace(state.regex, escapeReplaceString(state.replaceString));
    layer.text = newStringValue;
    if (layer.text != newStringValue) {
      layers.push(layer);
    }
  };
  const replaceInOverride = (override) => {
    const newStringValue = override.value.replace(state.regex, escapeReplaceString(state.replaceString));
    override.value = newStringValue;
    if (override.value != newStringValue) {
      overrides.push(override);
    }
  };
  const updateSateWebview = (init) => {
    if (init) {
      state = Object.assign({}, state, { init });
    }
    if (isWebviewPresent(windowOptions.identifier)) {
      sendToWebview(
        windowOptions.identifier,
        `updateData('${JSON.stringify(state)}')`
      );
    }
    state = Object.assign({}, state, { init: false });
  };
  const parseLayers = (layers2) => {
    const { findMode } = state;
    layers2.forEach((layer) => {
      switch (layer.type) {
        case "Artboard":
          if (layer.layers && layer.layers.length > 0) {
            parseLayers(layer.layers);
          }
          break;
        case "Group":
          if (layer.layers) {
            parseLayers(layer.layers);
          }
          break;
        case "Text":
          {
            replaceInLayer(layer);
          }
          break;
        case "ShapePath":
          break;
        case "Shape":
          break;
        case "SymbolMaster":
          if (findMode === 1 || document.selectedPage.name === "Symbols") {
            parseLayers(layer.layers);
          }
          break;
        case "SymbolInstance":
          if (layer.overrides) {
            parseOverrides(layer.overrides);
          }
          break;
        case "Image":
          break;
        default:
          if (layer.layers) {
            parseLayers(layer.layers);
          }
      }
    });
  };
  const parseOverrides = (overrides2) => {
    overrides2.forEach((override) => {
      switch (override.affectedLayer.type) {
        case "Text":
          if (override.editable && override.property == "stringValue") {
            replaceInOverride(override);
          }
          break;
      }
    });
  };
  contents.once("did-finish-load", () => {
    updateSateWebview(true);
  });
  contents.once("close", () => {
    console.log("BrowserWindow closed");
    browserWindow.close();
  });
  contents.on("message", (s) => {
    UI.message(s);
  });
  contents.on("resetPref", () => {
    Settings.setSettingForKey(SATEUNIQUKEY, "");
    Settings.setSettingForKey(PREFUNIQUKEY, JSON.stringify({}));
    UI.message(`Reset Preference Settings 🖖! Done`);
  });
  contents.on("setDarkMode", (mode) => {
    state = Object.assign({}, state, { darkMode: mode });
    saveSettings(state);
    UI.message(`Set darkMode ${mode ? "on 🌙" : "off 😎"}!`);
  });
  contents.on("find", debounce((json) => {
    const newState = Object.assign({}, JSON.parse(json));
    if (newState.findString != state.findString) ;
  }, 100));
  contents.on("replace", debounce((json) => {
    const newState = Object.assign({}, JSON.parse(json));
    initRegExp(newState);
    saveSettings(state);
    if (isWebviewPresent(windowOptions.identifier)) {
      const stateForUpdate = Object.assign({}, state, { replaceStart: false });
      sendToWebview(
        windowOptions.identifier,
        `updateData('${JSON.stringify(stateForUpdate)}')`
      );
    }
    browserWindow.close();
  }, 100));
  contents.on("selection", debounce((json) => {
    state = Object.assign({}, JSON.parse(json));
    const { findMode } = state;
    if (document) {
      selection = document.selectedLayers;
      if (selection.length > 0 && findMode == 1) {
        UI.message("Find and replace in the selection");
        state = Object.assign({}, state, { findMode: 1, selection: true });
      } else {
        UI.message("Find and replace in the current page");
        const page = document.selectedPage;
        selection = page.layers;
        state = Object.assign({}, state, { findMode: 2, selection: false });
      }
    }
    saveSettings(state);
    updateSateWebview(false);
  }, 100));
}
globalThis['onRun'] =  FindAndReplace;
