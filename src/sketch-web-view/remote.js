/* globals NSThread */
import { fromId } from './lib'
var threadDictionary = NSThread.mainThread().threadDictionary()

export const getWebview = function (identifier) {
  return fromId(identifier) // eslint-disable-line
}

export const isWebviewPresent = function isWebviewPresent(identifier) {
  return !!threadDictionary[identifier]
}

export const sendToWebview = function sendToWebview(identifier, evalString) {
  if (!isWebviewPresent(identifier)) {
    return
  }

  var panel = threadDictionary[identifier]
  var webview = null
  var subviews = panel.contentView().subviews()
  for (var i = 0; i < subviews.length; i += 1) {
    if (
      !webview &&
      !subviews[i].isKindOfClass(WKInspectorWKWebView) &&
      subviews[i].isKindOfClass(WKWebView)
    ) {
      webview = subviews[i]
    }
  }

  if (!webview || !webview.evaluateJavaScript_completionHandler) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  webview.evaluateJavaScript_completionHandler(evalString, null)
}
