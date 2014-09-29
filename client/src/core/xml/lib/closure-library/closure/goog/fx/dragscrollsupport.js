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
***REMOVED*** @fileoverview Class to support scrollable containers for drag and drop.
***REMOVED***
***REMOVED***

goog.provide('goog.fx.DragScrollSupport');

goog.require('goog.Disposable');
goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.math.Coordinate');
goog.require('goog.style');



***REMOVED***
***REMOVED*** A scroll support class. Currently this class will automatically scroll
***REMOVED*** a scrollable container node and scroll it by a fixed amount at a timed
***REMOVED*** interval when the mouse is moved above or below the container or in vertical
***REMOVED*** margin areas. Intended for use in drag and drop. This could potentially be
***REMOVED*** made more general and could support horizontal scrolling.
***REMOVED***
***REMOVED*** @param {Element} containerNode A container that can be scrolled.
***REMOVED*** @param {number=} opt_margin Optional margin to use while scrolling.
***REMOVED*** @param {boolean=} opt_externalMouseMoveTracking Whether mouse move events
***REMOVED***     are tracked externally by the client object which calls the mouse move
***REMOVED***     event handler, useful when events are generated for more than one source
***REMOVED***     element and/or are not real mousemove events.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @see ../demos/dragscrollsupport.html
***REMOVED***
goog.fx.DragScrollSupport = function(containerNode, opt_margin,
                                     opt_externalMouseMoveTracking) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The container to be scrolled.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.containerNode_ = containerNode;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Scroll timer that will scroll the container until it is stopped.
  ***REMOVED*** It will scroll when the mouse is outside the scrolling area of the
  ***REMOVED*** container.
  ***REMOVED***
  ***REMOVED*** @type {goog.Timer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.scrollTimer_ = new goog.Timer(goog.fx.DragScrollSupport.TIMER_STEP_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** EventHandler used to set up and tear down listeners.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current scroll delta.
  ***REMOVED*** @type {goog.math.Coordinate}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.scrollDelta_ = new goog.math.Coordinate();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The container bounds.
  ***REMOVED*** @type {goog.math.Rect}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.containerBounds_ = goog.style.getBounds(containerNode);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The margin for triggering a scroll.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.margin_ = opt_margin || 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The bounding rectangle which if left triggers scrolling.
  ***REMOVED*** @type {goog.math.Rect}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.scrollBounds_ = opt_margin ?
      this.constrainBounds_(this.containerBounds_.clone()) :
      this.containerBounds_;

  this.setupListeners_(!!opt_externalMouseMoveTracking);
***REMOVED***
goog.inherits(goog.fx.DragScrollSupport, goog.Disposable);


***REMOVED***
***REMOVED*** The scroll timer step in ms.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.fx.DragScrollSupport.TIMER_STEP_ = 50;


***REMOVED***
***REMOVED*** The scroll step in pixels.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.fx.DragScrollSupport.SCROLL_STEP_ = 8;


***REMOVED***
***REMOVED*** The suggested scrolling margin.
***REMOVED*** @type {number}
***REMOVED***
goog.fx.DragScrollSupport.MARGIN = 32;


***REMOVED***
***REMOVED*** Whether scrolling should be constrained to happen only when the cursor is
***REMOVED*** inside the container node.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.DragScrollSupport.prototype.constrainScroll_ = false;


***REMOVED***
***REMOVED*** Whether horizontal scrolling is allowed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.DragScrollSupport.prototype.horizontalScrolling_ = true;


***REMOVED***
***REMOVED*** Sets whether scrolling should be constrained to happen only when the cursor
***REMOVED*** is inside the container node.
***REMOVED*** NOTE: If a margin is not set, then it does not make sense to
***REMOVED*** contain the scroll, because in that case scroll will never be triggered.
***REMOVED*** @param {boolean} constrain Whether scrolling should be constrained to happen
***REMOVED***     only when the cursor is inside the container node.
***REMOVED***
goog.fx.DragScrollSupport.prototype.setConstrainScroll = function(constrain) {
  this.constrainScroll_ = !!this.margin_ && constrain;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether horizontal scrolling is allowed.
***REMOVED*** @param {boolean} scrolling Whether horizontal scrolling is allowed.
***REMOVED***
goog.fx.DragScrollSupport.prototype.setHorizontalScrolling =
    function(scrolling) {
  this.horizontalScrolling_ = scrolling;
***REMOVED***


***REMOVED***
***REMOVED*** Constrains the container bounds with respect to the margin.
***REMOVED***
***REMOVED*** @param {goog.math.Rect} bounds The container element.
***REMOVED*** @return {goog.math.Rect} The bounding rectangle used to calculate scrolling
***REMOVED***     direction.
***REMOVED*** @private
***REMOVED***
goog.fx.DragScrollSupport.prototype.constrainBounds_ = function(bounds) {
  var margin = this.margin_;
  if (margin) {
    var quarterHeight = bounds.height***REMOVED*** 0.25;
    var yMargin = Math.min(margin, quarterHeight);
    bounds.top += yMargin;
    bounds.height -= 2***REMOVED*** yMargin;

    var quarterWidth = bounds.width***REMOVED*** 0.25;
    var xMargin = Math.min(margin, quarterWidth);
    bounds.top += xMargin;
    bounds.height -= 2***REMOVED*** xMargin;
  }
  return bounds;
***REMOVED***


***REMOVED***
***REMOVED*** Attaches listeners and activates automatic scrolling.
***REMOVED*** @param {boolean} externalMouseMoveTracking Whether to enable internal
***REMOVED***     mouse move event handling.
***REMOVED*** @private
***REMOVED***
goog.fx.DragScrollSupport.prototype.setupListeners_ = function(
    externalMouseMoveTracking) {
  if (!externalMouseMoveTracking) {
    // Track mouse pointer position to determine scroll direction.
    this.eventHandler_.listen(goog.dom.getOwnerDocument(this.containerNode_),
        goog.events.EventType.MOUSEMOVE, this.onMouseMove);
  }

  // Scroll with a constant speed.
  this.eventHandler_.listen(this.scrollTimer_, goog.Timer.TICK, this.onTick_);
***REMOVED***


***REMOVED***
***REMOVED*** Handler for timer tick event, scrolls the container by one scroll step if
***REMOVED*** needed.
***REMOVED*** @param {goog.events.Event} event Timer tick event.
***REMOVED*** @private
***REMOVED***
goog.fx.DragScrollSupport.prototype.onTick_ = function(event) {
  this.containerNode_.scrollTop += this.scrollDelta_.y;
  this.containerNode_.scrollLeft += this.scrollDelta_.x;
***REMOVED***


***REMOVED***
***REMOVED*** Handler for mouse moves events.
***REMOVED*** @param {goog.events.Event} event Mouse move event.
***REMOVED***
goog.fx.DragScrollSupport.prototype.onMouseMove = function(event) {
  var deltaX = this.horizontalScrolling_ ? this.calculateScrollDelta(
      event.clientX, this.scrollBounds_.left, this.scrollBounds_.width) : 0;
  var deltaY = this.calculateScrollDelta(event.clientY,
      this.scrollBounds_.top, this.scrollBounds_.height);
  this.scrollDelta_.x = deltaX;
  this.scrollDelta_.y = deltaY;

  // If the scroll data is 0 or the event fired outside of the
  // bounds of the container node.
  if ((!deltaX && !deltaY) ||
      (this.constrainScroll_ &&
       !this.isInContainerBounds_(event.clientX, event.clientY))) {
    this.scrollTimer_.stop();
  } else if (!this.scrollTimer_.enabled) {
    this.scrollTimer_.start();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether the input coordinate is in the container bounds.
***REMOVED*** @param {number} x The x coordinate.
***REMOVED*** @param {number} y The y coordinate.
***REMOVED*** @return {boolean} Whether the input coordinate is in the container bounds.
***REMOVED*** @private
***REMOVED***
goog.fx.DragScrollSupport.prototype.isInContainerBounds_ = function(x, y) {
  var containerBounds = this.containerBounds_;
  return containerBounds.left <= x &&
         containerBounds.left + containerBounds.width >= x &&
         containerBounds.top <= y &&
         containerBounds.top + containerBounds.height >= y;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates scroll delta.
***REMOVED***
***REMOVED*** @param {number} coordinate Current mouse pointer coordinate.
***REMOVED*** @param {number} min The coordinate value below which scrolling up should be
***REMOVED***     started.
***REMOVED*** @param {number} rangeLength The length of the range in which scrolling should
***REMOVED***     be disabled and above which scrolling down should be started.
***REMOVED*** @return {number} The calculated scroll delta.
***REMOVED*** @protected
***REMOVED***
goog.fx.DragScrollSupport.prototype.calculateScrollDelta = function(
    coordinate, min, rangeLength) {
  var delta = 0;
  if (coordinate < min) {
    delta = -goog.fx.DragScrollSupport.SCROLL_STEP_;
  } else if (coordinate > min + rangeLength) {
    delta = goog.fx.DragScrollSupport.SCROLL_STEP_;
  }
  return delta;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.DragScrollSupport.prototype.disposeInternal = function() {
  goog.fx.DragScrollSupport.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
  this.scrollTimer_.dispose();
***REMOVED***
