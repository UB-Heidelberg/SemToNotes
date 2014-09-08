// Copyright 2008 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Class that can be used to determine when an iframe is loaded.
***REMOVED***

goog.provide('goog.net.IframeLoadMonitor');

goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** The correct way to determine whether a same-domain iframe has completed
***REMOVED*** loading is different in IE and Firefox.  This class abstracts above these
***REMOVED*** differences, providing a consistent interface for:
***REMOVED*** <ol>
***REMOVED*** <li> Determing if an iframe is currently loaded
***REMOVED*** <li> Listening for an iframe that is not currently loaded, to finish loading
***REMOVED*** </ol>
***REMOVED***
***REMOVED*** @param {HTMLIFrameElement} iframe An iframe.
***REMOVED*** @param {boolean=} opt_hasContent Does the loaded iframe have content.
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.net.IframeLoadMonitor = function(iframe, opt_hasContent) {
  goog.net.IframeLoadMonitor.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Iframe whose load state is monitored by this IframeLoadMonitor
  ***REMOVED*** @type {HTMLIFrameElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.iframe_ = iframe;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether or not the loaded iframe has any content.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.hasContent_ = !!opt_hasContent;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether or not the iframe is loaded.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.isLoaded_ = this.isLoadedHelper_();

  if (!this.isLoaded_) {
    // IE 6 (and lower?) does not reliably fire load events, so listen to
    // readystatechange.
    // IE 7 does not reliably fire readystatechange events but listening on load
    // seems to work just fine.
    var isIe6OrLess =
        goog.userAgent.IE && !goog.userAgent.isVersionOrHigher('7');
    var loadEvtType = isIe6OrLess ?
        goog.events.EventType.READYSTATECHANGE : goog.events.EventType.LOAD;
    this.onloadListenerKey_ = goog.events.listen(
        this.iframe_, loadEvtType, this.handleLoad_, false, this);

    // Sometimes we still don't get the event callback, so we'll poll just to
    // be safe.
    this.intervalId_ = window.setInterval(
        goog.bind(this.handleLoad_, this),
        goog.net.IframeLoadMonitor.POLL_INTERVAL_MS_);
  }
***REMOVED***
goog.inherits(goog.net.IframeLoadMonitor, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Event type dispatched by a goog.net.IframeLoadMonitor when it internal iframe
***REMOVED*** finishes loading for the first time after construction of the
***REMOVED*** goog.net.IframeLoadMonitor
***REMOVED*** @type {string}
***REMOVED***
goog.net.IframeLoadMonitor.LOAD_EVENT = 'ifload';


***REMOVED***
***REMOVED*** Poll interval for polling iframe load states in milliseconds.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.IframeLoadMonitor.POLL_INTERVAL_MS_ = 100;


***REMOVED***
***REMOVED*** Key for iframe load listener, or null if not currently listening on the
***REMOVED*** iframe for a load event.
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.net.IframeLoadMonitor.prototype.onloadListenerKey_ = null;


***REMOVED***
***REMOVED*** Returns whether or not the iframe is loaded.
***REMOVED*** @return {boolean} whether or not the iframe is loaded.
***REMOVED***
goog.net.IframeLoadMonitor.prototype.isLoaded = function() {
  return this.isLoaded_;
***REMOVED***


***REMOVED***
***REMOVED*** Stops the poll timer if this IframeLoadMonitor is currently polling.
***REMOVED*** @private
***REMOVED***
goog.net.IframeLoadMonitor.prototype.maybeStopTimer_ = function() {
  if (this.intervalId_) {
    window.clearInterval(this.intervalId_);
    this.intervalId_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the iframe whose load state this IframeLoader monitors.
***REMOVED*** @return {HTMLIFrameElement} the iframe whose load state this IframeLoader
***REMOVED***     monitors.
***REMOVED***
goog.net.IframeLoadMonitor.prototype.getIframe = function() {
  return this.iframe_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.IframeLoadMonitor.prototype.disposeInternal = function() {
  delete this.iframe_;
  this.maybeStopTimer_();
  goog.events.unlistenByKey(this.onloadListenerKey_);
  goog.net.IframeLoadMonitor.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether or not the iframe is loaded.  Determines this by inspecting
***REMOVED*** browser dependent properties of the iframe.
***REMOVED*** @return {boolean} whether or not the iframe is loaded.
***REMOVED*** @private
***REMOVED***
goog.net.IframeLoadMonitor.prototype.isLoadedHelper_ = function() {
  var isLoaded = false;
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    // IE versions before IE11 will reliably have readyState set to complete if
    // the iframe is loaded. For everything else, the iframe is loaded if there
    // is a body and if the body should have content the firstChild exists.
    // Firefox can fire the LOAD event and then a few hundred ms later replace
    // the contentDocument once the content is loaded.
    if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher('11')) {
      isLoaded = this.iframe_.readyState == 'complete';
    } else {
      isLoaded = !!goog.dom.getFrameContentDocument(this.iframe_).body &&
          (!this.hasContent_ ||
          !!goog.dom.getFrameContentDocument(this.iframe_).body.firstChild);
    }
  } catch (e) {
    // Ignore these errors. This just means that the iframe is not loaded
    // IE will throw error reading readyState if the iframe is not appended
    // to the dom yet.
    // Firefox will throw error getting the iframe body if the iframe is not
    // fully loaded.
  }
  return isLoaded;
***REMOVED***


***REMOVED***
***REMOVED*** Handles an event indicating that the loading status of the iframe has
***REMOVED*** changed.  In Firefox this is a goog.events.EventType.LOAD event, in IE
***REMOVED*** this is a goog.events.EventType.READYSTATECHANGED
***REMOVED*** @private
***REMOVED***
goog.net.IframeLoadMonitor.prototype.handleLoad_ = function() {
  // Only do the handler if the iframe is loaded.
  if (this.isLoadedHelper_()) {
    this.maybeStopTimer_();
    goog.events.unlistenByKey(this.onloadListenerKey_);
    this.onloadListenerKey_ = null;
    this.isLoaded_ = true;
    this.dispatchEvent(goog.net.IframeLoadMonitor.LOAD_EVENT);
  }
***REMOVED***
