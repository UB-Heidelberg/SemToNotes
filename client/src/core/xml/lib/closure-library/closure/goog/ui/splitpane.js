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
***REMOVED*** @fileoverview  Class for splitting two areas with draggable control for
***REMOVED*** changing size.
***REMOVED***
***REMOVED*** The DOM that is created (or that can be decorated) looks like this:
***REMOVED*** <div class='goog-splitpane'>
***REMOVED***   <div class='goog-splitpane-first-container'></div>
***REMOVED***   <div class='goog-splitpane-second-container'></div>
***REMOVED***   <div class='goog-splitpane-handle'></div>
***REMOVED*** </div>
***REMOVED***
***REMOVED*** The content to be split goes in the first and second DIVs, the third one
***REMOVED*** is for managing (and styling) the splitter handle.
***REMOVED***
***REMOVED*** @see ../demos/splitpane.html
***REMOVED***


goog.provide('goog.ui.SplitPane');
goog.provide('goog.ui.SplitPane.Orientation');

goog.require('goog.dom');
goog.require('goog.dom.classes');
***REMOVED***
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A left/right up/down Container SplitPane.
***REMOVED*** Create SplitPane with two goog.ui.Component opjects to split.
***REMOVED*** TODO(user): Support minimum splitpane size.
***REMOVED*** TODO(user): Allow component change/orientation after init.
***REMOVED*** TODO(user): Support hiding either side of handle (plus handle).
***REMOVED*** TODO(user): Look at setBorderBoxSize fixes and revist borderwidth code.
***REMOVED***
***REMOVED*** @param {goog.ui.Component} firstComponent Left or Top component.
***REMOVED*** @param {goog.ui.Component} secondComponent Right or Bottom component.
***REMOVED*** @param {goog.ui.SplitPane.Orientation} orientation SplitPane orientation.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.SplitPane = function(firstComponent, secondComponent, orientation,
    opt_domHelper) {
  goog.base(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The orientation of the containers.
  ***REMOVED*** @type {goog.ui.SplitPane.Orientation}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.orientation_ = orientation;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The left/top component.
  ***REMOVED*** @type {goog.ui.Component}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.firstComponent_ = firstComponent;
  this.addChild(firstComponent);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The right/bottom component.
  ***REMOVED*** @type {goog.ui.Component}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.secondComponent_ = secondComponent;
  this.addChild(secondComponent);
***REMOVED***
goog.inherits(goog.ui.SplitPane, goog.ui.Component);


***REMOVED***
***REMOVED*** Events.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.SplitPane.EventType = {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched after handle drag.
 ***REMOVED*****REMOVED***
  HANDLE_DRAG: 'handle_drag',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched after handle drag end.
 ***REMOVED*****REMOVED***
  HANDLE_DRAG_END: 'handle_drag_end'
***REMOVED***


***REMOVED***
***REMOVED*** CSS class names for splitpane outer container.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.CLASS_NAME_ = goog.getCssName('goog-splitpane');


***REMOVED***
***REMOVED*** CSS class name for first splitpane container.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.FIRST_CONTAINER_CLASS_NAME_ =
    goog.getCssName('goog-splitpane-first-container');


***REMOVED***
***REMOVED*** CSS class name for second splitpane container.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.SECOND_CONTAINER_CLASS_NAME_ =
    goog.getCssName('goog-splitpane-second-container');


***REMOVED***
***REMOVED*** CSS class name for the splitpane handle.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.HANDLE_CLASS_NAME_ = goog.getCssName('goog-splitpane-handle');


***REMOVED***
***REMOVED*** CSS class name for the splitpane handle in horizontal orientation.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.HANDLE_CLASS_NAME_HORIZONTAL_ =
    goog.getCssName('goog-splitpane-handle-horizontal');


***REMOVED***
***REMOVED*** CSS class name for the splitpane handle in horizontal orientation.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.HANDLE_CLASS_NAME_VERTICAL_ =
    goog.getCssName('goog-splitpane-handle-vertical');


***REMOVED***
 ***REMOVED*** The dragger to move the drag handle.
 ***REMOVED*** @type {goog.fx.Dragger?}
 ***REMOVED*** @private
***REMOVED*****REMOVED***
goog.ui.SplitPane.prototype.splitDragger_ = null;


***REMOVED***
***REMOVED*** The left/top component dom container.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.firstComponentContainer_ = null;


***REMOVED***
***REMOVED*** The right/bottom component dom container.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.secondComponentContainer_ = null;


***REMOVED***
***REMOVED*** The size (width or height) of the splitpane handle, default = 5.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.handleSize_ = 5;


***REMOVED***
***REMOVED*** The initial size (width or height) of the left or top component.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.initialSize_ = null;


***REMOVED***
***REMOVED*** The saved size (width or height) of the left or top component on a
***REMOVED*** double-click (snap).
***REMOVED*** This needs to be saved so it can be restored after another double-click.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.savedSnapSize_ = null;


***REMOVED***
***REMOVED*** The first component size, so we don't change it on a window resize.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.firstComponentSize_ = null;


***REMOVED***
***REMOVED*** If we resize as they user moves the handle (default = true).
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.continuousResize_ = true;


***REMOVED***
***REMOVED*** Iframe overlay to prevent iframes from grabbing events.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.iframeOverlay_ = null;


***REMOVED***
***REMOVED*** Z indices for iframe overlay and splitter handle.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.IframeOverlayIndex_ = {
  HIDDEN: -1,
  OVERLAY: 1,
  SPLITTER_HANDLE: 2
***REMOVED***


***REMOVED***
* Orientation values for the splitpane.
* @enum {string}
*/
goog.ui.SplitPane.Orientation = {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Horizontal orientation means splitter moves right-left.
 ***REMOVED*****REMOVED***
  HORIZONTAL: 'horizontal',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Vertical orientation means splitter moves up-down.
 ***REMOVED*****REMOVED***
  VERTICAL: 'vertical'
***REMOVED***


***REMOVED***
***REMOVED*** Create the DOM node & text node needed for the splitpane.
***REMOVED*** @override
***REMOVED***
goog.ui.SplitPane.prototype.createDom = function() {
  var dom = this.getDomHelper();

  // Create the components.
  var firstContainer = dom.createDom('div',
      goog.ui.SplitPane.FIRST_CONTAINER_CLASS_NAME_);
  var secondContainer = dom.createDom('div',
      goog.ui.SplitPane.SECOND_CONTAINER_CLASS_NAME_);
  var splitterHandle = dom.createDom('div',
      goog.ui.SplitPane.HANDLE_CLASS_NAME_);

  // Create the primary element, a DIV that holds the two containers and handle.
  this.setElementInternal(dom.createDom('div', goog.ui.SplitPane.CLASS_NAME_,
      firstContainer, secondContainer, splitterHandle));

  this.firstComponentContainer_ = firstContainer;
  this.secondComponentContainer_ = secondContainer;
  this.splitpaneHandle_ = splitterHandle;
  this.setUpHandle_();

  this.finishSetup_();
***REMOVED***


***REMOVED***
***REMOVED*** Determines if a given element can be decorated by this type of component.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} True if the element can be decorated, false otherwise.
***REMOVED*** @override
***REMOVED***
goog.ui.SplitPane.prototype.canDecorate = function(element) {
  var className = goog.ui.SplitPane.FIRST_CONTAINER_CLASS_NAME_;
  var firstContainer = this.getElementToDecorate_(element, className);
  if (!firstContainer) {
    return false;
  }
  // Since we have this component, save it so we don't have to get it
  // again in decorateInternal.  Same w/other components.
  this.firstComponentContainer_ = firstContainer;

  className = goog.ui.SplitPane.SECOND_CONTAINER_CLASS_NAME_;
  var secondContainer = this.getElementToDecorate_(element, className);

  if (!secondContainer) {
    return false;
  }
  this.secondComponentContainer_ = secondContainer;

  className = goog.ui.SplitPane.HANDLE_CLASS_NAME_;
  var splitpaneHandle = this.getElementToDecorate_(element, className);
  if (!splitpaneHandle) {
    return false;
  }
  this.splitpaneHandle_ = splitpaneHandle;

  // We found all the components we're looking for, so return true.
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Obtains the element to be decorated by class name. If multiple such elements
***REMOVED*** are found, preference is given to those directly attached to the specified
***REMOVED*** root element.
***REMOVED*** @param {Element} rootElement The root element from which to retrieve the
***REMOVED***     element to be decorated.
***REMOVED*** @param {!string} className The target class name.
***REMOVED*** @return {Element} The element to decorate.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.getElementToDecorate_ = function(rootElement,
    className) {

  // Decorate the root element's children, if available.
  var childElements = goog.dom.getChildren(rootElement);
  for (var i = 0; i < childElements.length; i++) {
    var childElement = childElements[i];
    if (goog.dom.classes.has(childElement, className)) {
      return childElement;
    }
  }

  // Default to the first descendent element with the correct class.
  return goog.dom.getElementsByTagNameAndClass(
      null, className, rootElement)[0];
***REMOVED***


***REMOVED***
***REMOVED*** Decorates the given HTML element as a SplitPane.  Overrides {@link
***REMOVED*** goog.ui.Component#decorateInternal}.  Considered protected.
***REMOVED*** @param {Element} element Element (SplitPane div) to decorate.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.SplitPane.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.setUpHandle_();

  var elSize = goog.style.getBorderBoxSize(element);
  this.setSize(new goog.math.Size(elSize.width, elSize.height));

  this.finishSetup_();
***REMOVED***


***REMOVED***
***REMOVED*** Parent the passed in components to the split containers.  Call their
***REMOVED*** createDom methods if necessary.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.finishSetup_ = function() {
  var dom = this.getDomHelper();

  if (!this.firstComponent_.getElement()) {
    this.firstComponent_.createDom();
  }

  dom.appendChild(this.firstComponentContainer_,
      this.firstComponent_.getElement());

  if (!this.secondComponent_.getElement()) {
    this.secondComponent_.createDom();
  }

  dom.appendChild(this.secondComponentContainer_,
      this.secondComponent_.getElement());

  this.splitDragger_ = new goog.fx.Dragger(this.splitpaneHandle_,
      this.splitpaneHandle_);

  this.firstComponentContainer_.style.position = 'absolute';
  this.secondComponentContainer_.style.position = 'absolute';
  var handleStyle = this.splitpaneHandle_.style;
  handleStyle.position = 'absolute';
  handleStyle.overflow = 'hidden';
  handleStyle.zIndex =
      goog.ui.SplitPane.IframeOverlayIndex_.SPLITTER_HANDLE;
***REMOVED***


***REMOVED***
***REMOVED*** Setup all events and do an initial resize.
***REMOVED*** @override
***REMOVED***
goog.ui.SplitPane.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  // If position is not set in the inline style of the element, it is not
  // possible to get the element's real CSS position until the element is in
  // the document.
  // When position:relative is set in the CSS and the element is not in the
  // document, Safari, Chrome, and Opera always return the empty string; while
  // IE always return "static".
  // Do the final check to see if element's position is set as "relative",
  // "absolute" or "fixed".
  var element = this.getElement();
  if (goog.style.getComputedPosition(element) == 'static') {
    element.style.position = 'relative';
  }

  this.getHandler().
      listen(this.splitpaneHandle_, goog.events.EventType.DBLCLICK,
          this.handleDoubleClick_).
      listen(this.splitDragger_, goog.fx.Dragger.EventType.START,
          this.handleDragStart_).
      listen(this.splitDragger_, goog.fx.Dragger.EventType.DRAG,
          this.handleDrag_).
      listen(this.splitDragger_, goog.fx.Dragger.EventType.END,
          this.handleDragEnd_);

  this.setFirstComponentSize(this.initialSize_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the initial size of the left or top component.
***REMOVED*** @param {number} size The size in Pixels of the container.
***REMOVED***
goog.ui.SplitPane.prototype.setInitialSize = function(size) {
  this.initialSize_ = size;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the SplitPane handle size.
***REMOVED*** TODO(user): Make sure this works after initialization.
***REMOVED*** @param {number} size The size of the handle in pixels.
***REMOVED***
goog.ui.SplitPane.prototype.setHandleSize = function(size) {
  this.handleSize_ = size;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether we resize on handle drag.
***REMOVED*** @param {boolean} continuous The continuous resize value.
***REMOVED***
goog.ui.SplitPane.prototype.setContinuousResize = function(continuous) {
  this.continuousResize_ = continuous;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the orientation for the split pane is vertical
***REMOVED*** or not.
***REMOVED*** @return {boolean} True if the orientation is vertical, false otherwise.
***REMOVED***
goog.ui.SplitPane.prototype.isVertical = function() {
  return this.orientation_ == goog.ui.SplitPane.Orientation.VERTICAL;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the handle by assigning the correct height/width and adding
***REMOVED*** the correct class as per the orientation.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.setUpHandle_ = function() {
  if (this.isVertical()) {
    this.splitpaneHandle_.style.height = this.handleSize_ + 'px';
    goog.dom.classes.add(this.splitpaneHandle_,
        goog.ui.SplitPane.HANDLE_CLASS_NAME_VERTICAL_);
  } else {
    this.splitpaneHandle_.style.width = this.handleSize_ + 'px';
    goog.dom.classes.add(this.splitpaneHandle_,
        goog.ui.SplitPane.HANDLE_CLASS_NAME_HORIZONTAL_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the orientation class for the split pane handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.SplitPane.prototype.setOrientationClassForHandle = function() {
  if (this.isVertical()) {
    goog.dom.classes.swap(this.splitpaneHandle_,
                          goog.ui.SplitPane.HANDLE_CLASS_NAME_HORIZONTAL_,
                          goog.ui.SplitPane.HANDLE_CLASS_NAME_VERTICAL_);
  } else {
    goog.dom.classes.swap(this.splitpaneHandle_,
                          goog.ui.SplitPane.HANDLE_CLASS_NAME_VERTICAL_,
                          goog.ui.SplitPane.HANDLE_CLASS_NAME_HORIZONTAL_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the orientation of the split pane.
***REMOVED*** @param {goog.ui.SplitPane.Orientation} orientation SplitPane orientation.
***REMOVED***
goog.ui.SplitPane.prototype.setOrientation = function(orientation) {
  if (this.orientation_ != orientation) {
    this.orientation_ = orientation;
    var isVertical = this.isVertical();

    // If the split pane is already in document, then the positions and sizes
    // need to be adjusted.
    if (this.isInDocument()) {
      this.setOrientationClassForHandle();
      // TODO(user): Should handleSize_ and initialSize_ also be adjusted ?
      if (goog.isNumber(this.firstComponentSize_)) {
        var splitpaneSize = goog.style.getBorderBoxSize(this.getElement());
        var ratio = isVertical ? splitpaneSize.height / splitpaneSize.width :
            splitpaneSize.width / splitpaneSize.height;
        // TODO(user): Fix the behaviour for the case when the handle is
        // placed on either of  the edges of the split pane. Also, similar
        // behaviour is present in {@link #setSize}. Probably need to modify
        // {@link #setFirstComponentSize}.
        this.setFirstComponentSize(this.firstComponentSize_***REMOVED*** ratio);
      } else {
        this.setFirstComponentSize();
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the orientation of the split pane.
***REMOVED*** @return {goog.ui.SplitPane.Orientation} The orientation.
***REMOVED***
goog.ui.SplitPane.prototype.getOrientation = function() {
  return this.orientation_;
***REMOVED***


***REMOVED***
***REMOVED*** Move and resize a container.  The sizing changes the BorderBoxSize.
***REMOVED*** @param {Element} element The element to move and size.
***REMOVED*** @param {goog.math.Rect} rect The top, left, width and height to change to.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.moveAndSize_ = function(element, rect) {

  goog.style.setPosition(element, rect.left, rect.top);
  // TODO(user): Add a goog.math.Size.max call for below.
  goog.style.setBorderBoxSize(element,
      new goog.math.Size(Math.max(rect.width, 0), Math.max(rect.height, 0)));
***REMOVED***


***REMOVED***
***REMOVED*** @return {?number} The size of the left/top component.
***REMOVED***
goog.ui.SplitPane.prototype.getFirstComponentSize = function() {
  return this.firstComponentSize_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the size of the left/top component, and resize the other component based
***REMOVED*** on that size and handle size.
***REMOVED*** @param {?number=} opt_size The size of the top or left, in pixels.
***REMOVED***
goog.ui.SplitPane.prototype.setFirstComponentSize = function(opt_size) {
  var top = 0, left = 0;
  var splitpaneSize = goog.style.getBorderBoxSize(this.getElement());

  var isVertical = this.isVertical();
  // Figure out first component size; it's either passed in, taken from the
  // saved size, or is half of the total size.
  var firstComponentSize = goog.isNumber(opt_size) ? opt_size :
      goog.isNumber(this.firstComponentSize_) ? this.firstComponentSize_ :
      Math.floor((isVertical ? splitpaneSize.height : splitpaneSize.width) / 2);
  this.firstComponentSize_ = firstComponentSize;

  var firstComponentWidth;
  var firstComponentHeight;
  var secondComponentWidth;
  var secondComponentHeight;
  var handleWidth;
  var handleHeight;
  var secondComponentLeft;
  var secondComponentTop;
  var handleLeft;
  var handleTop;

  if (isVertical) {

    // Width for the handle and the first and second components will be the
    // width of the split pane. The height for the first component will be
    // the calculated first component size. The height for the second component
    // will be the  total height minus the heights of the first component and
    // the handle.
    firstComponentHeight = firstComponentSize;
    firstComponentWidth = splitpaneSize.width;
    handleWidth = splitpaneSize.width;
    handleHeight = this.handleSize_;
    secondComponentHeight = splitpaneSize.height - firstComponentHeight -
        handleHeight;
    secondComponentWidth = splitpaneSize.width;
    handleTop = top + firstComponentHeight;
    handleLeft = left;
    secondComponentTop = handleTop + handleHeight;
    secondComponentLeft = left;
  } else {

    // Height for the handle and the first and second components will be the
    // height of the split pane. The width for the first component will be
    // the calculated first component size. The width for the second component
    // will be the  total width minus the widths of the first component and
    // the handle.
    firstComponentWidth = firstComponentSize;
    firstComponentHeight = splitpaneSize.height;
    handleWidth = this.handleSize_;
    handleHeight = splitpaneSize.height;
    secondComponentWidth = splitpaneSize.width - firstComponentWidth -
        handleWidth;
    secondComponentHeight = splitpaneSize.height;
    handleLeft = left + firstComponentWidth;
    handleTop = top;
    secondComponentLeft = handleLeft + handleWidth;
    secondComponentTop = top;
  }

  // Now move and size the containers.
  this.moveAndSize_(this.firstComponentContainer_,
      new goog.math.Rect(left, top, firstComponentWidth, firstComponentHeight));

  if (typeof this.firstComponent_.resize == 'function') {
    this.firstComponent_.resize(new goog.math.Size(
        firstComponentWidth, firstComponentHeight));
  }

  this.moveAndSize_(this.splitpaneHandle_, new goog.math.Rect(handleLeft,
      handleTop, handleWidth, handleHeight));

  this.moveAndSize_(this.secondComponentContainer_,
      new goog.math.Rect(secondComponentLeft, secondComponentTop,
          secondComponentWidth, secondComponentHeight));

  if (typeof this.secondComponent_.resize == 'function') {
    this.secondComponent_.resize(new goog.math.Size(secondComponentWidth,
        secondComponentHeight));
  }
  // Fire a CHANGE event.
  this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
***REMOVED***


***REMOVED***
***REMOVED*** Dummy object to work around compiler warning.
***REMOVED*** TODO(arv): Fix compiler or refactor to not depend on resize()
***REMOVED*** @private
***REMOVED*** @type {Object}
***REMOVED***
goog.ui.SplitPane.resizeWarningWorkaround_ = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @param {goog.math.Size} size The new size.
 ***REMOVED*****REMOVED***
  resize: function(size) {}
***REMOVED***


***REMOVED***
 ***REMOVED*** Set the size of the splitpane.  This is usually called by the controlling
 ***REMOVED*** application.  This will set the SplitPane BorderBoxSize.
 ***REMOVED*** @param {goog.math.Size} size The size to set the splitpane.
***REMOVED*****REMOVED***
goog.ui.SplitPane.prototype.setSize = function(size) {
  goog.style.setBorderBoxSize(this.getElement(), size);
  if (this.iframeOverlay_) {
    goog.style.setBorderBoxSize(this.iframeOverlay_, size);
  }
  this.setFirstComponentSize();
***REMOVED***


***REMOVED***
***REMOVED*** Snap the container to the left or top on a Double-click.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.snapIt_ = function() {
  var handlePos = goog.style.getRelativePosition(this.splitpaneHandle_,
      this.firstComponentContainer_);
  var firstBorderBoxSize =
      goog.style.getBorderBoxSize(this.firstComponentContainer_);
  var firstContentBoxSize =
      goog.style.getContentBoxSize(this.firstComponentContainer_);

  var isVertical = this.isVertical();

  // Where do we snap the handle (what size to make the component) and what
  // is the current handle position.
  var snapSize;
  var handlePosition;
  if (isVertical) {
    snapSize = firstBorderBoxSize.height - firstContentBoxSize.height;
    handlePosition = handlePos.y;
  } else {
    snapSize = firstBorderBoxSize.width - firstContentBoxSize.width;
    handlePosition = handlePos.x;
  }

  if (snapSize == handlePosition) {
    // This means we're 'unsnapping', set it back to where it was.
    this.setFirstComponentSize(this.savedSnapSize_);
  } else {
    // This means we're 'snapping', set the size to snapSize, and hide the
    // first component.
    if (isVertical) {
      this.savedSnapSize_ = goog.style.getBorderBoxSize(
          this.firstComponentContainer_).height;
    } else {
      this.savedSnapSize_ = goog.style.getBorderBoxSize(
          this.firstComponentContainer_).width;
    }
    this.setFirstComponentSize(snapSize);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle the start drag event - set up the dragger.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.handleDragStart_ = function(e) {

  // Setup iframe overlay to prevent iframes from grabbing events.
  if (!this.iframeOverlay_) {
    // Create the overlay.
    var cssStyles = 'position: relative';

    if (goog.userAgent.IE) {
      // IE doesn't look at this div unless it has a background, so we'll
      // put one on, but make it opaque.
      cssStyles += ';background-color: #000;filter: Alpha(Opacity=0)';
    }
    this.iframeOverlay_ =
        this.getDomHelper().createDom('div', {'style': cssStyles});

    this.getDomHelper().appendChild(this.getElement(), this.iframeOverlay_);
  }
  this.iframeOverlay_.style.zIndex =
      goog.ui.SplitPane.IframeOverlayIndex_.OVERLAY;

  goog.style.setBorderBoxSize(this.iframeOverlay_,
      goog.style.getBorderBoxSize(this.getElement()));

  var pos = goog.style.getPosition(this.firstComponentContainer_);

  // For the size of the limiting box, we add the container content box sizes
  // so that if the handle is placed all the way to the end or the start, the
  // border doesn't exceed the total size. For position, we add the difference
  // between the border box and content box sizes of the first container to the
  // position of the first container. The start position should be such that
  // there is no overlap of borders.
  var limitWidth = 0;
  var limitHeight = 0;
  var limitx = pos.x;
  var limity = pos.y;
  var firstBorderBoxSize =
      goog.style.getBorderBoxSize(this.firstComponentContainer_);
  var firstContentBoxSize =
      goog.style.getContentBoxSize(this.firstComponentContainer_);
  var secondContentBoxSize =
      goog.style.getContentBoxSize(this.secondComponentContainer_);
  if (this.isVertical()) {
    limitHeight = firstContentBoxSize.height + secondContentBoxSize.height;
    limity += firstBorderBoxSize.height - firstContentBoxSize.height;
  } else {
    limitWidth = firstContentBoxSize.width + secondContentBoxSize.width;
    limitx += firstBorderBoxSize.width - firstContentBoxSize.width;
  }
  var limits = new goog.math.Rect(limitx, limity, limitWidth, limitHeight);
  this.splitDragger_.setLimits(limits);
***REMOVED***


***REMOVED***
***REMOVED*** Find the location relative to the splitpane.
***REMOVED*** @param {number} left The x location relative to the window.
***REMOVED*** @return {number} The relative x location.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.getRelativeLeft_ = function(left) {
  return left - goog.style.getPosition(this.firstComponentContainer_).x;
***REMOVED***


***REMOVED***
***REMOVED*** Find the location relative to the splitpane.
***REMOVED*** @param {number} top The y location relative to the window.
***REMOVED*** @return {number} The relative y location.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.getRelativeTop_ = function(top) {
  return top - goog.style.getPosition(this.firstComponentContainer_).y;
***REMOVED***


***REMOVED***
***REMOVED*** Handle the drag event. Move the containers.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.handleDrag_ = function(e) {
  if (this.continuousResize_) {
    if (this.isVertical()) {
      var top = this.getRelativeTop_(e.top);
      this.setFirstComponentSize(top);
    } else {
      var left = this.getRelativeLeft_(e.left);
      this.setFirstComponentSize(left);
    }
    this.dispatchEvent(goog.ui.SplitPane.EventType.HANDLE_DRAG);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle the drag end event. If we're not doing continuous resize,
***REMOVED*** resize the component.  If we're doing continuous resize, the component
***REMOVED*** is already the correct size.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.handleDragEnd_ = function(e) {
  // Push iframe overlay down.
  this.iframeOverlay_.style.zIndex =
      goog.ui.SplitPane.IframeOverlayIndex_.HIDDEN;
  if (!this.continuousResize_) {
    if (this.isVertical()) {
      var top = this.getRelativeTop_(e.top);
      this.setFirstComponentSize(top);
    } else {
      var left = this.getRelativeLeft_(e.left);
      this.setFirstComponentSize(left);
    }
  }

  this.dispatchEvent(goog.ui.SplitPane.EventType.HANDLE_DRAG_END);
***REMOVED***


***REMOVED***
***REMOVED*** Handle the Double-click. Call the snapIt method which snaps the container
***REMOVED*** to the top or left.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitPane.prototype.handleDoubleClick_ = function(e) {
  this.snapIt_();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SplitPane.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.splitDragger_.dispose();
  this.splitDragger_ = null;

  goog.dom.removeNode(this.iframeOverlay_);
  this.iframeOverlay_ = null;
***REMOVED***
