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
***REMOVED*** @fileoverview A thicker wrapper around the DOM element returned from
***REMOVED*** the different draw methods of the graphics implementation, and
***REMOVED*** all interfaces that the various element types support.
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.graphics.ext.Element');

goog.require('goog.events.EventTarget');
goog.require('goog.functions');
goog.require('goog.graphics.ext.coordinates');



***REMOVED***
***REMOVED*** Base class for a wrapper around the goog.graphics wrapper that enables
***REMOVED*** more advanced functionality.
***REMOVED*** @param {goog.graphics.ext.Group?} group Parent for this element.
***REMOVED*** @param {goog.graphics.Element} wrapper The thin wrapper to wrap.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.graphics.ext.Element = function(group, wrapper) {
  goog.events.EventTarget.call(this);
  this.wrapper_ = wrapper;
  this.graphics_ = group ? group.getGraphics() : this;

  this.xPosition_ = new goog.graphics.ext.Element.Position_(this, true);
  this.yPosition_ = new goog.graphics.ext.Element.Position_(this, false);

  // Handle parent / child relationships.
  if (group) {
    this.parent_ = group;
    this.parent_.addChild(this);
  }
***REMOVED***
goog.inherits(goog.graphics.ext.Element, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The graphics object that contains this element.
***REMOVED*** @type {goog.graphics.ext.Graphics|goog.graphics.ext.Element}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.graphics_;


***REMOVED***
***REMOVED*** The goog.graphics wrapper this class wraps.
***REMOVED*** @type {goog.graphics.Element}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.wrapper_;


***REMOVED***
***REMOVED*** The group or surface containing this element.
***REMOVED*** @type {goog.graphics.ext.Group|undefined}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.parent_;


***REMOVED***
***REMOVED*** Whether or not computation of this element's position or size depends on its
***REMOVED*** parent's size.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.parentDependent_ = false;


***REMOVED***
***REMOVED*** Whether the element has pending transformations.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.needsTransform_ = false;


***REMOVED***
***REMOVED*** The current angle of rotation, expressed in degrees.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.rotation_ = 0;


***REMOVED***
***REMOVED*** Object representing the x position and size of the element.
***REMOVED*** @type {goog.graphics.ext.Element.Position_}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.xPosition_;


***REMOVED***
***REMOVED*** Object representing the y position and size of the element.
***REMOVED*** @type {goog.graphics.ext.Element.Position_}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.yPosition_;


***REMOVED*** @return {goog.graphics.Element} The underlying thin wrapper.***REMOVED***
goog.graphics.ext.Element.prototype.getWrapper = function() {
  return this.wrapper_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.graphics.ext.Element|goog.graphics.ext.Graphics} The graphics
***REMOVED***     surface the element is a part of.
***REMOVED***
goog.graphics.ext.Element.prototype.getGraphics = function() {
  return this.graphics_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the graphics implementation.
***REMOVED*** @return {goog.graphics.AbstractGraphics} The underlying graphics
***REMOVED***     implementation drawing this element's wrapper.
***REMOVED*** @protected
***REMOVED***
goog.graphics.ext.Element.prototype.getGraphicsImplementation = function() {
  return this.graphics_.getImplementation();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.graphics.ext.Group|undefined} The parent of this element.
***REMOVED***
goog.graphics.ext.Element.prototype.getParent = function() {
  return this.parent_;
***REMOVED***


// GENERAL POSITIONING


***REMOVED***
***REMOVED*** Internal convenience method for setting position - either as a left/top,
***REMOVED*** center/middle, or right/bottom value.  Only one should be specified.
***REMOVED*** @param {goog.graphics.ext.Element.Position_} position The position object to
***REMOVED***     set the value on.
***REMOVED*** @param {number|string} value The value of the coordinate.
***REMOVED*** @param {goog.graphics.ext.Element.PositionType_} type The type of the
***REMOVED***     coordinate.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.setPosition_ = function(position, value,
    type, opt_chain) {
  position.setPosition(value, type);
  this.computeIsParentDependent_(position);

  this.needsTransform_ = true;
  if (!opt_chain) {
    this.transform();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the width/height of the element.
***REMOVED*** @param {goog.graphics.ext.Element.Position_} position The position object to
***REMOVED***     set the value on.
***REMOVED*** @param {string|number} size The new width/height value.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.setSize_ = function(position, size,
    opt_chain) {
  if (position.setSize(size)) {
    this.needsTransform_ = true;

    this.computeIsParentDependent_(position);

    if (!opt_chain) {
      this.reset();
    }
  } else if (!opt_chain && this.isPendingTransform()) {
    this.reset();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimum width/height of the element.
***REMOVED*** @param {goog.graphics.ext.Element.Position_} position The position object to
***REMOVED***     set the value on.
***REMOVED*** @param {string|number} minSize The minimum width/height of the element.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.setMinSize_ = function(position, minSize) {
  position.setMinSize(minSize);
  this.needsTransform_ = true;
  this.computeIsParentDependent_(position);
***REMOVED***


// HORIZONTAL POSITIONING


***REMOVED***
***REMOVED*** @return {number} The distance from the left edge of this element to the left
***REMOVED***     edge of its parent, specified in units of the parent's coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getLeft = function() {
  return this.xPosition_.getStart();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the left coordinate of the element.  Overwrites any previous value of
***REMOVED*** left, center, or right for this element.
***REMOVED*** @param {string|number} left The left coordinate.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setLeft = function(left, opt_chain) {
  this.setPosition_(this.xPosition_,
      left,
      goog.graphics.ext.Element.PositionType_.START,
      opt_chain);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The right coordinate of the element, in units of the
***REMOVED***     parent's coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getRight = function() {
  return this.xPosition_.getEnd();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the right coordinate of the element.  Overwrites any previous value of
***REMOVED*** left, center, or right for this element.
***REMOVED*** @param {string|number} right The right coordinate.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setRight = function(right, opt_chain) {
  this.setPosition_(this.xPosition_,
      right,
      goog.graphics.ext.Element.PositionType_.END,
      opt_chain);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The center coordinate of the element, in units of the
***REMOVED*** parent's coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getCenter = function() {
  return this.xPosition_.getMiddle();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the center coordinate of the element.  Overwrites any previous value of
***REMOVED*** left, center, or right for this element.
***REMOVED*** @param {string|number} center The center coordinate.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setCenter = function(center, opt_chain) {
  this.setPosition_(this.xPosition_,
      center,
      goog.graphics.ext.Element.PositionType_.MIDDLE,
      opt_chain);
***REMOVED***


// VERTICAL POSITIONING


***REMOVED***
***REMOVED*** @return {number} The distance from the top edge of this element to the top
***REMOVED***     edge of its parent, specified in units of the parent's coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getTop = function() {
  return this.yPosition_.getStart();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the top coordinate of the element.  Overwrites any previous value of
***REMOVED*** top, middle, or bottom for this element.
***REMOVED*** @param {string|number} top The top coordinate.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setTop = function(top, opt_chain) {
  this.setPosition_(this.yPosition_,
      top,
      goog.graphics.ext.Element.PositionType_.START,
      opt_chain);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The bottom coordinate of the element, in units of the
***REMOVED***     parent's coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getBottom = function() {
  return this.yPosition_.getEnd();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the bottom coordinate of the element.  Overwrites any previous value of
***REMOVED*** top, middle, or bottom for this element.
***REMOVED*** @param {string|number} bottom The bottom coordinate.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setBottom = function(bottom, opt_chain) {
  this.setPosition_(this.yPosition_,
      bottom,
      goog.graphics.ext.Element.PositionType_.END,
      opt_chain);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The middle coordinate of the element, in units of the
***REMOVED***     parent's coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getMiddle = function() {
  return this.yPosition_.getMiddle();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the middle coordinate of the element.  Overwrites any previous value of
***REMOVED*** top, middle, or bottom for this element
***REMOVED*** @param {string|number} middle The middle coordinate.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setMiddle = function(middle, opt_chain) {
  this.setPosition_(this.yPosition_,
      middle,
      goog.graphics.ext.Element.PositionType_.MIDDLE,
      opt_chain);
***REMOVED***


// DIMENSIONS


***REMOVED***
***REMOVED*** @return {number} The width of the element, in units of the parent's
***REMOVED***     coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getWidth = function() {
  return this.xPosition_.getSize();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the width of the element.
***REMOVED*** @param {string|number} width The new width value.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setWidth = function(width, opt_chain) {
  this.setSize_(this.xPosition_, width, opt_chain);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The minimum width of the element, in units of the parent's
***REMOVED***     coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getMinWidth = function() {
  return this.xPosition_.getMinSize();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimum width of the element.
***REMOVED*** @param {string|number} minWidth The minimum width of the element.
***REMOVED***
goog.graphics.ext.Element.prototype.setMinWidth = function(minWidth) {
  this.setMinSize_(this.xPosition_, minWidth);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The height of the element, in units of the parent's
***REMOVED***     coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getHeight = function() {
  return this.yPosition_.getSize();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the height of the element.
***REMOVED*** @param {string|number} height The new height value.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setHeight = function(height, opt_chain) {
  this.setSize_(this.yPosition_, height, opt_chain);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The minimum height of the element, in units of the parent's
***REMOVED***     coordinate system.
***REMOVED***
goog.graphics.ext.Element.prototype.getMinHeight = function() {
  return this.yPosition_.getMinSize();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimum height of the element.
***REMOVED*** @param {string|number} minHeight The minimum height of the element.
***REMOVED***
goog.graphics.ext.Element.prototype.setMinHeight = function(minHeight) {
  this.setMinSize_(this.yPosition_, minHeight);
***REMOVED***


// BOUNDS SHORTCUTS


***REMOVED***
***REMOVED*** Shortcut for setting the left and top position.
***REMOVED*** @param {string|number} left The left coordinate.
***REMOVED*** @param {string|number} top The top coordinate.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setPosition = function(left, top,
                                                           opt_chain) {
  this.setLeft(left, true);
  this.setTop(top, opt_chain);
***REMOVED***


***REMOVED***
***REMOVED*** Shortcut for setting the width and height.
***REMOVED*** @param {string|number} width The new width value.
***REMOVED*** @param {string|number} height The new height value.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setSize = function(width, height,
                                                       opt_chain) {
  this.setWidth(width, true);
  this.setHeight(height, opt_chain);
***REMOVED***


***REMOVED***
***REMOVED*** Shortcut for setting the left, top, width, and height.
***REMOVED*** @param {string|number} left The left coordinate.
***REMOVED*** @param {string|number} top The top coordinate.
***REMOVED*** @param {string|number} width The new width value.
***REMOVED*** @param {string|number} height The new height value.
***REMOVED*** @param {boolean=} opt_chain Optional flag to specify this function is part
***REMOVED***     of a chain of calls and therefore transformations should be set as
***REMOVED***     pending but not yet performed.
***REMOVED***
goog.graphics.ext.Element.prototype.setBounds = function(left, top, width,
                                                         height, opt_chain) {
  this.setLeft(left, true);
  this.setTop(top, true);
  this.setWidth(width, true);
  this.setHeight(height, opt_chain);
***REMOVED***


// MAXIMUM BOUNDS


***REMOVED***
***REMOVED*** @return {number} An estimate of the maximum x extent this element would have
***REMOVED***     in a parent of no width.
***REMOVED***
goog.graphics.ext.Element.prototype.getMaxX = function() {
  return this.xPosition_.getMaxPosition();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} An estimate of the maximum y extent this element would have
***REMOVED***     in a parent of no height.
***REMOVED***
goog.graphics.ext.Element.prototype.getMaxY = function() {
  return this.yPosition_.getMaxPosition();
***REMOVED***


// RESET


***REMOVED***
***REMOVED*** Reset the element.  This is called when the element changes size, or when
***REMOVED*** the coordinate system changes in a way that would affect pixel based
***REMOVED*** rendering
***REMOVED***
goog.graphics.ext.Element.prototype.reset = function() {
  this.xPosition_.resetCache();
  this.yPosition_.resetCache();

  this.redraw();

  this.needsTransform_ = true;
  this.transform();
***REMOVED***


***REMOVED***
***REMOVED*** Overridable function for subclass specific reset.
***REMOVED*** @protected
***REMOVED***
goog.graphics.ext.Element.prototype.redraw = goog.nullFunction;


// PARENT DEPENDENCY


***REMOVED***
***REMOVED*** Computes whether the element is still parent dependent.
***REMOVED*** @param {goog.graphics.ext.Element.Position_} position The recently changed
***REMOVED***     position object.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.prototype.computeIsParentDependent_ = function(
    position) {
  this.parentDependent_ = position.isParentDependent() ||
      this.xPosition_.isParentDependent() ||
      this.yPosition_.isParentDependent() ||
      this.checkParentDependent();
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether this element's bounds depend on its parents.
***REMOVED***
***REMOVED*** This function should be treated as if it has package scope.
***REMOVED*** @return {boolean} Whether this element's bounds depend on its parents.
***REMOVED***
goog.graphics.ext.Element.prototype.isParentDependent = function() {
  return this.parentDependent_;
***REMOVED***


***REMOVED***
***REMOVED*** Overridable function for subclass specific parent dependency.
***REMOVED*** @return {boolean} Whether this shape's bounds depends on its parent's.
***REMOVED*** @protected
***REMOVED***
goog.graphics.ext.Element.prototype.checkParentDependent =
    goog.functions.FALSE;


// ROTATION


***REMOVED***
***REMOVED*** Set the rotation of this element.
***REMOVED*** @param {number} angle The angle of rotation, in degrees.
***REMOVED***
goog.graphics.ext.Element.prototype.setRotation = function(angle) {
  if (this.rotation_ != angle) {
    this.rotation_ = angle;

    this.needsTransform_ = true;
    this.transform();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The angle of rotation of this element, in degrees.
***REMOVED***
goog.graphics.ext.Element.prototype.getRotation = function() {
  return this.rotation_;
***REMOVED***


// TRANSFORMS


***REMOVED***
***REMOVED*** Called by the parent when the parent has transformed.
***REMOVED***
***REMOVED*** Should be treated as package scope.
***REMOVED***
goog.graphics.ext.Element.prototype.parentTransform = function() {
  this.needsTransform_ = this.needsTransform_ || this.parentDependent_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether this element has pending transforms.
***REMOVED***
goog.graphics.ext.Element.prototype.isPendingTransform = function() {
  return this.needsTransform_;
***REMOVED***


***REMOVED***
***REMOVED*** Performs a pending transform.
***REMOVED*** @protected
***REMOVED***
goog.graphics.ext.Element.prototype.transform = function() {
  if (this.isPendingTransform()) {
    this.needsTransform_ = false;

    this.wrapper_.setTransformation(
        this.getLeft(),
        this.getTop(),
        this.rotation_,
        (this.getWidth() || 1) / 2,
        (this.getHeight() || 1) / 2);

    // TODO(robbyw): this._fireEvent('transform', [ this ]);
  }
***REMOVED***


// PIXEL SCALE


***REMOVED***
***REMOVED*** @return {number} Returns the number of pixels per unit in the x direction.
***REMOVED***
goog.graphics.ext.Element.prototype.getPixelScaleX = function() {
  return this.getGraphics().getPixelScaleX();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Returns the number of pixels per unit in the y direction.
***REMOVED***
goog.graphics.ext.Element.prototype.getPixelScaleY = function() {
  return this.getGraphics().getPixelScaleY();
***REMOVED***


// EVENT HANDLING


***REMOVED*** @override***REMOVED***
goog.graphics.ext.Element.prototype.disposeInternal = function() {
  goog.graphics.ext.Element.superClass_.disposeInternal.call();
  this.wrapper_.dispose();
***REMOVED***


// INTERNAL POSITION OBJECT


***REMOVED***
***REMOVED*** Position specification types.  Start corresponds to left/top, middle to
***REMOVED*** center/middle, and end to right/bottom.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.PositionType_ = {
  START: 0,
  MIDDLE: 1,
  END: 2
***REMOVED***



***REMOVED***
***REMOVED*** Manages a position and size, either horizontal or vertical.
***REMOVED*** @param {goog.graphics.ext.Element} element The element the position applies
***REMOVED***     to.
***REMOVED*** @param {boolean} horizontal Whether the position is horizontal or vertical.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_ = function(element, horizontal) {
  this.element_ = element;
  this.horizontal_ = horizontal;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Object} The coordinate value computation cache.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.getCoordinateCache_ = function() {
  return this.coordinateCache_ || (this.coordinateCache_ = {});
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The size of the parent's coordinate space.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.getParentSize_ = function() {
  var parent = this.element_.getParent();
  return this.horizontal_ ?
      parent.getCoordinateWidth() :
      parent.getCoordinateHeight();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The minimum width/height of the element.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.getMinSize = function() {
  return this.getValue_(this.minSize_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minimum width/height of the element.
***REMOVED*** @param {string|number} minSize The minimum width/height of the element.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.setMinSize = function(minSize) {
  this.minSize_ = minSize;
  this.resetCache();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The width/height of the element.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.getSize = function() {
  return Math.max(this.getValue_(this.size_), this.getMinSize());
***REMOVED***


***REMOVED***
***REMOVED*** Sets the width/height of the element.
***REMOVED*** @param {string|number} size The width/height of the element.
***REMOVED*** @return {boolean} Whether the value was changed.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.setSize = function(size) {
  if (size != this.size_) {
    this.size_ = size;
    this.resetCache();
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Converts the given x coordinate to a number value in units.
***REMOVED*** @param {string|number} v The coordinate to retrieve the value for.
***REMOVED*** @param {boolean=} opt_forMaximum Whether we are computing the largest value
***REMOVED***     this coordinate would be in a parent of no size.
***REMOVED*** @return {number} The correct number of coordinate space units.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.getValue_ = function(v,
    opt_forMaximum) {
  if (!goog.graphics.ext.coordinates.isSpecial(v)) {
    return parseFloat(String(v));
  }

  var cache = this.getCoordinateCache_();
  var scale = this.horizontal_ ?
      this.element_.getPixelScaleX() :
      this.element_.getPixelScaleY();

  var containerSize;
  if (opt_forMaximum) {
    containerSize = goog.graphics.ext.coordinates.computeValue(
        this.size_ || 0, 0, scale);
  } else {
    var parent = this.element_.getParent();
    containerSize = this.horizontal_ ? parent.getWidth() : parent.getHeight();
  }

  return goog.graphics.ext.coordinates.getValue(v, opt_forMaximum,
      containerSize, scale, cache);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The distance from the left/top edge of this element to the
***REMOVED***     left/top edge of its parent, specified in units of the parent's
***REMOVED***     coordinate system.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.getStart = function() {
  if (this.cachedValue_ == null) {
    var value = this.getValue_(this.distance_);
    if (this.distanceType_ == goog.graphics.ext.Element.PositionType_.START) {
      this.cachedValue_ = value;
    } else if (this.distanceType_ ==
               goog.graphics.ext.Element.PositionType_.MIDDLE) {
      this.cachedValue_ = value + (this.getParentSize_() - this.getSize()) / 2;
    } else {
      this.cachedValue_ = this.getParentSize_() - value - this.getSize();
    }
  }

  return this.cachedValue_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The middle coordinate of the element, in units of the
***REMOVED***     parent's coordinate system.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.getMiddle = function() {
  return this.distanceType_ == goog.graphics.ext.Element.PositionType_.MIDDLE ?
      this.getValue_(this.distance_) :
      (this.getParentSize_() - this.getSize()) / 2 - this.getStart();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The end coordinate of the element, in units of the
***REMOVED***     parent's coordinate system.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.getEnd = function() {
  return this.distanceType_ == goog.graphics.ext.Element.PositionType_.END ?
      this.getValue_(this.distance_) :
      this.getParentSize_() - this.getStart() - this.getSize();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the position, either as a left/top, center/middle, or right/bottom
***REMOVED*** value.
***REMOVED*** @param {number|string} value The value of the coordinate.
***REMOVED*** @param {goog.graphics.ext.Element.PositionType_} type The type of the
***REMOVED***     coordinate.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.setPosition = function(value,
    type) {
  this.distance_ = value;
  this.distanceType_ = type;

  // Clear cached value.
  this.cachedValue_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} An estimate of the maximum x/y extent this element would
***REMOVED***     have in a parent of no width/height.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.getMaxPosition = function() {
  // TODO(robbyw): Handle transformed or rotated coordinates
  // TODO(robbyw): Handle pixel based sizes?

  return this.getValue_(this.distance_ || 0) + (
      goog.graphics.ext.coordinates.isSpecial(this.size_) ? 0 : this.getSize());
***REMOVED***


***REMOVED***
***REMOVED*** Resets the caches of position values and coordinate values.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.resetCache = function() {
  this.coordinateCache_ = null;
  this.cachedValue_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the size or position of this element depends on
***REMOVED***     the size of the parent element.
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.isParentDependent = function() {
  return this.distanceType_ != goog.graphics.ext.Element.PositionType_.START ||
      goog.graphics.ext.coordinates.isSpecial(this.size_) ||
      goog.graphics.ext.coordinates.isSpecial(this.minSize_) ||
      goog.graphics.ext.coordinates.isSpecial(this.distance_);
***REMOVED***


***REMOVED***
***REMOVED*** The lazy loaded distance from the parent's top/left edge to this element's
***REMOVED*** top/left edge expressed in the parent's coordinate system.  We cache this
***REMOVED*** because it is most freqeuently requested by the element and it is easy to
***REMOVED*** compute middle and end values from it.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.cachedValue_ = null;


***REMOVED***
***REMOVED*** A cache of computed x coordinates.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.coordinateCache_ = null;


***REMOVED***
***REMOVED*** The minimum width/height of this element, as specified by the caller.
***REMOVED*** @type {string|number}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.minSize_ = 0;


***REMOVED***
***REMOVED*** The width/height of this object, as specified by the caller.
***REMOVED*** @type {string|number}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.size_ = 0;


***REMOVED***
***REMOVED*** The coordinate of this object, as specified by the caller.  The type of
***REMOVED*** coordinate is specified by distanceType_.
***REMOVED*** @type {string|number}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.distance_ = 0;


***REMOVED***
***REMOVED*** The coordinate type specified by distance_.
***REMOVED*** @type {goog.graphics.ext.Element.PositionType_}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.Element.Position_.prototype.distanceType_ =
    goog.graphics.ext.Element.PositionType_.START;

