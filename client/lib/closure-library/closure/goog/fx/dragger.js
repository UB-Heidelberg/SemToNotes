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
***REMOVED*** @fileoverview Drag Utilities.
***REMOVED***
***REMOVED*** Provides extensible functionality for drag & drop behaviour.
***REMOVED***
***REMOVED*** @see ../demos/drag.html
***REMOVED*** @see ../demos/dragger.html
***REMOVED***


goog.provide('goog.fx.DragEvent');
goog.provide('goog.fx.Dragger');
goog.provide('goog.fx.Dragger.EventType');

goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.math.Coordinate');
goog.require('goog.math.Rect');
goog.require('goog.style');
goog.require('goog.style.bidi');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A class that allows mouse or touch-based dragging (moving) of an element
***REMOVED***
***REMOVED*** @param {Element} target The element that will be dragged.
***REMOVED*** @param {Element=} opt_handle An optional handle to control the drag, if null
***REMOVED***     the target is used.
***REMOVED*** @param {goog.math.Rect=} opt_limits Object containing left, top, width,
***REMOVED***     and height.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
***REMOVED***
goog.fx.Dragger = function(target, opt_handle, opt_limits) {
  goog.events.EventTarget.call(this);
  this.target = target;
  this.handle = opt_handle || target;
  this.limits = opt_limits || new goog.math.Rect(NaN, NaN, NaN, NaN);

  this.document_ = goog.dom.getOwnerDocument(target);
  this.eventHandler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.eventHandler_);

  // Add listener. Do not use the event handler here since the event handler is
  // used for listeners added and removed during the drag operation.
***REMOVED***this.handle,
      [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN],
      this.startDrag, false, this);
***REMOVED***
goog.inherits(goog.fx.Dragger, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Whether setCapture is supported by the browser.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.HAS_SET_CAPTURE_ =
    // IE and Gecko after 1.9.3 has setCapture
    // WebKit does not yet: https://bugs.webkit.org/show_bug.cgi?id=27330
    goog.userAgent.IE ||
    goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher('1.9.3');


***REMOVED***
***REMOVED*** Creates copy of node being dragged.  This is a utility function to be used
***REMOVED*** wherever it is inappropriate for the original source to follow the mouse
***REMOVED*** cursor itself.
***REMOVED***
***REMOVED*** @param {Element} sourceEl Element to copy.
***REMOVED*** @return {!Element} The clone of {@code sourceEl}.
***REMOVED***
goog.fx.Dragger.cloneNode = function(sourceEl) {
  var clonedEl =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (sourceEl.cloneNode(true)),
      origTexts = sourceEl.getElementsByTagName('textarea'),
      dragTexts = clonedEl.getElementsByTagName('textarea');
  // Cloning does not copy the current value of textarea elements, so correct
  // this manually.
  for (var i = 0; i < origTexts.length; i++) {
    dragTexts[i].value = origTexts[i].value;
  }
  switch (sourceEl.tagName.toLowerCase()) {
    case 'tr':
      return goog.dom.createDom(
          'table', null, goog.dom.createDom('tbody', null, clonedEl));
    case 'td':
    case 'th':
      return goog.dom.createDom(
          'table', null, goog.dom.createDom('tbody', null, goog.dom.createDom(
          'tr', null, clonedEl)));
    case 'textarea':
      clonedEl.value = sourceEl.value;
    default:
      return clonedEl;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Constants for event names.
***REMOVED*** @enum {string}
***REMOVED***
goog.fx.Dragger.EventType = {
  // The drag action was canceled before the START event. Possible reasons:
  // disabled dragger, dragging with the right mouse button or releasing the
  // button before reaching the hysteresis distance.
  EARLY_CANCEL: 'earlycancel',
  START: 'start',
  BEFOREDRAG: 'beforedrag',
  DRAG: 'drag',
  END: 'end'
***REMOVED***


***REMOVED***
***REMOVED*** Reference to drag target element.
***REMOVED*** @type {Element}
***REMOVED***
goog.fx.Dragger.prototype.target;


***REMOVED***
***REMOVED*** Reference to the handler that initiates the drag.
***REMOVED*** @type {Element}
***REMOVED***
goog.fx.Dragger.prototype.handle;


***REMOVED***
***REMOVED*** Object representing the limits of the drag region.
***REMOVED*** @type {goog.math.Rect}
***REMOVED***
goog.fx.Dragger.prototype.limits;


***REMOVED***
***REMOVED*** Whether the element is rendered right-to-left. We initialize this lazily.
***REMOVED*** @type {boolean|undefined}}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.rightToLeft_;


***REMOVED***
***REMOVED*** Current x position of mouse or touch relative to viewport.
***REMOVED*** @type {number}
***REMOVED***
goog.fx.Dragger.prototype.clientX = 0;


***REMOVED***
***REMOVED*** Current y position of mouse or touch relative to viewport.
***REMOVED*** @type {number}
***REMOVED***
goog.fx.Dragger.prototype.clientY = 0;


***REMOVED***
***REMOVED*** Current x position of mouse or touch relative to screen. Deprecated because
***REMOVED*** it doesn't take into affect zoom level or pixel density.
***REMOVED*** @type {number}
***REMOVED*** @deprecated Consider switching to clientX instead.
***REMOVED***
goog.fx.Dragger.prototype.screenX = 0;


***REMOVED***
***REMOVED*** Current y position of mouse or touch relative to screen. Deprecated because
***REMOVED*** it doesn't take into affect zoom level or pixel density.
***REMOVED*** @type {number}
***REMOVED*** @deprecated Consider switching to clientY instead.
***REMOVED***
goog.fx.Dragger.prototype.screenY = 0;


***REMOVED***
***REMOVED*** The x position where the first mousedown or touchstart occurred.
***REMOVED*** @type {number}
***REMOVED***
goog.fx.Dragger.prototype.startX = 0;


***REMOVED***
***REMOVED*** The y position where the first mousedown or touchstart occurred.
***REMOVED*** @type {number}
***REMOVED***
goog.fx.Dragger.prototype.startY = 0;


***REMOVED***
***REMOVED*** Current x position of drag relative to target's parent.
***REMOVED*** @type {number}
***REMOVED***
goog.fx.Dragger.prototype.deltaX = 0;


***REMOVED***
***REMOVED*** Current y position of drag relative to target's parent.
***REMOVED*** @type {number}
***REMOVED***
goog.fx.Dragger.prototype.deltaY = 0;


***REMOVED***
***REMOVED*** The current page scroll value.
***REMOVED*** @type {goog.math.Coordinate}
***REMOVED***
goog.fx.Dragger.prototype.pageScroll;


***REMOVED***
***REMOVED*** Whether dragging is currently enabled.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.enabled_ = true;


***REMOVED***
***REMOVED*** Whether object is currently being dragged.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.dragging_ = false;


***REMOVED***
***REMOVED*** The amount of distance, in pixels, after which a mousedown or touchstart is
***REMOVED*** considered a drag.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.hysteresisDistanceSquared_ = 0;


***REMOVED***
***REMOVED*** Timestamp of when the mousedown or touchstart occurred.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.mouseDownTime_ = 0;


***REMOVED***
***REMOVED*** Reference to a document object to use for the events.
***REMOVED*** @type {Document}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.document_;


***REMOVED***
***REMOVED*** The SCROLL event target used to make drag element follow scrolling.
***REMOVED*** @type {EventTarget}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.scrollTarget_;


***REMOVED***
***REMOVED*** Whether IE drag events cancelling is on.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.ieDragStartCancellingOn_ = false;


***REMOVED***
***REMOVED*** Whether the dragger implements the changes described in http://b/6324964,
***REMOVED*** making it truly RTL.  This is a temporary flag to allow clients to transition
***REMOVED*** to the new behavior at their convenience.  At some point it will be the
***REMOVED*** default.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.useRightPositioningForRtl_ = false;


***REMOVED***
***REMOVED*** Turns on/off true RTL behavior.  This should be called immediately after
***REMOVED*** construction.  This is a temporary flag to allow clients to transition
***REMOVED*** to the new component at their convenience.  At some point true will be the
***REMOVED*** default.
***REMOVED*** @param {boolean} useRightPositioningForRtl True if "right" should be used for
***REMOVED***     positioning, false if "left" should be used for positioning.
***REMOVED***
goog.fx.Dragger.prototype.enableRightPositioningForRtl =
    function(useRightPositioningForRtl) {
  this.useRightPositioningForRtl_ = useRightPositioningForRtl;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the event handler, intended for subclass use.
***REMOVED*** @return {goog.events.EventHandler.<T>} The event handler.
***REMOVED*** @this T
***REMOVED*** @template T
***REMOVED***
goog.fx.Dragger.prototype.getHandler = function() {
  return this.eventHandler_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets (or reset) the Drag limits after a Dragger is created.
***REMOVED*** @param {goog.math.Rect?} limits Object containing left, top, width,
***REMOVED***     height for new Dragger limits. If target is right-to-left and
***REMOVED***     enableRightPositioningForRtl(true) is called, then rect is interpreted as
***REMOVED***     right, top, width, and height.
***REMOVED***
goog.fx.Dragger.prototype.setLimits = function(limits) {
  this.limits = limits || new goog.math.Rect(NaN, NaN, NaN, NaN);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the distance the user has to drag the element before a drag operation is
***REMOVED*** started.
***REMOVED*** @param {number} distance The number of pixels after which a mousedown and
***REMOVED***     move is considered a drag.
***REMOVED***
goog.fx.Dragger.prototype.setHysteresis = function(distance) {
  this.hysteresisDistanceSquared_ = Math.pow(distance, 2);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the distance the user has to drag the element before a drag operation is
***REMOVED*** started.
***REMOVED*** @return {number} distance The number of pixels after which a mousedown and
***REMOVED***     move is considered a drag.
***REMOVED***
goog.fx.Dragger.prototype.getHysteresis = function() {
  return Math.sqrt(this.hysteresisDistanceSquared_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the SCROLL event target to make drag element follow scrolling.
***REMOVED***
***REMOVED*** @param {EventTarget} scrollTarget The event target that dispatches SCROLL
***REMOVED***     events.
***REMOVED***
goog.fx.Dragger.prototype.setScrollTarget = function(scrollTarget) {
  this.scrollTarget_ = scrollTarget;
***REMOVED***


***REMOVED***
***REMOVED*** Enables cancelling of built-in IE drag events.
***REMOVED*** @param {boolean} cancelIeDragStart Whether to enable cancelling of IE
***REMOVED***     dragstart event.
***REMOVED***
goog.fx.Dragger.prototype.setCancelIeDragStart = function(cancelIeDragStart) {
  this.ieDragStartCancellingOn_ = cancelIeDragStart;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the dragger is enabled.
***REMOVED***
goog.fx.Dragger.prototype.getEnabled = function() {
  return this.enabled_;
***REMOVED***


***REMOVED***
***REMOVED*** Set whether dragger is enabled
***REMOVED*** @param {boolean} enabled Whether dragger is enabled.
***REMOVED***
goog.fx.Dragger.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.Dragger.prototype.disposeInternal = function() {
  goog.fx.Dragger.superClass_.disposeInternal.call(this);
  goog.events.unlisten(this.handle,
      [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN],
      this.startDrag, false, this);
  this.cleanUpAfterDragging_();

  this.target = null;
  this.handle = null;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the DOM element being manipulated is rendered right-to-left.
***REMOVED*** @return {boolean} True if the DOM element is rendered right-to-left, false
***REMOVED***     otherwise.
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.isRightToLeft_ = function() {
  if (!goog.isDef(this.rightToLeft_)) {
    this.rightToLeft_ = goog.style.isRightToLeft(this.target);
  }
  return this.rightToLeft_;
***REMOVED***


***REMOVED***
***REMOVED*** Event handler that is used to start the drag
***REMOVED*** @param {goog.events.BrowserEvent} e Event object.
***REMOVED***
goog.fx.Dragger.prototype.startDrag = function(e) {
  var isMouseDown = e.type == goog.events.EventType.MOUSEDOWN;

  // Dragger.startDrag() can be called by AbstractDragDrop with a mousemove
  // event and IE does not report pressed mouse buttons on mousemove. Also,
  // it does not make sense to check for the button if the user is already
  // dragging.

  if (this.enabled_ && !this.dragging_ &&
      (!isMouseDown || e.isMouseActionButton())) {
    this.maybeReinitTouchEvent_(e);
    if (this.hysteresisDistanceSquared_ == 0) {
      if (this.fireDragStart_(e)) {
        this.dragging_ = true;
        e.preventDefault();
      } else {
        // If the start drag is cancelled, don't setup for a drag.
        return;
      }
    } else {
      // Need to preventDefault for hysteresis to prevent page getting selected.
      e.preventDefault();
    }
    this.setupDragHandlers();

    this.clientX = this.startX = e.clientX;
    this.clientY = this.startY = e.clientY;
    this.screenX = e.screenX;
    this.screenY = e.screenY;
    this.computeInitialPosition();
    this.pageScroll = goog.dom.getDomHelper(this.document_).getDocumentScroll();

    this.mouseDownTime_ = goog.now();
  } else {
    this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets up event handlers when dragging starts.
***REMOVED*** @protected
***REMOVED***
goog.fx.Dragger.prototype.setupDragHandlers = function() {
  var doc = this.document_;
  var docEl = doc.documentElement;
  // Use bubbling when we have setCapture since we got reports that IE has
  // problems with the capturing events in combination with setCapture.
  var useCapture = !goog.fx.Dragger.HAS_SET_CAPTURE_;

  this.eventHandler_.listen(doc,
      [goog.events.EventType.TOUCHMOVE, goog.events.EventType.MOUSEMOVE],
      this.handleMove_, useCapture);
  this.eventHandler_.listen(doc,
      [goog.events.EventType.TOUCHEND, goog.events.EventType.MOUSEUP],
      this.endDrag, useCapture);

  if (goog.fx.Dragger.HAS_SET_CAPTURE_) {
    docEl.setCapture(false);
    this.eventHandler_.listen(docEl,
                              goog.events.EventType.LOSECAPTURE,
                              this.endDrag);
  } else {
    // Make sure we stop the dragging if the window loses focus.
    // Don't use capture in this listener because we only want to end the drag
    // if the actual window loses focus. Since blur events do not bubble we use
    // a bubbling listener on the window.
    this.eventHandler_.listen(goog.dom.getWindow(doc),
                              goog.events.EventType.BLUR,
                              this.endDrag);
  }

  if (goog.userAgent.IE && this.ieDragStartCancellingOn_) {
    // Cancel IE's 'ondragstart' event.
    this.eventHandler_.listen(doc, goog.events.EventType.DRAGSTART,
                              goog.events.Event.preventDefault);
  }

  if (this.scrollTarget_) {
    this.eventHandler_.listen(this.scrollTarget_, goog.events.EventType.SCROLL,
                              this.onScroll_, useCapture);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Fires a goog.fx.Dragger.EventType.START event.
***REMOVED*** @param {goog.events.BrowserEvent} e Browser event that triggered the drag.
***REMOVED*** @return {boolean} False iff preventDefault was called on the DragEvent.
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.fireDragStart_ = function(e) {
  return this.dispatchEvent(new goog.fx.DragEvent(
      goog.fx.Dragger.EventType.START, this, e.clientX, e.clientY, e));
***REMOVED***


***REMOVED***
***REMOVED*** Unregisters the event handlers that are only active during dragging, and
***REMOVED*** releases mouse capture.
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.cleanUpAfterDragging_ = function() {
  this.eventHandler_.removeAll();
  if (goog.fx.Dragger.HAS_SET_CAPTURE_) {
    this.document_.releaseCapture();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event handler that is used to end the drag.
***REMOVED*** @param {goog.events.BrowserEvent} e Event object.
***REMOVED*** @param {boolean=} opt_dragCanceled Whether the drag has been canceled.
***REMOVED***
goog.fx.Dragger.prototype.endDrag = function(e, opt_dragCanceled) {
  this.cleanUpAfterDragging_();

  if (this.dragging_) {
    this.maybeReinitTouchEvent_(e);
    this.dragging_ = false;

    var x = this.limitX(this.deltaX);
    var y = this.limitY(this.deltaY);
    var dragCanceled = opt_dragCanceled ||
        e.type == goog.events.EventType.TOUCHCANCEL;
    this.dispatchEvent(new goog.fx.DragEvent(
        goog.fx.Dragger.EventType.END, this, e.clientX, e.clientY, e, x, y,
        dragCanceled));
  } else {
    this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event handler that is used to end the drag by cancelling it.
***REMOVED*** @param {goog.events.BrowserEvent} e Event object.
***REMOVED***
goog.fx.Dragger.prototype.endDragCancel = function(e) {
  this.endDrag(e, true);
***REMOVED***


***REMOVED***
***REMOVED*** Re-initializes the event with the first target touch event or, in the case
***REMOVED*** of a stop event, the last changed touch.
***REMOVED*** @param {goog.events.BrowserEvent} e A TOUCH... event.
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.maybeReinitTouchEvent_ = function(e) {
  var type = e.type;

  if (type == goog.events.EventType.TOUCHSTART ||
      type == goog.events.EventType.TOUCHMOVE) {
    e.init(e.getBrowserEvent().targetTouches[0], e.currentTarget);
  } else if (type == goog.events.EventType.TOUCHEND ||
             type == goog.events.EventType.TOUCHCANCEL) {
    e.init(e.getBrowserEvent().changedTouches[0], e.currentTarget);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event handler that is used on mouse / touch move to update the drag
***REMOVED*** @param {goog.events.BrowserEvent} e Event object.
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.handleMove_ = function(e) {
  if (this.enabled_) {
    this.maybeReinitTouchEvent_(e);
    // dx in right-to-left cases is relative to the right.
    var sign = this.useRightPositioningForRtl_ &&
        this.isRightToLeft_() ? -1 : 1;
    var dx = sign***REMOVED*** (e.clientX - this.clientX);
    var dy = e.clientY - this.clientY;
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.screenX = e.screenX;
    this.screenY = e.screenY;

    if (!this.dragging_) {
      var diffX = this.startX - this.clientX;
      var diffY = this.startY - this.clientY;
      var distance = diffX***REMOVED*** diffX + diffY***REMOVED*** diffY;
      if (distance > this.hysteresisDistanceSquared_) {
        if (this.fireDragStart_(e)) {
          this.dragging_ = true;
        } else {
          // DragListGroup disposes of the dragger if BEFOREDRAGSTART is
          // canceled.
          if (!this.isDisposed()) {
            this.endDrag(e);
          }
          return;
        }
      }
    }

    var pos = this.calculatePosition_(dx, dy);
    var x = pos.x;
    var y = pos.y;

    if (this.dragging_) {

      var rv = this.dispatchEvent(new goog.fx.DragEvent(
          goog.fx.Dragger.EventType.BEFOREDRAG, this, e.clientX, e.clientY,
          e, x, y));

      // Only do the defaultAction and dispatch drag event if predrag didn't
      // prevent default
      if (rv) {
        this.doDrag(e, x, y, false);
        e.preventDefault();
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the drag position.
***REMOVED***
***REMOVED*** @param {number} dx The horizontal movement delta.
***REMOVED*** @param {number} dy The vertical movement delta.
***REMOVED*** @return {!goog.math.Coordinate} The newly calculated drag element position.
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.calculatePosition_ = function(dx, dy) {
  // Update the position for any change in body scrolling
  var pageScroll = goog.dom.getDomHelper(this.document_).getDocumentScroll();
  dx += pageScroll.x - this.pageScroll.x;
  dy += pageScroll.y - this.pageScroll.y;
  this.pageScroll = pageScroll;

  this.deltaX += dx;
  this.deltaY += dy;

  var x = this.limitX(this.deltaX);
  var y = this.limitY(this.deltaY);
  return new goog.math.Coordinate(x, y);
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for scroll target scrolling.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.fx.Dragger.prototype.onScroll_ = function(e) {
  var pos = this.calculatePosition_(0, 0);
  e.clientX = this.clientX;
  e.clientY = this.clientY;
  this.doDrag(e, pos.x, pos.y, true);
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The closure object
***REMOVED***     representing the browser event that caused a drag event.
***REMOVED*** @param {number} x The new horizontal position for the drag element.
***REMOVED*** @param {number} y The new vertical position for the drag element.
***REMOVED*** @param {boolean} dragFromScroll Whether dragging was caused by scrolling
***REMOVED***     the associated scroll target.
***REMOVED*** @protected
***REMOVED***
goog.fx.Dragger.prototype.doDrag = function(e, x, y, dragFromScroll) {
  this.defaultAction(x, y);
  this.dispatchEvent(new goog.fx.DragEvent(
      goog.fx.Dragger.EventType.DRAG, this, e.clientX, e.clientY, e, x, y));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the 'real' x after limits are applied (allows for some
***REMOVED*** limits to be undefined).
***REMOVED*** @param {number} x X-coordinate to limit.
***REMOVED*** @return {number} The 'real' X-coordinate after limits are applied.
***REMOVED***
goog.fx.Dragger.prototype.limitX = function(x) {
  var rect = this.limits;
  var left = !isNaN(rect.left) ? rect.left : null;
  var width = !isNaN(rect.width) ? rect.width : 0;
  var maxX = left != null ? left + width : Infinity;
  var minX = left != null ? left : -Infinity;
  return Math.min(maxX, Math.max(minX, x));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the 'real' y after limits are applied (allows for some
***REMOVED*** limits to be undefined).
***REMOVED*** @param {number} y Y-coordinate to limit.
***REMOVED*** @return {number} The 'real' Y-coordinate after limits are applied.
***REMOVED***
goog.fx.Dragger.prototype.limitY = function(y) {
  var rect = this.limits;
  var top = !isNaN(rect.top) ? rect.top : null;
  var height = !isNaN(rect.height) ? rect.height : 0;
  var maxY = top != null ? top + height : Infinity;
  var minY = top != null ? top : -Infinity;
  return Math.min(maxY, Math.max(minY, y));
***REMOVED***


***REMOVED***
***REMOVED*** Overridable function for computing the initial position of the target
***REMOVED*** before dragging begins.
***REMOVED*** @protected
***REMOVED***
goog.fx.Dragger.prototype.computeInitialPosition = function() {
  this.deltaX = this.useRightPositioningForRtl_ ?
      goog.style.bidi.getOffsetStart(this.target) : this.target.offsetLeft;
  this.deltaY = this.target.offsetTop;
***REMOVED***


***REMOVED***
***REMOVED*** Overridable function for handling the default action of the drag behaviour.
***REMOVED*** Normally this is simply moving the element to x,y though in some cases it
***REMOVED*** might be used to resize the layer.  This is basically a shortcut to
***REMOVED*** implementing a default ondrag event handler.
***REMOVED*** @param {number} x X-coordinate for target element. In right-to-left, x this
***REMOVED***     is the number of pixels the target should be moved to from the right.
***REMOVED*** @param {number} y Y-coordinate for target element.
***REMOVED***
goog.fx.Dragger.prototype.defaultAction = function(x, y) {
  if (this.useRightPositioningForRtl_ && this.isRightToLeft_()) {
    this.target.style.right = x + 'px';
  } else {
    this.target.style.left = x + 'px';
  }
  this.target.style.top = y + 'px';
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the dragger is currently in the midst of a drag.
***REMOVED***
goog.fx.Dragger.prototype.isDragging = function() {
  return this.dragging_;
***REMOVED***



***REMOVED***
***REMOVED*** Object representing a drag event
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {goog.fx.Dragger} dragobj Drag object initiating event.
***REMOVED*** @param {number} clientX X-coordinate relative to the viewport.
***REMOVED*** @param {number} clientY Y-coordinate relative to the viewport.
***REMOVED*** @param {goog.events.BrowserEvent} browserEvent The closure object
***REMOVED***   representing the browser event that caused this drag event.
***REMOVED*** @param {number=} opt_actX Optional actual x for drag if it has been limited.
***REMOVED*** @param {number=} opt_actY Optional actual y for drag if it has been limited.
***REMOVED*** @param {boolean=} opt_dragCanceled Whether the drag has been canceled.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.fx.DragEvent = function(type, dragobj, clientX, clientY, browserEvent,
                             opt_actX, opt_actY, opt_dragCanceled) {
  goog.events.Event.call(this, type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** X-coordinate relative to the viewport
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.clientX = clientX;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Y-coordinate relative to the viewport
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.clientY = clientY;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The closure object representing the browser event that caused this drag
  ***REMOVED*** event.
  ***REMOVED*** @type {goog.events.BrowserEvent}
 ***REMOVED*****REMOVED***
  this.browserEvent = browserEvent;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The real x-position of the drag if it has been limited
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.left = goog.isDef(opt_actX) ? opt_actX : dragobj.deltaX;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The real y-position of the drag if it has been limited
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.top = goog.isDef(opt_actY) ? opt_actY : dragobj.deltaY;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to the drag object for this event
  ***REMOVED*** @type {goog.fx.Dragger}
 ***REMOVED*****REMOVED***
  this.dragger = dragobj;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether drag was canceled with this event. Used to differentiate between
  ***REMOVED*** a legitimate drag END that can result in an action and a drag END which is
  ***REMOVED*** a result of a drag cancelation. For now it can happen 1) with drag END
  ***REMOVED*** event on FireFox when user drags the mouse out of the window, 2) with
  ***REMOVED*** drag END event on IE7 which is generated on MOUSEMOVE event when user
  ***REMOVED*** moves the mouse into the document after the mouse button has been
  ***REMOVED*** released, 3) when TOUCHCANCEL is raised instead of TOUCHEND (on touch
  ***REMOVED*** events).
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.dragCanceled = !!opt_dragCanceled;
***REMOVED***
goog.inherits(goog.fx.DragEvent, goog.events.Event);
