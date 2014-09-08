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
***REMOVED*** @fileoverview Implementation of a basic slider control.
***REMOVED***
***REMOVED*** Models a control that allows to select a sub-range within a given
***REMOVED*** range of values using two thumbs.  The underlying range is modeled
***REMOVED*** as a range model, where the min thumb points to value of the
***REMOVED*** rangemodel, and the max thumb points to value + extent of the range
***REMOVED*** model.
***REMOVED***
***REMOVED*** The currently selected range is exposed through methods
***REMOVED*** getValue() and getExtent().
***REMOVED***
***REMOVED*** The reason for modelling the basic slider state as value + extent is
***REMOVED*** to be able to capture both, a two-thumb slider to select a range, and
***REMOVED*** a single-thumb slider to just select a value (in the latter case, extent
***REMOVED*** is always zero). We provide subclasses (twothumbslider.js and slider.js)
***REMOVED*** that model those special cases of this control.
***REMOVED***
***REMOVED*** All rendering logic is left out, so that the subclasses can define
***REMOVED*** their own rendering. To do so, the subclasses overwrite:
***REMOVED*** - createDom
***REMOVED*** - decorateInternal
***REMOVED*** - getCssClass
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author reto@google.com (Reto Strobl)
***REMOVED***

goog.provide('goog.ui.SliderBase');
goog.provide('goog.ui.SliderBase.AnimationFactory');
goog.provide('goog.ui.SliderBase.Orientation');

goog.require('goog.Timer');
goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
***REMOVED***
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.functions');
goog.require('goog.fx.AnimationParallelQueue');
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Transition');
goog.require('goog.fx.dom.ResizeHeight');
goog.require('goog.fx.dom.ResizeWidth');
goog.require('goog.fx.dom.Slide');
goog.require('goog.math');
goog.require('goog.math.Coordinate');
goog.require('goog.style');
goog.require('goog.style.bidi');
goog.require('goog.ui.Component');
goog.require('goog.ui.RangeModel');



***REMOVED***
***REMOVED*** This creates a SliderBase object.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {(function(number):?string)=} opt_labelFn An optional function mapping
***REMOVED***     slider values to a description of the value.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.SliderBase = function(opt_domHelper, opt_labelFn) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The factory to use to generate additional animations when animating to a
  ***REMOVED*** new value.
  ***REMOVED*** @type {goog.ui.SliderBase.AnimationFactory}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.additionalAnimations_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The model for the range of the slider.
  ***REMOVED*** @type {!goog.ui.RangeModel}
 ***REMOVED*****REMOVED***
  this.rangeModel = new goog.ui.RangeModel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A function mapping slider values to text description.
  ***REMOVED*** @private {function(number):?string}
 ***REMOVED*****REMOVED***
  this.labelFn_ = opt_labelFn || goog.functions.NULL;

  // Don't use getHandler because it gets cleared in exitDocument.
***REMOVED***this.rangeModel, goog.ui.Component.EventType.CHANGE,
      this.handleRangeModelChange, false, this);
***REMOVED***
goog.inherits(goog.ui.SliderBase, goog.ui.Component);


***REMOVED***
***REMOVED*** Event types used to listen for dragging events. Note that extent drag events
***REMOVED*** are also sent for single-thumb sliders, since the one thumb controls both
***REMOVED*** value and extent together; in this case, they can simply be ignored.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.SliderBase.EventType = {
 ***REMOVED*****REMOVED*** User started dragging the value thumb***REMOVED***
  DRAG_VALUE_START: goog.events.getUniqueId('dragvaluestart'),
 ***REMOVED*****REMOVED*** User is done dragging the value thumb***REMOVED***
  DRAG_VALUE_END: goog.events.getUniqueId('dragvalueend'),
 ***REMOVED*****REMOVED*** User started dragging the extent thumb***REMOVED***
  DRAG_EXTENT_START: goog.events.getUniqueId('dragextentstart'),
 ***REMOVED*****REMOVED*** User is done dragging the extent thumb***REMOVED***
  DRAG_EXTENT_END: goog.events.getUniqueId('dragextentend'),
  // Note that the following two events are sent twice, once for the value
  // dragger, and once of the extent dragger. If you need to differentiate
  // between the two, or if your code relies on receiving a single event per
  // START/END event, it should listen to one of the VALUE/EXTENT-specific
  // events.
 ***REMOVED*****REMOVED*** User started dragging a thumb***REMOVED***
  DRAG_START: goog.events.getUniqueId('dragstart'),
 ***REMOVED*****REMOVED*** User is done dragging a thumb***REMOVED***
  DRAG_END: goog.events.getUniqueId('dragend')
***REMOVED***


***REMOVED***
***REMOVED*** Enum for representing the orientation of the slider.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.SliderBase.Orientation = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
***REMOVED***


***REMOVED***
***REMOVED*** Orientation of the slider.
***REMOVED*** @type {goog.ui.SliderBase.Orientation}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.orientation_ =
    goog.ui.SliderBase.Orientation.HORIZONTAL;


***REMOVED***
***REMOVED*** When the user holds down the mouse on the slider background, the closest
***REMOVED*** thumb will move in "lock-step" towards the mouse. This number indicates how
***REMOVED*** long each step should take (in milliseconds).
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.MOUSE_DOWN_INCREMENT_INTERVAL_ = 200;


***REMOVED***
***REMOVED*** How long the animations should take (in milliseconds).
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.ANIMATION_INTERVAL_ = 100;


***REMOVED***
***REMOVED*** The underlying range model
***REMOVED*** @type {goog.ui.RangeModel}
***REMOVED*** @protected
***REMOVED***
goog.ui.SliderBase.prototype.rangeModel;


***REMOVED***
***REMOVED*** The minThumb dom-element, pointing to the start of the selected range.
***REMOVED*** @type {HTMLDivElement}
***REMOVED*** @protected
***REMOVED***
goog.ui.SliderBase.prototype.valueThumb;


***REMOVED***
***REMOVED*** The maxThumb dom-element, pointing to the end of the selected range.
***REMOVED*** @type {HTMLDivElement}
***REMOVED*** @protected
***REMOVED***
goog.ui.SliderBase.prototype.extentThumb;


***REMOVED***
***REMOVED*** The dom-element highlighting the selected range.
***REMOVED*** @type {HTMLDivElement}
***REMOVED*** @protected
***REMOVED***
goog.ui.SliderBase.prototype.rangeHighlight;


***REMOVED***
***REMOVED*** The thumb that we should be moving (only relevant when timed move is active).
***REMOVED*** @type {HTMLDivElement}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.thumbToMove_;


***REMOVED***
***REMOVED*** The object handling keyboard events.
***REMOVED*** @type {goog.events.KeyHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.keyHandler_;


***REMOVED***
***REMOVED*** The object handling mouse wheel events.
***REMOVED*** @type {goog.events.MouseWheelHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.mouseWheelHandler_;


***REMOVED***
***REMOVED*** The Dragger for dragging the valueThumb.
***REMOVED*** @type {goog.fx.Dragger}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.valueDragger_;


***REMOVED***
***REMOVED*** The Dragger for dragging the extentThumb.
***REMOVED*** @type {goog.fx.Dragger}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.extentDragger_;


***REMOVED***
***REMOVED*** If we are currently animating the thumb.
***REMOVED*** @private
***REMOVED*** @type {boolean}
***REMOVED***
goog.ui.SliderBase.prototype.isAnimating_ = false;


***REMOVED***
***REMOVED*** Whether clicking on the backgtround should move directly to that point.
***REMOVED*** @private
***REMOVED*** @type {boolean}
***REMOVED***
goog.ui.SliderBase.prototype.moveToPointEnabled_ = false;


***REMOVED***
***REMOVED*** The amount to increment/decrement for page up/down as well as when holding
***REMOVED*** down the mouse button on the background.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.ui.SliderBase.prototype.blockIncrement_ = 10;


***REMOVED***
***REMOVED*** The minimal extent. The class will ensure that the extent cannot shrink
***REMOVED*** to a value smaller than minExtent.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.ui.SliderBase.prototype.minExtent_ = 0;


***REMOVED***
***REMOVED*** Whether the slider should handle mouse wheel events.
***REMOVED*** @private
***REMOVED*** @type {boolean}
***REMOVED***
goog.ui.SliderBase.prototype.isHandleMouseWheel_ = true;


***REMOVED***
***REMOVED*** The time the last mousedown event was received.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.ui.SliderBase.prototype.mouseDownTime_ = 0;


***REMOVED***
***REMOVED*** The delay after mouseDownTime_ during which a click event is ignored.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED*** @const
***REMOVED***
goog.ui.SliderBase.prototype.MOUSE_DOWN_DELAY_ = 1000;


***REMOVED***
***REMOVED*** Whether the slider is enabled or not.
***REMOVED*** @private
***REMOVED*** @type {boolean}
***REMOVED***
goog.ui.SliderBase.prototype.enabled_ = true;


***REMOVED***
***REMOVED*** Whether the slider implements the changes described in http://b/6324964,
***REMOVED*** making it truly RTL.  This is a temporary flag to allow clients to transition
***REMOVED*** to the new behavior at their convenience.  At some point it will be the
***REMOVED*** default.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.flipForRtl_ = false;


***REMOVED***
***REMOVED*** Enables/disables true RTL behavior.  This should be called immediately after
***REMOVED*** construction.  This is a temporary flag to allow clients to transition
***REMOVED*** to the new behavior at their convenience.  At some point it will be the
***REMOVED*** default.
***REMOVED*** @param {boolean} flipForRtl True if the slider should be flipped for RTL,
***REMOVED***     false otherwise.
***REMOVED***
goog.ui.SliderBase.prototype.enableFlipForRtl = function(flipForRtl) {
  this.flipForRtl_ = flipForRtl;
***REMOVED***


// TODO: Make this return a base CSS class (without orientation), in subclasses.
***REMOVED***
***REMOVED*** Returns the CSS class applied to the slider element for the given
***REMOVED*** orientation. Subclasses must override this method.
***REMOVED*** @param {goog.ui.SliderBase.Orientation} orient The orientation.
***REMOVED*** @return {string} The CSS class applied to slider elements.
***REMOVED*** @protected
***REMOVED***
goog.ui.SliderBase.prototype.getCssClass = goog.abstractMethod;


***REMOVED*** @override***REMOVED***
goog.ui.SliderBase.prototype.createDom = function() {
  goog.ui.SliderBase.superClass_.createDom.call(this);
  var element =
      this.getDomHelper().createDom('div', this.getCssClass(this.orientation_));
  this.decorateInternal(element);
***REMOVED***


***REMOVED***
***REMOVED*** Subclasses must implement this method and set the valueThumb and
***REMOVED*** extentThumb to non-null values. They can also set the rangeHighlight
***REMOVED*** element if a range highlight is desired.
***REMOVED*** @type {function() : void}
***REMOVED*** @protected
***REMOVED***
goog.ui.SliderBase.prototype.createThumbs = goog.abstractMethod;


***REMOVED***
***REMOVED*** CSS class name applied to the slider while its thumbs are being dragged.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.SLIDER_DRAGGING_CSS_CLASS_ =
    goog.getCssName('goog-slider-dragging');


***REMOVED***
***REMOVED*** CSS class name applied to a thumb while it's being dragged.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.THUMB_DRAGGING_CSS_CLASS_ =
    goog.getCssName('goog-slider-thumb-dragging');


***REMOVED***
***REMOVED*** CSS class name applied when the slider is disabled.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.DISABLED_CSS_CLASS_ =
    goog.getCssName('goog-slider-disabled');


***REMOVED*** @override***REMOVED***
goog.ui.SliderBase.prototype.decorateInternal = function(element) {
  goog.ui.SliderBase.superClass_.decorateInternal.call(this, element);
  goog.asserts.assert(element);
  goog.dom.classlist.add(element, this.getCssClass(this.orientation_));
  this.createThumbs();
  this.setAriaRoles();
***REMOVED***


***REMOVED***
***REMOVED*** Called when the DOM for the component is for sure in the document.
***REMOVED*** Subclasses should override this method to set this element's role.
***REMOVED*** @override
***REMOVED***
goog.ui.SliderBase.prototype.enterDocument = function() {
  goog.ui.SliderBase.superClass_.enterDocument.call(this);

  // Attach the events
  this.valueDragger_ = new goog.fx.Dragger(this.valueThumb);
  this.extentDragger_ = new goog.fx.Dragger(this.extentThumb);
  this.valueDragger_.enableRightPositioningForRtl(this.flipForRtl_);
  this.extentDragger_.enableRightPositioningForRtl(this.flipForRtl_);

  // The slider is handling the positioning so make the defaultActions empty.
  this.valueDragger_.defaultAction = this.extentDragger_.defaultAction =
      goog.nullFunction;
  this.keyHandler_ = new goog.events.KeyHandler(this.getElement());
  this.enableEventHandlers_(true);

  this.getElement().tabIndex = 0;
  this.updateUi_();
***REMOVED***


***REMOVED***
***REMOVED*** Attaches/Detaches the event handlers on the slider.
***REMOVED*** @param {boolean} enable Whether to attach or detach the event handlers.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.enableEventHandlers_ = function(enable) {
  if (enable) {
    this.getHandler().
        listen(this.valueDragger_, goog.fx.Dragger.EventType.BEFOREDRAG,
            this.handleBeforeDrag_).
        listen(this.extentDragger_, goog.fx.Dragger.EventType.BEFOREDRAG,
            this.handleBeforeDrag_).
        listen(this.valueDragger_,
            [goog.fx.Dragger.EventType.START, goog.fx.Dragger.EventType.END],
            this.handleThumbDragStartEnd_).
        listen(this.extentDragger_,
            [goog.fx.Dragger.EventType.START, goog.fx.Dragger.EventType.END],
            this.handleThumbDragStartEnd_).
        listen(this.keyHandler_, goog.events.KeyHandler.EventType.KEY,
            this.handleKeyDown_).
        listen(this.getElement(), goog.events.EventType.CLICK,
            this.handleMouseDownAndClick_).
        listen(this.getElement(), goog.events.EventType.MOUSEDOWN,
            this.handleMouseDownAndClick_);
    if (this.isHandleMouseWheel()) {
      this.enableMouseWheelHandling_(true);
    }
  } else {
    this.getHandler().
        unlisten(this.valueDragger_, goog.fx.Dragger.EventType.BEFOREDRAG,
            this.handleBeforeDrag_).
        unlisten(this.extentDragger_, goog.fx.Dragger.EventType.BEFOREDRAG,
            this.handleBeforeDrag_).
        unlisten(this.valueDragger_,
            [goog.fx.Dragger.EventType.START, goog.fx.Dragger.EventType.END],
            this.handleThumbDragStartEnd_).
        unlisten(this.extentDragger_,
            [goog.fx.Dragger.EventType.START, goog.fx.Dragger.EventType.END],
            this.handleThumbDragStartEnd_).
        unlisten(this.keyHandler_, goog.events.KeyHandler.EventType.KEY,
            this.handleKeyDown_).
        unlisten(this.getElement(), goog.events.EventType.CLICK,
            this.handleMouseDownAndClick_).
        unlisten(this.getElement(), goog.events.EventType.MOUSEDOWN,
            this.handleMouseDownAndClick_);
    if (this.isHandleMouseWheel()) {
      this.enableMouseWheelHandling_(false);
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SliderBase.prototype.exitDocument = function() {
  goog.ui.SliderBase.base(this, 'exitDocument');
  goog.disposeAll(this.valueDragger_, this.extentDragger_, this.keyHandler_,
                  this.mouseWheelHandler_);
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the before drag event. We use the event properties to determine
***REMOVED*** the new value.
***REMOVED*** @param {goog.fx.DragEvent} e  The drag event used to drag the thumb.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.handleBeforeDrag_ = function(e) {
  var thumbToDrag = e.dragger == this.valueDragger_ ?
      this.valueThumb : this.extentThumb;
  var value;
  if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
    var availHeight = this.getElement().clientHeight - thumbToDrag.offsetHeight;
    value = (availHeight - e.top) / availHeight***REMOVED***
        (this.getMaximum() - this.getMinimum()) + this.getMinimum();
  } else {
    var availWidth = this.getElement().clientWidth - thumbToDrag.offsetWidth;
    value = (e.left / availWidth)***REMOVED*** (this.getMaximum() - this.getMinimum()) +
        this.getMinimum();
  }
  // Bind the value within valid range before calling setThumbPosition_.
  // This is necessary because setThumbPosition_ is a no-op for values outside
  // of the legal range. For drag operations, we want the handle to snap to the
  // last valid value instead of remaining at the previous position.
  if (e.dragger == this.valueDragger_) {
    value = Math.min(Math.max(value, this.getMinimum()),
        this.getValue() + this.getExtent());
  } else {
    value = Math.min(Math.max(value, this.getValue()), this.getMaximum());
  }
  this.setThumbPosition_(thumbToDrag, value);
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the start/end drag event on the thumgs. Adds/removes
***REMOVED*** the "-dragging" CSS classes on the slider and thumb.
***REMOVED*** @param {goog.fx.DragEvent} e The drag event used to drag the thumb.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.handleThumbDragStartEnd_ = function(e) {
  var isDragStart = e.type == goog.fx.Dragger.EventType.START;
  goog.dom.classlist.enable(goog.asserts.assertElement(this.getElement()),
      goog.ui.SliderBase.SLIDER_DRAGGING_CSS_CLASS_, isDragStart);
  goog.dom.classlist.enable(goog.asserts.assertElement(e.target.handle),
      goog.ui.SliderBase.THUMB_DRAGGING_CSS_CLASS_, isDragStart);
  var isValueDragger = e.dragger == this.valueDragger_;
  if (isDragStart) {
    this.dispatchEvent(goog.ui.SliderBase.EventType.DRAG_START);
    this.dispatchEvent(isValueDragger ?
        goog.ui.SliderBase.EventType.DRAG_VALUE_START :
        goog.ui.SliderBase.EventType.DRAG_EXTENT_START);
  } else {
    this.dispatchEvent(goog.ui.SliderBase.EventType.DRAG_END);
    this.dispatchEvent(isValueDragger ?
        goog.ui.SliderBase.EventType.DRAG_VALUE_END :
        goog.ui.SliderBase.EventType.DRAG_EXTENT_END);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for the key down event. This is used to update the value
***REMOVED*** based on the key pressed.
***REMOVED*** @param {goog.events.KeyEvent} e  The keyboard event object.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.handleKeyDown_ = function(e) {
  var handled = true;
  switch (e.keyCode) {
    case goog.events.KeyCodes.HOME:
      this.animatedSetValue(this.getMinimum());
      break;
    case goog.events.KeyCodes.END:
      this.animatedSetValue(this.getMaximum());
      break;
    case goog.events.KeyCodes.PAGE_UP:
      this.moveThumbs(this.getBlockIncrement());
      break;
    case goog.events.KeyCodes.PAGE_DOWN:
      this.moveThumbs(-this.getBlockIncrement());
      break;
    case goog.events.KeyCodes.LEFT:
      var sign = this.flipForRtl_ && this.isRightToLeft() ? 1 : -1;
      this.moveThumbs(e.shiftKey ?
          sign***REMOVED*** this.getBlockIncrement() : sign***REMOVED*** this.getUnitIncrement());
      break;
    case goog.events.KeyCodes.DOWN:
      this.moveThumbs(e.shiftKey ?
          -this.getBlockIncrement() : -this.getUnitIncrement());
      break;
    case goog.events.KeyCodes.RIGHT:
      var sign = this.flipForRtl_ && this.isRightToLeft() ? -1 : 1;
      this.moveThumbs(e.shiftKey ?
          sign***REMOVED*** this.getBlockIncrement() : sign***REMOVED*** this.getUnitIncrement());
      break;
    case goog.events.KeyCodes.UP:
      this.moveThumbs(e.shiftKey ?
          this.getBlockIncrement() : this.getUnitIncrement());
      break;

    default:
      handled = false;
  }

  if (handled) {
    e.preventDefault();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the mouse down event and click event.
***REMOVED*** @param {goog.events.Event} e  The mouse event object.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.handleMouseDownAndClick_ = function(e) {
  if (this.getElement().focus) {
    this.getElement().focus();
  }

  // Known Element.
  var target =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (e.target);

  if (!goog.dom.contains(this.valueThumb, target) &&
      !goog.dom.contains(this.extentThumb, target)) {
    var isClick = e.type == goog.events.EventType.CLICK;
    if (isClick && goog.now() < this.mouseDownTime_ + this.MOUSE_DOWN_DELAY_) {
      // Ignore a click event that comes a short moment after a mousedown
      // event.  This happens for desktop.  For devices with both a touch
      // screen and a mouse pad we do not get a mousedown event from the mouse
      // pad and do get a click event.
      return;
    }
    if (!isClick) {
      this.mouseDownTime_ = goog.now();
    }

    if (this.moveToPointEnabled_) {
      // just set the value directly based on the position of the click
      this.animatedSetValue(this.getValueFromMousePosition(e));
    } else {
      // start a timer that incrementally moves the handle
      this.startBlockIncrementing_(e);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the mouse wheel event.
***REMOVED*** @param {goog.events.MouseWheelEvent} e  The mouse wheel event object.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.handleMouseWheel_ = function(e) {
  // Just move one unit increment per mouse wheel event
  var direction = e.detail > 0 ? -1 : 1;
  this.moveThumbs(direction***REMOVED*** this.getUnitIncrement());
  e.preventDefault();
***REMOVED***


***REMOVED***
***REMOVED*** Starts the animation that causes the thumb to increment/decrement by the
***REMOVED*** block increment when the user presses down on the background.
***REMOVED*** @param {goog.events.Event} e  The mouse event object.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.startBlockIncrementing_ = function(e) {
  this.storeMousePos_(e);
  this.thumbToMove_ = this.getClosestThumb_(this.getValueFromMousePosition(e));
  if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
    this.incrementing_ = this.lastMousePosition_ < this.thumbToMove_.offsetTop;
  } else {
    this.incrementing_ = this.lastMousePosition_ >
                         this.getOffsetStart_(this.thumbToMove_) +
                         this.thumbToMove_.offsetWidth;
  }

  var doc = goog.dom.getOwnerDocument(this.getElement());
  this.getHandler().
      listen(doc, goog.events.EventType.MOUSEUP,
          this.stopBlockIncrementing_, true).
      listen(this.getElement(), goog.events.EventType.MOUSEMOVE,
          this.storeMousePos_);

  if (!this.incTimer_) {
    this.incTimer_ = new goog.Timer(
        goog.ui.SliderBase.MOUSE_DOWN_INCREMENT_INTERVAL_);
    this.getHandler().listen(this.incTimer_, goog.Timer.TICK,
        this.handleTimerTick_);
  }
  this.handleTimerTick_();
  this.incTimer_.start();
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the tick event dispatched by the timer used to update the value
***REMOVED*** in a block increment. This is also called directly from
***REMOVED*** startBlockIncrementing_.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.handleTimerTick_ = function() {
  var value;
  if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
    var mouseY = this.lastMousePosition_;
    var thumbY = this.thumbToMove_.offsetTop;
    if (this.incrementing_) {
      if (mouseY < thumbY) {
        value = this.getThumbPosition_(this.thumbToMove_) +
            this.getBlockIncrement();
      }
    } else {
      var thumbH = this.thumbToMove_.offsetHeight;
      if (mouseY > thumbY + thumbH) {
        value = this.getThumbPosition_(this.thumbToMove_) -
            this.getBlockIncrement();
      }
    }
  } else {
    var mouseX = this.lastMousePosition_;
    var thumbX = this.getOffsetStart_(this.thumbToMove_);
    if (this.incrementing_) {
      var thumbW = this.thumbToMove_.offsetWidth;
      if (mouseX > thumbX + thumbW) {
        value = this.getThumbPosition_(this.thumbToMove_) +
            this.getBlockIncrement();
      }
    } else {
      if (mouseX < thumbX) {
        value = this.getThumbPosition_(this.thumbToMove_) -
            this.getBlockIncrement();
      }
    }
  }

  if (goog.isDef(value)) { // not all code paths sets the value variable
    this.setThumbPosition_(this.thumbToMove_, value);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Stops the block incrementing animation and unlistens the necessary
***REMOVED*** event handlers.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.stopBlockIncrementing_ = function() {
  if (this.incTimer_) {
    this.incTimer_.stop();
  }

  var doc = goog.dom.getOwnerDocument(this.getElement());
  this.getHandler().
      unlisten(doc, goog.events.EventType.MOUSEUP,
          this.stopBlockIncrementing_, true).
      unlisten(this.getElement(), goog.events.EventType.MOUSEMOVE,
          this.storeMousePos_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the relative mouse position to the slider.
***REMOVED*** @param {goog.events.Event} e  The mouse event object.
***REMOVED*** @return {number} The relative mouse position to the slider.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.getRelativeMousePos_ = function(e) {
  var coord = goog.style.getRelativePosition(e, this.getElement());
  if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
    return coord.y;
  } else {
    if (this.flipForRtl_ && this.isRightToLeft()) {
      return this.getElement().clientWidth - coord.x;
    } else {
      return coord.x;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Stores the current mouse position so that it can be used in the timer.
***REMOVED*** @param {goog.events.Event} e  The mouse event object.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.storeMousePos_ = function(e) {
  this.lastMousePosition_ = this.getRelativeMousePos_(e);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value to use for the current mouse position
***REMOVED*** @param {goog.events.Event} e  The mouse event object.
***REMOVED*** @return {number} The value that this mouse position represents.
***REMOVED***
goog.ui.SliderBase.prototype.getValueFromMousePosition = function(e) {
  var min = this.getMinimum();
  var max = this.getMaximum();
  if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
    var thumbH = this.valueThumb.offsetHeight;
    var availH = this.getElement().clientHeight - thumbH;
    var y = this.getRelativeMousePos_(e) - thumbH / 2;
    return (max - min)***REMOVED*** (availH - y) / availH + min;
  } else {
    var thumbW = this.valueThumb.offsetWidth;
    var availW = this.getElement().clientWidth - thumbW;
    var x = this.getRelativeMousePos_(e) - thumbW / 2;
    return (max - min)***REMOVED*** x / availW + min;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @deprecated Since 25-June-2012. Use public method getValueFromMousePosition.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.getValueFromMousePosition_ =
    goog.ui.SliderBase.prototype.getValueFromMousePosition;


***REMOVED***
***REMOVED*** @param {HTMLDivElement} thumb  The thumb object.
***REMOVED*** @return {number} The position of the specified thumb.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.getThumbPosition_ = function(thumb) {
  if (thumb == this.valueThumb) {
    return this.rangeModel.getValue();
  } else if (thumb == this.extentThumb) {
    return this.rangeModel.getValue() + this.rangeModel.getExtent();
  } else {
    throw Error('Illegal thumb element. Neither minThumb nor maxThumb');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether a thumb is currently being dragged with the mouse (or via
***REMOVED*** touch). Note that changing the value with keyboard, mouswheel, or via
***REMOVED*** move-to-point click immediately sends a CHANGE event without going through a
***REMOVED*** dragged state.
***REMOVED*** @return {boolean} Whether a dragger is currently being dragged.
***REMOVED***
goog.ui.SliderBase.prototype.isDragging = function() {
  return this.valueDragger_.isDragging() || this.extentDragger_.isDragging();
***REMOVED***


***REMOVED***
***REMOVED*** Moves the thumbs by the specified delta as follows
***REMOVED*** - as long as both thumbs stay within [min,max], both thumbs are moved
***REMOVED*** - once a thumb reaches or exceeds min (or max, respectively), it stays
***REMOVED*** - at min (or max, respectively).
***REMOVED*** In case both thumbs have reached min (or max), no change event will fire.
***REMOVED*** If the specified delta is smaller than the step size, it will be rounded
***REMOVED*** to the step size.
***REMOVED*** @param {number} delta The delta by which to move the selected range.
***REMOVED***
goog.ui.SliderBase.prototype.moveThumbs = function(delta) {
  // Assume that a small delta is supposed to be at least a step.
  if (Math.abs(delta) < this.getStep()) {
    delta = goog.math.sign(delta)***REMOVED*** this.getStep();
  }
  var newMinPos = this.getThumbPosition_(this.valueThumb) + delta;
  var newMaxPos = this.getThumbPosition_(this.extentThumb) + delta;
  // correct min / max positions to be within bounds
  newMinPos = goog.math.clamp(
      newMinPos, this.getMinimum(), this.getMaximum() - this.minExtent_);
  newMaxPos = goog.math.clamp(
      newMaxPos, this.getMinimum() + this.minExtent_, this.getMaximum());
  // Set value and extent atomically
  this.setValueAndExtent(newMinPos, newMaxPos - newMinPos);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the position of the given thumb. The set is ignored and no CHANGE event
***REMOVED*** fires if it violates the constraint minimum <= value (valueThumb position) <=
***REMOVED*** value + extent (extentThumb position) <= maximum.
***REMOVED***
***REMOVED*** Note: To keep things simple, the setThumbPosition_ function does not have the
***REMOVED*** side-effect of "correcting" value or extent to fit the above constraint as it
***REMOVED*** is the case in the underlying range model. Instead, we simply ignore the
***REMOVED*** call. Callers must make these adjustements explicitly if they wish.
***REMOVED*** @param {Element} thumb The thumb whose position to set.
***REMOVED*** @param {number} position The position to move the thumb to.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.setThumbPosition_ = function(thumb, position) {
  // Round first so that all computations and checks are consistent.
  var roundedPosition = this.rangeModel.roundToStepWithMin(position);
  var value = thumb == this.valueThumb ? roundedPosition :
      this.rangeModel.getValue();
  var end = thumb == this.extentThumb ? roundedPosition :
      this.rangeModel.getValue() + this.rangeModel.getExtent();
  if (value >= this.getMinimum() && end >= value + this.minExtent_ &&
      this.getMaximum() >= end) {
    this.setValueAndExtent(value, end - value);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value and extent of the underlying range model. We enforce that
***REMOVED*** getMinimum() <= value <= getMaximum() - extent and
***REMOVED*** getMinExtent <= extent <= getMaximum() - getValue()
***REMOVED*** If this is not satisfied for the given extent, the call is ignored and no
***REMOVED*** CHANGE event fires. This is a utility method to allow setting the thumbs
***REMOVED*** simultaneously and ensuring that only one event fires.
***REMOVED*** @param {number} value The value to which to set the value.
***REMOVED*** @param {number} extent The value to which to set the extent.
***REMOVED***
goog.ui.SliderBase.prototype.setValueAndExtent = function(value, extent) {
  if (this.getMinimum() <= value &&
      value <= this.getMaximum() - extent &&
      this.minExtent_ <= extent &&
      extent <= this.getMaximum() - value) {

    if (value == this.getValue() && extent == this.getExtent()) {
      return;
    }
    // because the underlying range model applies adjustements of value
    // and extent to fit within bounds, we need to reset the extent
    // first so these adjustements don't kick in.
    this.rangeModel.setMute(true);
    this.rangeModel.setExtent(0);
    this.rangeModel.setValue(value);
    this.rangeModel.setExtent(extent);
    this.rangeModel.setMute(false);
    this.handleRangeModelChange(null);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The minimum value.
***REMOVED***
goog.ui.SliderBase.prototype.getMinimum = function() {
  return this.rangeModel.getMinimum();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimum number.
***REMOVED*** @param {number} min The minimum value.
***REMOVED***
goog.ui.SliderBase.prototype.setMinimum = function(min) {
  this.rangeModel.setMinimum(min);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The maximum value.
***REMOVED***
goog.ui.SliderBase.prototype.getMaximum = function() {
  return this.rangeModel.getMaximum();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maximum number.
***REMOVED*** @param {number} max The maximum value.
***REMOVED***
goog.ui.SliderBase.prototype.setMaximum = function(max) {
  this.rangeModel.setMaximum(max);
***REMOVED***


***REMOVED***
***REMOVED*** @return {HTMLDivElement} The value thumb element.
***REMOVED***
goog.ui.SliderBase.prototype.getValueThumb = function() {
  return this.valueThumb;
***REMOVED***


***REMOVED***
***REMOVED*** @return {HTMLDivElement} The extent thumb element.
***REMOVED***
goog.ui.SliderBase.prototype.getExtentThumb = function() {
  return this.extentThumb;
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} position The position to get the closest thumb to.
***REMOVED*** @return {HTMLDivElement} The thumb that is closest to the given position.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.getClosestThumb_ = function(position) {
  if (position <= (this.rangeModel.getValue() +
                   this.rangeModel.getExtent() / 2)) {
    return this.valueThumb;
  } else {
    return this.extentThumb;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Call back when the internal range model changes. Sub-classes may override
***REMOVED*** and re-enter this method to update a11y state. Consider protected.
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.SliderBase.prototype.handleRangeModelChange = function(e) {
  this.updateUi_();
  this.updateAriaStates();
  this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
***REMOVED***


***REMOVED***
***REMOVED*** This is called when we need to update the size of the thumb. This happens
***REMOVED*** when first created as well as when the value and the orientation changes.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.updateUi_ = function() {
  if (this.valueThumb && !this.isAnimating_) {
    var minCoord = this.getThumbCoordinateForValue(
        this.getThumbPosition_(this.valueThumb));
    var maxCoord = this.getThumbCoordinateForValue(
        this.getThumbPosition_(this.extentThumb));

    if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
      this.valueThumb.style.top = minCoord.y + 'px';
      this.extentThumb.style.top = maxCoord.y + 'px';
      if (this.rangeHighlight) {
        var highlightPositioning = this.calculateRangeHighlightPositioning_(
            maxCoord.y, minCoord.y, this.valueThumb.offsetHeight);
        this.rangeHighlight.style.top = highlightPositioning.offset + 'px';
        this.rangeHighlight.style.height = highlightPositioning.size + 'px';
      }
    } else {
      var pos = (this.flipForRtl_ && this.isRightToLeft()) ? 'right' : 'left';
      this.valueThumb.style[pos] = minCoord.x + 'px';
      this.extentThumb.style[pos] = maxCoord.x + 'px';
      if (this.rangeHighlight) {
        var highlightPositioning = this.calculateRangeHighlightPositioning_(
            minCoord.x, maxCoord.x, this.valueThumb.offsetWidth);
        this.rangeHighlight.style[pos] = highlightPositioning.offset + 'px';
        this.rangeHighlight.style.width = highlightPositioning.size + 'px';
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the start position (offset) and size of the range highlight, e.g.
***REMOVED*** for a horizontal slider, this will return [left, width] for the highlight.
***REMOVED*** @param {number} firstThumbPos The position of the first thumb along the
***REMOVED***     slider axis.
***REMOVED*** @param {number} secondThumbPos The position of the second thumb along the
***REMOVED***     slider axis, must be >= firstThumbPos.
***REMOVED*** @param {number} thumbSize The size of the thumb, along the slider axis.
***REMOVED*** @return {{offset: number, size: number}} The positioning parameters for the
***REMOVED***     range highlight.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.calculateRangeHighlightPositioning_ = function(
    firstThumbPos, secondThumbPos, thumbSize) {
  // Highlight is inset by half the thumb size, from the edges of the thumb.
  var highlightInset = Math.ceil(thumbSize / 2);
  var size = secondThumbPos - firstThumbPos + thumbSize - 2***REMOVED*** highlightInset;
  // Don't return negative size since it causes an error. IE sometimes attempts
  // to position the thumbs while slider size is 0, resulting in size < 0 here.
  return {
    offset: firstThumbPos + highlightInset,
    size: Math.max(size, 0)
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Returns the position to move the handle to for a given value
***REMOVED*** @param {number} val  The value to get the coordinate for.
***REMOVED*** @return {!goog.math.Coordinate} Coordinate with either x or y set.
***REMOVED***
goog.ui.SliderBase.prototype.getThumbCoordinateForValue = function(val) {
  var coord = new goog.math.Coordinate;
  if (this.valueThumb) {
    var min = this.getMinimum();
    var max = this.getMaximum();

    // This check ensures the ratio never take NaN value, which is possible when
    // the slider min & max are same numbers (i.e. 1).
    var ratio = (val == min && min == max) ? 0 : (val - min) / (max - min);

    if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
      var thumbHeight = this.valueThumb.offsetHeight;
      var h = this.getElement().clientHeight - thumbHeight;
      var bottom = Math.round(ratio***REMOVED*** h);
      coord.x = this.getOffsetStart_(this.valueThumb); // Keep x the same.
      coord.y = h - bottom;
    } else {
      var w = this.getElement().clientWidth - this.valueThumb.offsetWidth;
      var left = Math.round(ratio***REMOVED*** w);
      coord.x = left;
      coord.y = this.valueThumb.offsetTop; // Keep y the same.
    }
  }
  return coord;
***REMOVED***


***REMOVED***
***REMOVED*** @deprecated Since 25-June-2012. Use public method getThumbCoordinateForValue.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.getThumbCoordinateForValue_ =
    goog.ui.SliderBase.prototype.getThumbCoordinateForValue;


***REMOVED***
***REMOVED*** Sets the value and starts animating the handle towards that position.
***REMOVED*** @param {number} v Value to set and animate to.
***REMOVED***
goog.ui.SliderBase.prototype.animatedSetValue = function(v) {
  // the value might be out of bounds
  v = goog.math.clamp(v, this.getMinimum(), this.getMaximum());

  if (this.isAnimating_) {
    this.currentAnimation_.stop(true);
  }
  var animations = new goog.fx.AnimationParallelQueue();
  var end;

  var thumb = this.getClosestThumb_(v);
  var previousValue = this.getValue();
  var previousExtent = this.getExtent();
  var previousThumbValue = this.getThumbPosition_(thumb);
  var previousCoord = this.getThumbCoordinateForValue(previousThumbValue);
  var stepSize = this.getStep();

  // If the delta is less than a single step, increase it to a step, else the
  // range model will reduce it to zero.
  if (Math.abs(v - previousThumbValue) < stepSize) {
    var delta = v > previousThumbValue ? stepSize : -stepSize;
    v = previousThumbValue + delta;

    // The resulting value may be out of bounds, sanitize.
    v = goog.math.clamp(v, this.getMinimum(), this.getMaximum());
  }

  this.setThumbPosition_(thumb, v);
  var coord = this.getThumbCoordinateForValue(this.getThumbPosition_(thumb));

  if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
    end = [this.getOffsetStart_(thumb), coord.y];
  } else {
    end = [coord.x, thumb.offsetTop];
  }

  var slide = new goog.fx.dom.Slide(thumb,
      [previousCoord.x, previousCoord.y],
      end,
      goog.ui.SliderBase.ANIMATION_INTERVAL_);
  slide.enableRightPositioningForRtl(this.flipForRtl_);
  animations.add(slide);
  if (this.rangeHighlight) {
    this.addRangeHighlightAnimations_(thumb, previousValue, previousExtent,
        coord, animations);
  }

  // Create additional animations to play if a factory has been set.
  if (this.additionalAnimations_) {
    var additionalAnimations = this.additionalAnimations_.createAnimations(
        previousValue, v, goog.ui.SliderBase.ANIMATION_INTERVAL_);
    goog.array.forEach(additionalAnimations, function(animation) {
      animations.add(animation);
    });
  }

  this.currentAnimation_ = animations;
  this.getHandler().listen(animations, goog.fx.Transition.EventType.END,
      this.endAnimation_);

  this.isAnimating_ = true;
  animations.play(false);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the slider is animating, false otherwise.
***REMOVED***
goog.ui.SliderBase.prototype.isAnimating = function() {
  return this.isAnimating_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the factory that will be used to create additional animations to be
***REMOVED*** played when animating to a new value.  These animations can be for any
***REMOVED*** element and the animations will be played in addition to the default
***REMOVED*** animation(s).  The animations will also be played in the same parallel queue
***REMOVED*** ensuring that all animations are played at the same time.
***REMOVED*** @see #animatedSetValue
***REMOVED***
***REMOVED*** @param {goog.ui.SliderBase.AnimationFactory} factory The animation factory to
***REMOVED***     use.  This will not change the default animations played by the slider.
***REMOVED***     It will only allow for additional animations.
***REMOVED***
goog.ui.SliderBase.prototype.setAdditionalAnimations = function(factory) {
  this.additionalAnimations_ = factory;
***REMOVED***


***REMOVED***
***REMOVED*** Adds animations for the range highlight element to the animation queue.
***REMOVED***
***REMOVED*** @param {Element} thumb The thumb that's moving, must be
***REMOVED***     either valueThumb or extentThumb.
***REMOVED*** @param {number} previousValue The previous value of the slider.
***REMOVED*** @param {number} previousExtent The previous extent of the
***REMOVED***     slider.
***REMOVED*** @param {goog.math.Coordinate} newCoord The new pixel coordinate of the
***REMOVED***     thumb that's moving.
***REMOVED*** @param {goog.fx.AnimationParallelQueue} animations The animation queue.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.addRangeHighlightAnimations_ = function(thumb,
    previousValue, previousExtent, newCoord, animations) {
  var previousMinCoord = this.getThumbCoordinateForValue(previousValue);
  var previousMaxCoord = this.getThumbCoordinateForValue(
      previousValue + previousExtent);
  var minCoord = previousMinCoord;
  var maxCoord = previousMaxCoord;
  if (thumb == this.valueThumb) {
    minCoord = newCoord;
  } else {
    maxCoord = newCoord;
  }

  if (this.orientation_ == goog.ui.SliderBase.Orientation.VERTICAL) {
    var previousHighlightPositioning = this.calculateRangeHighlightPositioning_(
        previousMaxCoord.y, previousMinCoord.y, this.valueThumb.offsetHeight);
    var highlightPositioning = this.calculateRangeHighlightPositioning_(
        maxCoord.y, minCoord.y, this.valueThumb.offsetHeight);
    var slide = new goog.fx.dom.Slide(this.rangeHighlight,
        [this.getOffsetStart_(this.rangeHighlight),
          previousHighlightPositioning.offset],
        [this.getOffsetStart_(this.rangeHighlight),
          highlightPositioning.offset],
        goog.ui.SliderBase.ANIMATION_INTERVAL_);
    var resizeHeight = new goog.fx.dom.ResizeHeight(this.rangeHighlight,
        previousHighlightPositioning.size, highlightPositioning.size,
        goog.ui.SliderBase.ANIMATION_INTERVAL_);
    slide.enableRightPositioningForRtl(this.flipForRtl_);
    resizeHeight.enableRightPositioningForRtl(this.flipForRtl_);
    animations.add(slide);
    animations.add(resizeHeight);
  } else {
    var previousHighlightPositioning = this.calculateRangeHighlightPositioning_(
        previousMinCoord.x, previousMaxCoord.x, this.valueThumb.offsetWidth);
    var highlightPositioning = this.calculateRangeHighlightPositioning_(
        minCoord.x, maxCoord.x, this.valueThumb.offsetWidth);
    var newWidth = highlightPositioning[1];
    var slide = new goog.fx.dom.Slide(this.rangeHighlight,
        [previousHighlightPositioning.offset, this.rangeHighlight.offsetTop],
        [highlightPositioning.offset, this.rangeHighlight.offsetTop],
        goog.ui.SliderBase.ANIMATION_INTERVAL_);
    var resizeWidth = new goog.fx.dom.ResizeWidth(this.rangeHighlight,
        previousHighlightPositioning.size, highlightPositioning.size,
        goog.ui.SliderBase.ANIMATION_INTERVAL_);
    slide.enableRightPositioningForRtl(this.flipForRtl_);
    resizeWidth.enableRightPositioningForRtl(this.flipForRtl_);
    animations.add(slide);
    animations.add(resizeWidth);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the isAnimating_ field to false once the animation is done.
***REMOVED*** @param {goog.fx.AnimationEvent} e Event object passed by the animation
***REMOVED***     object.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.endAnimation_ = function(e) {
  this.isAnimating_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Changes the orientation.
***REMOVED*** @param {goog.ui.SliderBase.Orientation} orient The orientation.
***REMOVED***
goog.ui.SliderBase.prototype.setOrientation = function(orient) {
  if (this.orientation_ != orient) {
    var oldCss = this.getCssClass(this.orientation_);
    var newCss = this.getCssClass(orient);
    this.orientation_ = orient;

    // Update the DOM
    if (this.getElement()) {
      goog.dom.classlist.swap(goog.asserts.assert(this.getElement()),
                              oldCss, newCss);
      // we need to reset the left and top, plus range highlight
      var pos = (this.flipForRtl_ && this.isRightToLeft()) ? 'right' : 'left';
      this.valueThumb.style[pos] = this.valueThumb.style.top = '';
      this.extentThumb.style[pos] = this.extentThumb.style.top = '';
      if (this.rangeHighlight) {
        this.rangeHighlight.style[pos] = this.rangeHighlight.style.top = '';
        this.rangeHighlight.style.width = this.rangeHighlight.style.height = '';
      }
      this.updateUi_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.SliderBase.Orientation} the orientation of the slider.
***REMOVED***
goog.ui.SliderBase.prototype.getOrientation = function() {
  return this.orientation_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SliderBase.prototype.disposeInternal = function() {
  goog.ui.SliderBase.superClass_.disposeInternal.call(this);
  if (this.incTimer_) {
    this.incTimer_.dispose();
  }
  delete this.incTimer_;
  if (this.currentAnimation_) {
    this.currentAnimation_.dispose();
  }
  delete this.currentAnimation_;
  delete this.valueThumb;
  delete this.extentThumb;
  if (this.rangeHighlight) {
    delete this.rangeHighlight;
  }
  this.rangeModel.dispose();
  delete this.rangeModel;
  if (this.keyHandler_) {
    this.keyHandler_.dispose();
    delete this.keyHandler_;
  }
  if (this.mouseWheelHandler_) {
    this.mouseWheelHandler_.dispose();
    delete this.mouseWheelHandler_;
  }
  if (this.valueDragger_) {
    this.valueDragger_.dispose();
    delete this.valueDragger_;
  }
  if (this.extentDragger_) {
    this.extentDragger_.dispose();
    delete this.extentDragger_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The amount to increment/decrement for page up/down as well
***REMOVED***     as when holding down the mouse button on the background.
***REMOVED***
goog.ui.SliderBase.prototype.getBlockIncrement = function() {
  return this.blockIncrement_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the amount to increment/decrement for page up/down as well as when
***REMOVED*** holding down the mouse button on the background.
***REMOVED***
***REMOVED*** @param {number} value The value to set the block increment to.
***REMOVED***
goog.ui.SliderBase.prototype.setBlockIncrement = function(value) {
  this.blockIncrement_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimal value that the extent may have.
***REMOVED***
***REMOVED*** @param {number} value The minimal value for the extent.
***REMOVED***
goog.ui.SliderBase.prototype.setMinExtent = function(value) {
  this.minExtent_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** The amount to increment/decrement for up, down, left and right arrow keys
***REMOVED*** and mouse wheel events.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.ui.SliderBase.prototype.unitIncrement_ = 1;


***REMOVED***
***REMOVED*** @return {number} The amount to increment/decrement for up, down, left and
***REMOVED***     right arrow keys and mouse wheel events.
***REMOVED***
goog.ui.SliderBase.prototype.getUnitIncrement = function() {
  return this.unitIncrement_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the amount to increment/decrement for up, down, left and right arrow
***REMOVED*** keys and mouse wheel events.
***REMOVED*** @param {number} value  The value to set the unit increment to.
***REMOVED***
goog.ui.SliderBase.prototype.setUnitIncrement = function(value) {
  this.unitIncrement_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** @return {?number} The step value used to determine how to round the value.
***REMOVED***
goog.ui.SliderBase.prototype.getStep = function() {
  return this.rangeModel.getStep();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the step value. The step value is used to determine how to round the
***REMOVED*** value.
***REMOVED*** @param {?number} step  The step size.
***REMOVED***
goog.ui.SliderBase.prototype.setStep = function(step) {
  this.rangeModel.setStep(step);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether clicking on the backgtround should move directly to
***REMOVED***     that point.
***REMOVED***
goog.ui.SliderBase.prototype.getMoveToPointEnabled = function() {
  return this.moveToPointEnabled_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether clicking on the background should move directly to that point.
***REMOVED*** @param {boolean} val Whether clicking on the background should move directly
***REMOVED***     to that point.
***REMOVED***
goog.ui.SliderBase.prototype.setMoveToPointEnabled = function(val) {
  this.moveToPointEnabled_ = val;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The value of the underlying range model.
***REMOVED***
goog.ui.SliderBase.prototype.getValue = function() {
  return this.rangeModel.getValue();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the underlying range model. We enforce that
***REMOVED*** getMinimum() <= value <= getMaximum() - getExtent()
***REMOVED*** If this is not satisifed for the given value, the call is ignored and no
***REMOVED*** CHANGE event fires.
***REMOVED*** @param {number} value The value.
***REMOVED***
goog.ui.SliderBase.prototype.setValue = function(value) {
  // Set the position through the thumb method to enforce constraints.
  this.setThumbPosition_(this.valueThumb, value);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The value of the extent of the underlying range model.
***REMOVED***
goog.ui.SliderBase.prototype.getExtent = function() {
  return this.rangeModel.getExtent();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the extent of the underlying range model. We enforce that
***REMOVED*** getMinExtent() <= extent <= getMaximum() - getValue()
***REMOVED*** If this is not satisifed for the given extent, the call is ignored and no
***REMOVED*** CHANGE event fires.
***REMOVED*** @param {number} extent The value to which to set the extent.
***REMOVED***
goog.ui.SliderBase.prototype.setExtent = function(extent) {
  // Set the position through the thumb method to enforce constraints.
  this.setThumbPosition_(this.extentThumb, (this.rangeModel.getValue() +
                                            extent));
***REMOVED***


***REMOVED***
***REMOVED*** Change the visibility of the slider.
***REMOVED*** You must call this if you had set the slider's value when it was invisible.
***REMOVED*** @param {boolean} visible Whether to show the slider.
***REMOVED***
goog.ui.SliderBase.prototype.setVisible = function(visible) {
  goog.style.setElementShown(this.getElement(), visible);
  if (visible) {
    this.updateUi_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Set a11y roles and state.
***REMOVED*** @protected
***REMOVED***
goog.ui.SliderBase.prototype.setAriaRoles = function() {
  var el = this.getElement();
  goog.asserts.assert(el,
      'The DOM element for the slider base cannot be null.');
  goog.a11y.aria.setRole(el, goog.a11y.aria.Role.SLIDER);
  this.updateAriaStates();
***REMOVED***


***REMOVED***
***REMOVED*** Set a11y roles and state when values change.
***REMOVED*** @protected
***REMOVED***
goog.ui.SliderBase.prototype.updateAriaStates = function() {
  var element = this.getElement();
  if (element) {
    goog.a11y.aria.setState(element, goog.a11y.aria.State.VALUEMIN,
        this.getMinimum());
    goog.a11y.aria.setState(element, goog.a11y.aria.State.VALUEMAX,
        this.getMaximum());
    goog.a11y.aria.setState(element, goog.a11y.aria.State.VALUENOW,
        this.getValue());
    // Passing an empty value to setState will restore the default.
    goog.a11y.aria.setState(element, goog.a11y.aria.State.VALUETEXT,
        this.getTextValue() || '');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables mouse wheel handling for the slider. The mouse wheel
***REMOVED*** handler enables the user to change the value of slider using a mouse wheel.
***REMOVED***
***REMOVED*** @param {boolean} enable Whether to enable mouse wheel handling.
***REMOVED***
goog.ui.SliderBase.prototype.setHandleMouseWheel = function(enable) {
  if (this.isInDocument() && enable != this.isHandleMouseWheel()) {
    this.enableMouseWheelHandling_(enable);
  }

  this.isHandleMouseWheel_ = enable;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the slider handles mousewheel.
***REMOVED***
goog.ui.SliderBase.prototype.isHandleMouseWheel = function() {
  return this.isHandleMouseWheel_;
***REMOVED***


***REMOVED***
***REMOVED*** Enable/Disable mouse wheel handling.
***REMOVED*** @param {boolean} enable Whether to enable mouse wheel handling.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.enableMouseWheelHandling_ = function(enable) {
  if (enable) {
    if (!this.mouseWheelHandler_) {
      this.mouseWheelHandler_ = new goog.events.MouseWheelHandler(
          this.getElement());
    }
    this.getHandler().listen(this.mouseWheelHandler_,
        goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
        this.handleMouseWheel_);
  } else {
    this.getHandler().unlisten(this.mouseWheelHandler_,
        goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
        this.handleMouseWheel_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables the slider. A disabled slider will ignore all
***REMOVED*** user-initiated events. Also fires goog.ui.Component.EventType.ENABLE/DISABLE
***REMOVED*** event as appropriate.
***REMOVED*** @param {boolean} enable Whether to enable the slider or not.
***REMOVED***
goog.ui.SliderBase.prototype.setEnabled = function(enable) {
  if (this.enabled_ == enable) {
    return;
  }

  var eventType = enable ?
      goog.ui.Component.EventType.ENABLE : goog.ui.Component.EventType.DISABLE;
  if (this.dispatchEvent(eventType)) {
    this.enabled_ = enable;
    this.enableEventHandlers_(enable);
    if (!enable) {
      // Disabling a slider is equivalent to a mouse up event when the block
      // increment (if happening) should be halted and any possible event
      // handlers be appropriately unlistened.
      this.stopBlockIncrementing_();
    }
    goog.dom.classlist.enable(
        goog.asserts.assert(this.getElement()),
        goog.ui.SliderBase.DISABLED_CSS_CLASS_, !enable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the slider is enabled or not.
***REMOVED***
goog.ui.SliderBase.prototype.isEnabled = function() {
  return this.enabled_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {Element} element An element for which we want offsetLeft.
***REMOVED*** @return {number} Returns the element's offsetLeft, accounting for RTL if
***REMOVED***     flipForRtl_ is true.
***REMOVED*** @private
***REMOVED***
goog.ui.SliderBase.prototype.getOffsetStart_ = function(element) {
  return this.flipForRtl_ ?
      goog.style.bidi.getOffsetStart(element) : element.offsetLeft;
***REMOVED***


***REMOVED***
***REMOVED*** @return {?string} The text value for the slider's current value, or null if
***REMOVED***     unavailable.
***REMOVED***
goog.ui.SliderBase.prototype.getTextValue = function() {
  return this.labelFn_(this.getValue());
***REMOVED***



***REMOVED***
***REMOVED*** The factory for creating additional animations to be played when animating to
***REMOVED*** a new value.
***REMOVED*** @interface
***REMOVED***
goog.ui.SliderBase.AnimationFactory = function() {***REMOVED***


***REMOVED***
***REMOVED*** Creates an additonal animation to play when animating to a new value.
***REMOVED***
***REMOVED*** @param {number} previousValue The previous value (before animation).
***REMOVED*** @param {number} newValue The new value (after animation).
***REMOVED*** @param {number} interval The animation interval.
***REMOVED*** @return {!Array.<!goog.fx.TransitionBase>} The additional animations to play.
***REMOVED***
goog.ui.SliderBase.AnimationFactory.prototype.createAnimations;
