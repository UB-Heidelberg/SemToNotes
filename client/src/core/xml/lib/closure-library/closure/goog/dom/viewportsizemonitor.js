// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utility class that monitors viewport size changes.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @see ../demos/viewportsizemonitor.html
***REMOVED***

goog.provide('goog.dom.ViewportSizeMonitor');

goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.math.Size');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** This class can be used to monitor changes in the viewport size.  Instances
***REMOVED*** dispatch a {@link goog.events.EventType.RESIZE} event when the viewport size
***REMOVED*** changes.  Handlers can call {@link goog.dom.ViewportSizeMonitor#getSize} to
***REMOVED*** get the new viewport size.
***REMOVED***
***REMOVED*** Use this class if you want to execute resize/reflow logic each time the
***REMOVED*** user resizes the browser window.  This class is guaranteed to only dispatch
***REMOVED*** {@code RESIZE} events when the pixel dimensions of the viewport change.
***REMOVED*** (Internet Explorer fires resize events if any element on the page is resized,
***REMOVED*** even if the viewport dimensions are unchanged, which can lead to infinite
***REMOVED*** resize loops.)
***REMOVED***
***REMOVED*** Example usage:
***REMOVED***  <pre>
***REMOVED***    var vsm = new goog.dom.ViewportSizeMonitor();
***REMOVED***  ***REMOVED***vsm, goog.events.EventType.RESIZE, function(e) {
***REMOVED***      alert('Viewport size changed to ' + vsm.getSize());
***REMOVED***    });
***REMOVED***  </pre>
***REMOVED***
***REMOVED*** Manually verified on IE6, IE7, FF2, Opera 9, and WebKit.  {@code getSize}
***REMOVED*** doesn't always return the correct viewport height on Safari 2.0.4.
***REMOVED***
***REMOVED*** @param {Window=} opt_window The window to monitor; defaults to the window in
***REMOVED***    which this code is executing.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.dom.ViewportSizeMonitor = function(opt_window) {
  goog.events.EventTarget.call(this);

  // Default the window to the current window if unspecified.
  this.window_ = opt_window || window;

  // Listen for window resize events.
  this.listenerKey_ = goog.events.listen(this.window_,
      goog.events.EventType.RESIZE, this.handleResize_, false, this);

  // Set the initial size.
  this.size_ = goog.dom.getViewportSize(this.window_);

  if (this.isPollingRequired_()) {
    this.windowSizePollInterval_ = window.setInterval(
        goog.bind(this.checkForSizeChange_, this),
        goog.dom.ViewportSizeMonitor.WINDOW_SIZE_POLL_RATE);
  }
***REMOVED***
goog.inherits(goog.dom.ViewportSizeMonitor, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Returns a viewport size monitor for the given window.  A new one is created
***REMOVED*** if it doesn't exist already.  This prevents the unnecessary creation of
***REMOVED*** multiple spooling monitors for a window.
***REMOVED*** @param {Window=} opt_window The window to monitor; defaults to the window in
***REMOVED***     which this code is executing.
***REMOVED*** @return {goog.dom.ViewportSizeMonitor} Monitor for the given window.
***REMOVED***
goog.dom.ViewportSizeMonitor.getInstanceForWindow = function(opt_window) {
  var currentWindow = opt_window || window;
  var uid = goog.getUid(currentWindow);

  return goog.dom.ViewportSizeMonitor.windowInstanceMap_[uid] =
      goog.dom.ViewportSizeMonitor.windowInstanceMap_[uid] ||
      new goog.dom.ViewportSizeMonitor(currentWindow);
***REMOVED***


***REMOVED***
***REMOVED*** Removes and disposes a viewport size monitor for the given window if one
***REMOVED*** exists.
***REMOVED*** @param {Window=} opt_window The window whose monitor should be removed;
***REMOVED***     defaults to the window in which this code is executing.
***REMOVED***
goog.dom.ViewportSizeMonitor.removeInstanceForWindow = function(opt_window) {
  var uid = goog.getUid(opt_window || window);

  goog.dispose(goog.dom.ViewportSizeMonitor.windowInstanceMap_[uid]);
  delete goog.dom.ViewportSizeMonitor.windowInstanceMap_[uid];
***REMOVED***


***REMOVED***
***REMOVED*** Map of window hash code to viewport size monitor for that window, if
***REMOVED*** created.
***REMOVED*** @type {Object.<number,goog.dom.ViewportSizeMonitor>}
***REMOVED*** @private
***REMOVED***
goog.dom.ViewportSizeMonitor.windowInstanceMap_ = {***REMOVED***


***REMOVED***
***REMOVED*** Rate in milliseconds at which to poll the window size on browsers that
***REMOVED*** need polling.
***REMOVED*** @type {number}
***REMOVED***
goog.dom.ViewportSizeMonitor.WINDOW_SIZE_POLL_RATE = 500;


***REMOVED***
***REMOVED*** Event listener key for window the window resize handler, as returned by
***REMOVED*** {@link goog.events.listen}.
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.dom.ViewportSizeMonitor.prototype.listenerKey_ = null;


***REMOVED***
***REMOVED*** The window to monitor.  Defaults to the window in which the code is running.
***REMOVED*** @type {Window}
***REMOVED*** @private
***REMOVED***
goog.dom.ViewportSizeMonitor.prototype.window_ = null;


***REMOVED***
***REMOVED*** The most recently recorded size of the viewport, in pixels.
***REMOVED*** @type {goog.math.Size?}
***REMOVED*** @private
***REMOVED***
goog.dom.ViewportSizeMonitor.prototype.size_ = null;


***REMOVED***
***REMOVED*** Identifier for the interval used for polling the window size on Windows
***REMOVED*** Safari.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.dom.ViewportSizeMonitor.prototype.windowSizePollInterval_ = null;


***REMOVED***
***REMOVED*** Checks if polling is required for this user agent. Opera only requires
***REMOVED*** polling when the page is loaded within an IFRAME.
***REMOVED*** @return {boolean} Whether polling is required.
***REMOVED*** @private
***REMOVED***
goog.dom.ViewportSizeMonitor.prototype.isPollingRequired_ = function() {
  return goog.userAgent.WEBKIT && goog.userAgent.WINDOWS ||
      goog.userAgent.OPERA && this.window_.self != this.window_.top;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the most recently recorded size of the viewport, in pixels.  May
***REMOVED*** return null if no window resize event has been handled yet.
***REMOVED*** @return {goog.math.Size} The viewport dimensions, in pixels.
***REMOVED***
goog.dom.ViewportSizeMonitor.prototype.getSize = function() {
  // Return a clone instead of the original to preserve encapsulation.
  return this.size_ ? this.size_.clone() : null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ViewportSizeMonitor.prototype.disposeInternal = function() {
  goog.dom.ViewportSizeMonitor.superClass_.disposeInternal.call(this);

  if (this.listenerKey_) {
    goog.events.unlistenByKey(this.listenerKey_);
    this.listenerKey_ = null;
  }

  if (this.windowSizePollInterval_) {
    window.clearInterval(this.windowSizePollInterval_);
    this.windowSizePollInterval_ = null;
  }

  this.window_ = null;
  this.size_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Handles window resize events by measuring the dimensions of the
***REMOVED*** viewport and dispatching a {@link goog.events.EventType.RESIZE} event if the
***REMOVED*** current dimensions are different from the previous ones.
***REMOVED*** @param {goog.events.Event} event The window resize event to handle.
***REMOVED*** @private
***REMOVED***
goog.dom.ViewportSizeMonitor.prototype.handleResize_ = function(event) {
  this.checkForSizeChange_();
***REMOVED***


***REMOVED***
***REMOVED*** Measures the dimensions of the viewport and dispatches a
***REMOVED*** {@link goog.events.EventType.RESIZE} event if the current dimensions are
***REMOVED*** different from the previous ones.
***REMOVED*** @private
***REMOVED***
goog.dom.ViewportSizeMonitor.prototype.checkForSizeChange_ = function() {
  var size = goog.dom.getViewportSize(this.window_);
  if (!goog.math.Size.equals(size, this.size_)) {
    this.size_ = size;
    this.dispatchEvent(goog.events.EventType.RESIZE);
  }
***REMOVED***
