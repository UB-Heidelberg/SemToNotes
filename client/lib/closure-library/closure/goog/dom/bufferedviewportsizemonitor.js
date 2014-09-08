// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A viewport size monitor that buffers RESIZE events until the
***REMOVED*** window size has stopped changing, within a specified period of time.  For
***REMOVED*** every RESIZE event dispatched, this will dispatch up to two***REMOVED***additional*
***REMOVED*** events:
***REMOVED*** - {@link #EventType.RESIZE_WIDTH} if the viewport's width has changed since
***REMOVED***   the last buffered dispatch.
***REMOVED*** - {@link #EventType.RESIZE_HEIGHT} if the viewport's height has changed since
***REMOVED***   the last buffered dispatch.
***REMOVED*** You likely only need to listen to one of the three events.  But if you need
***REMOVED*** more, just be cautious of duplicating effort.
***REMOVED***
***REMOVED***

goog.provide('goog.dom.BufferedViewportSizeMonitor');

goog.require('goog.asserts');
goog.require('goog.async.Delay');
***REMOVED***
goog.require('goog.events.EventTarget');
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new BufferedViewportSizeMonitor.
***REMOVED*** @param {!goog.dom.ViewportSizeMonitor} viewportSizeMonitor The
***REMOVED***     underlying viewport size monitor.
***REMOVED*** @param {number=} opt_bufferMs The buffer time, in ms. If not specified, this
***REMOVED***     value defaults to {@link #RESIZE_EVENT_DELAY_MS_}.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @final
***REMOVED***
goog.dom.BufferedViewportSizeMonitor = function(
    viewportSizeMonitor, opt_bufferMs) {
  goog.dom.BufferedViewportSizeMonitor.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying viewport size monitor.
  ***REMOVED*** @type {goog.dom.ViewportSizeMonitor}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.viewportSizeMonitor_ = viewportSizeMonitor;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current size of the viewport.
  ***REMOVED*** @type {goog.math.Size}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.currentSize_ = this.viewportSizeMonitor_.getSize();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The resize buffer time in ms.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.resizeBufferMs_ = opt_bufferMs ||
      goog.dom.BufferedViewportSizeMonitor.RESIZE_EVENT_DELAY_MS_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Listener key for the viewport size monitor.
  ***REMOVED*** @type {goog.events.Key}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.listenerKey_ = goog.events.listen(
      viewportSizeMonitor,
      goog.events.EventType.RESIZE,
      this.handleResize_,
      false,
      this);
***REMOVED***
goog.inherits(goog.dom.BufferedViewportSizeMonitor, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Additional events to dispatch.
***REMOVED*** @enum {string}
***REMOVED***
goog.dom.BufferedViewportSizeMonitor.EventType = {
  RESIZE_HEIGHT: goog.events.getUniqueId('resizeheight'),
  RESIZE_WIDTH: goog.events.getUniqueId('resizewidth')
***REMOVED***


***REMOVED***
***REMOVED*** Delay for the resize event.
***REMOVED*** @type {goog.async.Delay}
***REMOVED*** @private
***REMOVED***
goog.dom.BufferedViewportSizeMonitor.prototype.resizeDelay_;


***REMOVED***
***REMOVED*** Default number of milliseconds to wait after a resize event to relayout the
***REMOVED*** page.
***REMOVED*** @type {number}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.dom.BufferedViewportSizeMonitor.RESIZE_EVENT_DELAY_MS_ = 100;


***REMOVED*** @override***REMOVED***
goog.dom.BufferedViewportSizeMonitor.prototype.disposeInternal =
    function() {
  goog.events.unlistenByKey(this.listenerKey_);
  goog.dom.BufferedViewportSizeMonitor.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** Handles resize events on the underlying ViewportMonitor.
***REMOVED*** @private
***REMOVED***
goog.dom.BufferedViewportSizeMonitor.prototype.handleResize_ =
    function() {
  // Lazily create when needed.
  if (!this.resizeDelay_) {
    this.resizeDelay_ = new goog.async.Delay(
        this.onWindowResize_,
        this.resizeBufferMs_,
        this);
    this.registerDisposable(this.resizeDelay_);
  }
  this.resizeDelay_.start();
***REMOVED***


***REMOVED***
***REMOVED*** Window resize callback that determines whether to reflow the view contents.
***REMOVED*** @private
***REMOVED***
goog.dom.BufferedViewportSizeMonitor.prototype.onWindowResize_ =
    function() {
  if (this.viewportSizeMonitor_.isDisposed()) {
    return;
  }

  var previousSize = this.currentSize_;
  var currentSize = this.viewportSizeMonitor_.getSize();

  goog.asserts.assert(currentSize,
      'Viewport size should be set at this point');

  this.currentSize_ = currentSize;

  if (previousSize) {

    var resized = false;

    // Width has changed
    if (previousSize.width != currentSize.width) {
      this.dispatchEvent(
          goog.dom.BufferedViewportSizeMonitor.EventType.RESIZE_WIDTH);
      resized = true;
    }

    // Height has changed
    if (previousSize.height != currentSize.height) {
      this.dispatchEvent(
          goog.dom.BufferedViewportSizeMonitor.EventType.RESIZE_HEIGHT);
      resized = true;
    }

    // If either has changed, this is a resize event.
    if (resized) {
      this.dispatchEvent(goog.events.EventType.RESIZE);
    }

  } else {
    // If we didn't have a previous size, we consider all events to have
    // changed.
    this.dispatchEvent(
        goog.dom.BufferedViewportSizeMonitor.EventType.RESIZE_HEIGHT);
    this.dispatchEvent(
        goog.dom.BufferedViewportSizeMonitor.EventType.RESIZE_WIDTH);
    this.dispatchEvent(goog.events.EventType.RESIZE);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current size of the viewport.
***REMOVED*** @return {goog.math.Size?} The current viewport size.
***REMOVED***
goog.dom.BufferedViewportSizeMonitor.prototype.getSize = function() {
  return this.currentSize_ ? this.currentSize_.clone() : null;
***REMOVED***
