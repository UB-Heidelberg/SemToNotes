// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview This event wrapper will dispatch an event when the user uses
***REMOVED*** the mouse wheel to scroll an element. You can get the direction by checking
***REMOVED*** the deltaX and deltaY properties of the event.
***REMOVED***
***REMOVED*** This class aims to smooth out inconsistencies between browser platforms with
***REMOVED*** regards to mousewheel events, but we do not cover every possible
***REMOVED*** software/hardware combination out there, some of which occasionally produce
***REMOVED*** very large deltas in mousewheel events. If your application wants to guard
***REMOVED*** against extremely large deltas, use the setMaxDeltaX and setMaxDeltaY APIs
***REMOVED*** to set maximum values that make sense for your application.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @see ../demos/mousewheelhandler.html
***REMOVED***

goog.provide('goog.events.MouseWheelEvent');
goog.provide('goog.events.MouseWheelHandler');
goog.provide('goog.events.MouseWheelHandler.EventType');

goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.math');
goog.require('goog.style');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** This event handler allows you to catch mouse wheel events in a consistent
***REMOVED*** manner.
***REMOVED*** @param {Element|Document} element The element to listen to the mouse wheel
***REMOVED***     event on.
***REMOVED*** @param {boolean=} opt_capture Whether to handle the mouse wheel event in
***REMOVED***     capture phase.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.events.MouseWheelHandler = function(element, opt_capture) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** This is the element that we will listen to the real mouse wheel events on.
  ***REMOVED*** @type {Element|Document}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_ = element;

  var rtlElement = goog.dom.isElement(this.element_) ?
     ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.element_) :
      (this.element_ ?***REMOVED*****REMOVED*** @type {Document}***REMOVED*** (this.element_).body : null);

 ***REMOVED*****REMOVED***
  ***REMOVED*** True if the element exists and is RTL, false otherwise.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.isRtl_ = !!rtlElement && goog.style.isRightToLeft(rtlElement);

  var type = goog.userAgent.GECKO ? 'DOMMouseScroll' : 'mousewheel';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The key returned from the goog.events.listen.
  ***REMOVED*** @type {goog.events.Key}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.listenKey_ = goog.events.listen(this.element_, type, this, opt_capture);
***REMOVED***
goog.inherits(goog.events.MouseWheelHandler, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Enum type for the events fired by the mouse wheel handler.
***REMOVED*** @enum {string}
***REMOVED***
goog.events.MouseWheelHandler.EventType = {
  MOUSEWHEEL: 'mousewheel'
***REMOVED***


***REMOVED***
***REMOVED*** Optional maximum magnitude for x delta on each mousewheel event.
***REMOVED*** @type {number|undefined}
***REMOVED*** @private
***REMOVED***
goog.events.MouseWheelHandler.prototype.maxDeltaX_;


***REMOVED***
***REMOVED*** Optional maximum magnitude for y delta on each mousewheel event.
***REMOVED*** @type {number|undefined}
***REMOVED*** @private
***REMOVED***
goog.events.MouseWheelHandler.prototype.maxDeltaY_;


***REMOVED***
***REMOVED*** @param {number} maxDeltaX Maximum magnitude for x delta on each mousewheel
***REMOVED***     event. Should be non-negative.
***REMOVED***
goog.events.MouseWheelHandler.prototype.setMaxDeltaX = function(maxDeltaX) {
  this.maxDeltaX_ = maxDeltaX;
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} maxDeltaY Maximum magnitude for y delta on each mousewheel
***REMOVED***     event. Should be non-negative.
***REMOVED***
goog.events.MouseWheelHandler.prototype.setMaxDeltaY = function(maxDeltaY) {
  this.maxDeltaY_ = maxDeltaY;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the events on the element.
***REMOVED*** @param {goog.events.BrowserEvent} e The underlying browser event.
***REMOVED***
goog.events.MouseWheelHandler.prototype.handleEvent = function(e) {
  var deltaX = 0;
  var deltaY = 0;
  var detail = 0;
  var be = e.getBrowserEvent();
  if (be.type == 'mousewheel') {
    var wheelDeltaScaleFactor = 1;
    if (goog.userAgent.IE ||
        goog.userAgent.WEBKIT &&
        (goog.userAgent.WINDOWS || goog.userAgent.isVersionOrHigher('532.0'))) {
      // In IE we get a multiple of 120; we adjust to a multiple of 3 to
      // represent number of lines scrolled (like Gecko).
      // Newer versions of Webkit match IE behavior, and WebKit on
      // Windows also matches IE behavior.
      // See bug https://bugs.webkit.org/show_bug.cgi?id=24368
      wheelDeltaScaleFactor = 40;
    }

    detail = goog.events.MouseWheelHandler.smartScale_(
        -be.wheelDelta, wheelDeltaScaleFactor);
    if (goog.isDef(be.wheelDeltaX)) {
      // Webkit has two properties to indicate directional scroll, and
      // can scroll both directions at once.
      deltaX = goog.events.MouseWheelHandler.smartScale_(
          -be.wheelDeltaX, wheelDeltaScaleFactor);
      deltaY = goog.events.MouseWheelHandler.smartScale_(
          -be.wheelDeltaY, wheelDeltaScaleFactor);
    } else {
      deltaY = detail;
    }

    // Historical note: Opera (pre 9.5) used to negate the detail value.
  } else { // Gecko
    // Gecko returns multiple of 3 (representing the number of lines scrolled)
    detail = be.detail;

    // Gecko sometimes returns really big values if the user changes settings to
    // scroll a whole page per scroll
    if (detail > 100) {
      detail = 3;
    } else if (detail < -100) {
      detail = -3;
    }

    // Firefox 3.1 adds an axis field to the event to indicate direction of
    // scroll.  See https://developer.mozilla.org/en/Gecko-Specific_DOM_Events
    if (goog.isDef(be.axis) && be.axis === be.HORIZONTAL_AXIS) {
      deltaX = detail;
    } else {
      deltaY = detail;
    }
  }

  if (goog.isNumber(this.maxDeltaX_)) {
    deltaX = goog.math.clamp(deltaX, -this.maxDeltaX_, this.maxDeltaX_);
  }
  if (goog.isNumber(this.maxDeltaY_)) {
    deltaY = goog.math.clamp(deltaY, -this.maxDeltaY_, this.maxDeltaY_);
  }
  // Don't clamp 'detail', since it could be ambiguous which axis it refers to
  // and because it's informally deprecated anyways.

  // For horizontal scrolling we need to flip the value for RTL grids.
  if (this.isRtl_) {
    deltaX = -deltaX;
  }
  var newEvent = new goog.events.MouseWheelEvent(detail, be, deltaX, deltaY);
  this.dispatchEvent(newEvent);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for scaling down a mousewheel delta by a scale factor, if appropriate.
***REMOVED*** @param {number} mouseWheelDelta Delta from a mouse wheel event. Expected to
***REMOVED***     be an integer.
***REMOVED*** @param {number} scaleFactor Factor to scale the delta down by. Expected to
***REMOVED***     be an integer.
***REMOVED*** @return {number} Scaled-down delta value, or the original delta if the
***REMOVED***     scaleFactor does not appear to be applicable.
***REMOVED*** @private
***REMOVED***
goog.events.MouseWheelHandler.smartScale_ = function(mouseWheelDelta,
    scaleFactor) {
  // The basic problem here is that in Webkit on Mac and Linux, we can get two
  // very different types of mousewheel events: from continuous devices
  // (touchpads, Mighty Mouse) or non-continuous devices (normal wheel mice).
  //
  // Non-continuous devices in Webkit get their wheel deltas scaled up to
  // behave like IE. Continuous devices return much smaller unscaled values
  // (which most of the time will not be cleanly divisible by the IE scale
  // factor), so we should not try to normalize them down.
  //
  // Detailed discussion:
  //   https://bugs.webkit.org/show_bug.cgi?id=29601
  //   http://trac.webkit.org/browser/trunk/WebKit/chromium/src/mac/WebInputEventFactory.mm#L1063
  if (goog.userAgent.WEBKIT &&
      (goog.userAgent.MAC || goog.userAgent.LINUX) &&
      (mouseWheelDelta % scaleFactor) != 0) {
    return mouseWheelDelta;
  } else {
    return mouseWheelDelta / scaleFactor;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.MouseWheelHandler.prototype.disposeInternal = function() {
  goog.events.MouseWheelHandler.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.listenKey_);
  this.listenKey_ = null;
***REMOVED***



***REMOVED***
***REMOVED*** A base class for mouse wheel events. This is used with the
***REMOVED*** MouseWheelHandler.
***REMOVED***
***REMOVED*** @param {number} detail The number of rows the user scrolled.
***REMOVED*** @param {Event} browserEvent Browser event object.
***REMOVED*** @param {number} deltaX The number of rows the user scrolled in the X
***REMOVED***     direction.
***REMOVED*** @param {number} deltaY The number of rows the user scrolled in the Y
***REMOVED***     direction.
***REMOVED***
***REMOVED*** @extends {goog.events.BrowserEvent}
***REMOVED*** @final
***REMOVED***
goog.events.MouseWheelEvent = function(detail, browserEvent, deltaX, deltaY) {
  goog.events.BrowserEvent.call(this, browserEvent);

  this.type = goog.events.MouseWheelHandler.EventType.MOUSEWHEEL;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of lines the user scrolled
  ***REMOVED*** @type {number}
  ***REMOVED*** NOTE: Informally deprecated. Use deltaX and deltaY instead, they provide
  ***REMOVED*** more information.
 ***REMOVED*****REMOVED***
  this.detail = detail;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of "lines" scrolled in the X direction.
  ***REMOVED***
  ***REMOVED*** Note that not all browsers provide enough information to distinguish
  ***REMOVED*** horizontal and vertical scroll events, so for these unsupported browsers,
  ***REMOVED*** we will always have a deltaX of 0, even if the user scrolled their mouse
  ***REMOVED*** wheel or trackpad sideways.
  ***REMOVED***
  ***REMOVED*** Currently supported browsers are Webkit and Firefox 3.1 or later.
  ***REMOVED***
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.deltaX = deltaX;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of lines scrolled in the Y direction.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.deltaY = deltaY;
***REMOVED***
goog.inherits(goog.events.MouseWheelEvent, goog.events.BrowserEvent);
