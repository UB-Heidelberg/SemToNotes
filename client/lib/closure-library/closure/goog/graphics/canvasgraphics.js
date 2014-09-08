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
***REMOVED*** @fileoverview CanvasGraphics sub class that uses the canvas tag for drawing.
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author wcrosby@google.com (Wayne Crosby)
***REMOVED***


goog.provide('goog.graphics.CanvasGraphics');


***REMOVED***
goog.require('goog.graphics.AbstractGraphics');
goog.require('goog.graphics.CanvasEllipseElement');
goog.require('goog.graphics.CanvasGroupElement');
goog.require('goog.graphics.CanvasImageElement');
goog.require('goog.graphics.CanvasPathElement');
goog.require('goog.graphics.CanvasRectElement');
goog.require('goog.graphics.CanvasTextElement');
goog.require('goog.graphics.SolidFill');
goog.require('goog.math.Size');
goog.require('goog.style');



***REMOVED***
***REMOVED*** A Graphics implementation for drawing using canvas.
***REMOVED*** @param {string|number} width The (non-zero) width in pixels.  Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {string|number} height The (non-zero) height in pixels.  Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {?number=} opt_coordWidth The coordinate width - if
***REMOVED***     omitted or null, defaults to same as width.
***REMOVED*** @param {?number=} opt_coordHeight The coordinate height - if
***REMOVED***     omitted or null, defaults to same as height.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED***
***REMOVED*** @extends {goog.graphics.AbstractGraphics}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED***
goog.graphics.CanvasGraphics = function(width, height,
                                        opt_coordWidth, opt_coordHeight,
                                        opt_domHelper) {
  goog.graphics.AbstractGraphics.call(this, width, height,
                                      opt_coordWidth, opt_coordHeight,
                                      opt_domHelper);
***REMOVED***
goog.inherits(goog.graphics.CanvasGraphics, goog.graphics.AbstractGraphics);


***REMOVED***
***REMOVED*** Sets the fill for the given element.
***REMOVED*** @param {goog.graphics.StrokeAndFillElement} element The element
***REMOVED***     wrapper.
***REMOVED*** @param {goog.graphics.Fill} fill The fill object.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.setElementFill = function(element,
    fill) {
  this.redraw();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the stroke for the given element.
***REMOVED*** @param {goog.graphics.StrokeAndFillElement} element The element
***REMOVED***     wrapper.
***REMOVED*** @param {goog.graphics.Stroke} stroke The stroke object.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.setElementStroke = function(
    element, stroke) {
  this.redraw();
***REMOVED***


***REMOVED***
***REMOVED*** Set the transformation of an element.
***REMOVED*** @param {goog.graphics.Element} element The element wrapper.
***REMOVED*** @param {number} x The x coordinate of the translation transform.
***REMOVED*** @param {number} y The y coordinate of the translation transform.
***REMOVED*** @param {number} angle The angle of the rotation transform.
***REMOVED*** @param {number} centerX The horizontal center of the rotation transform.
***REMOVED*** @param {number} centerY The vertical center of the rotation transform.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.setElementTransform = function(element,
    x, y, angle, centerX, centerY) {
  this.redraw();
***REMOVED***


***REMOVED***
***REMOVED*** Push an element transform on to the transform stack.
***REMOVED*** @param {goog.graphics.Element} element The transformed element.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.pushElementTransform = function(
    element) {
  var ctx = this.getContext();
  ctx.save();

  var transform = element.getTransform();

  // TODO(robbyw): Test for unsupported transforms i.e. skews.
  var tx = transform.getTranslateX();
  var ty = transform.getTranslateY();
  if (tx || ty) {
    ctx.translate(tx, ty);
  }

  var sinTheta = transform.getShearY();
  if (sinTheta) {
    ctx.rotate(Math.asin(sinTheta));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Pop an element transform off of the transform stack.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.popElementTransform = function() {
  this.getContext().restore();
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DOM representation of the graphics area.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.createDom = function() {
  var element = this.dom_.createDom('div',
      {'style': 'position:relative;overflow:hidden'});
  this.setElementInternal(element);

  this.canvas_ = this.dom_.createDom('canvas');
  element.appendChild(this.canvas_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The main canvas element.
  ***REMOVED*** @type {goog.graphics.CanvasGroupElement}
 ***REMOVED*****REMOVED***
  this.canvasElement = new goog.graphics.CanvasGroupElement(this);

  this.lastGroup_ = this.canvasElement;
  this.redrawTimeout_ = 0;

  this.updateSize();
***REMOVED***


***REMOVED***
***REMOVED*** Clears the drawing context object in response to actions that make the old
***REMOVED*** context invalid - namely resize of the canvas element.
***REMOVED*** @private
***REMOVED***
goog.graphics.CanvasGraphics.prototype.clearContext_ = function() {
  this.context_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the drawing context.
***REMOVED*** @return {Object} The canvas element rendering context.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.getContext = function() {
  if (!this.getElement()) {
    this.createDom();
  }
  if (!this.context_) {
    this.context_ = this.canvas_.getContext('2d');
    this.context_.save();
  }
  return this.context_;
***REMOVED***


***REMOVED***
***REMOVED*** Changes the coordinate system position.
***REMOVED*** @param {number} left The coordinate system left bound.
***REMOVED*** @param {number} top The coordinate system top bound.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.setCoordOrigin = function(left, top) {
  this.coordLeft = left;
  this.coordTop = top;
  this.redraw();
***REMOVED***


***REMOVED***
***REMOVED*** Changes the coordinate size.
***REMOVED*** @param {number} coordWidth The coordinate width.
***REMOVED*** @param {number} coordHeight The coordinate height.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.setCoordSize = function(coordWidth,
                                                               coordHeight) {
  goog.graphics.CanvasGraphics.superClass_.setCoordSize.apply(this, arguments);
  this.redraw();
***REMOVED***


***REMOVED***
***REMOVED*** Change the size of the canvas.
***REMOVED*** @param {number} pixelWidth The width in pixels.
***REMOVED*** @param {number} pixelHeight The height in pixels.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.setSize = function(pixelWidth,
    pixelHeight) {
  this.width = pixelWidth;
  this.height = pixelHeight;

  this.updateSize();
  this.redraw();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.CanvasGraphics.prototype.getPixelSize = function() {
  // goog.style.getSize does not work for Canvas elements.  We
  // have to compute the size manually if it is percentage based.
  var width = this.width;
  var height = this.height;
  var computeWidth = goog.isString(width) && width.indexOf('%') != -1;
  var computeHeight = goog.isString(height) && height.indexOf('%') != -1;

  if (!this.isInDocument() && (computeWidth || computeHeight)) {
    return null;
  }

  var parent;
  var parentSize;

  if (computeWidth) {
    parent =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.getElement().parentNode);
    parentSize = goog.style.getSize(parent);
    width = parseFloat(***REMOVED*** @type {string}***REMOVED*** (width))***REMOVED*** parentSize.width / 100;
  }

  if (computeHeight) {
    parent = parent ||***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.getElement().parentNode);
    parentSize = parentSize || goog.style.getSize(parent);
    height = parseFloat(***REMOVED*** @type {string}***REMOVED*** (height))***REMOVED*** parentSize.height /
        100;
  }

  return new goog.math.Size(***REMOVED*** @type {number}***REMOVED*** (width),
     ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (height));
***REMOVED***


***REMOVED***
***REMOVED*** Update the size of the canvas.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.updateSize = function() {
  goog.style.setSize(this.getElement(), this.width, this.height);

  var pixels = this.getPixelSize();
  if (pixels) {
    goog.style.setSize(this.canvas_,
       ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (pixels.width),
       ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (pixels.height));
    this.canvas_.width = pixels.width;
    this.canvas_.height = pixels.height;
    this.clearContext_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Reset the canvas.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.reset = function() {
  var ctx = this.getContext();
  ctx.restore();
  var size = this.getPixelSize();
  if (size.width && size.height) {
    ctx.clearRect(0, 0, size.width, size.height);
  }
  ctx.save();
***REMOVED***


***REMOVED***
***REMOVED*** Remove all drawing elements from the graphics.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.clear = function() {
  this.reset();
  this.canvasElement.clear();
  var el = this.getElement();

  // Remove all children (text nodes) except the canvas (which is at index 0)
  while (el.childNodes.length > 1) {
    el.removeChild(el.lastChild);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Redraw the entire canvas.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.redraw = function() {
  if (this.preventRedraw_) {
    this.needsRedraw_ = true;
    return;
  }

  if (this.isInDocument()) {
    this.reset();

    if (this.coordWidth) {
      var pixels = this.getPixelSize();
      this.getContext().scale(pixels.width / this.coordWidth,
          pixels.height / this.coordHeight);
    }
    if (this.coordLeft || this.coordTop) {
      this.getContext().translate(-this.coordLeft, -this.coordTop);
    }
    this.pushElementTransform(this.canvasElement);
    this.canvasElement.draw(this.context_);
    this.popElementTransform();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Draw an element, including any stroke or fill.
***REMOVED*** @param {goog.graphics.Element} element The element to draw.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.drawElement = function(element) {
  if (element instanceof goog.graphics.CanvasTextElement) {
    // Don't draw text since that is not implemented using canvas.
    return;
  }

  var ctx = this.getContext();
  this.pushElementTransform(element);

  if (!element.getFill || !element.getStroke) {
    // Draw without stroke or fill (e.g. the element is an image or group).
    element.draw(ctx);
    this.popElementTransform();
    return;
  }

  var fill = element.getFill();
  if (fill) {
    if (fill instanceof goog.graphics.SolidFill) {
      if (fill.getOpacity() != 0) {
        ctx.globalAlpha = fill.getOpacity();
        ctx.fillStyle = fill.getColor();
        element.draw(ctx);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    } else { // (fill instanceof goog.graphics.LinearGradient)
      var linearGradient = ctx.createLinearGradient(fill.getX1(), fill.getY1(),
          fill.getX2(), fill.getY2());
      linearGradient.addColorStop(0.0, fill.getColor1());
      linearGradient.addColorStop(1.0, fill.getColor2());

      ctx.fillStyle = linearGradient;
      element.draw(ctx);
      ctx.fill();
    }
  }

  var stroke = element.getStroke();
  if (stroke) {
    element.draw(ctx);
    ctx.strokeStyle = stroke.getColor();

    var width = stroke.getWidth();
    if (goog.isString(width) && width.indexOf('px') != -1) {
      width = parseFloat(width) / this.getPixelScaleX();
    }
    ctx.lineWidth = width;

    ctx.stroke();
  }

  this.popElementTransform();
***REMOVED***


***REMOVED***
***REMOVED*** Append an element.
***REMOVED***
***REMOVED*** @param {goog.graphics.Element} element The element to draw.
***REMOVED*** @param {goog.graphics.CanvasGroupElement|undefined} group The group to draw
***REMOVED***     it in. If null or undefined, defaults to the root group.
***REMOVED*** @private
***REMOVED*** @deprecated Use append instead.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.append_ = function(element, group) {
  this.append(element, group);
***REMOVED***


***REMOVED***
***REMOVED*** Append an element.
***REMOVED***
***REMOVED*** @param {goog.graphics.Element} element The element to draw.
***REMOVED*** @param {goog.graphics.GroupElement|undefined} group The group to draw
***REMOVED***     it in. If null or undefined, defaults to the root group.
***REMOVED*** @protected
***REMOVED***
goog.graphics.CanvasGraphics.prototype.append = function(element, group) {
  group = group || this.canvasElement;
  group.appendChild(element);

  if (this.isDrawable(group)) {
    this.drawElement(element);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Draw an ellipse.
***REMOVED***
***REMOVED*** @param {number} cx Center X coordinate.
***REMOVED*** @param {number} cy Center Y coordinate.
***REMOVED*** @param {number} rx Radius length for the x-axis.
***REMOVED*** @param {number} ry Radius length for the y-axis.
***REMOVED*** @param {goog.graphics.Stroke} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper
***REMOVED***     element to append to.  If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {!goog.graphics.EllipseElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.drawEllipse = function(cx, cy, rx, ry,
    stroke, fill, opt_group) {
  var element = new goog.graphics.CanvasEllipseElement(null, this,
      cx, cy, rx, ry, stroke, fill);
  this.append(element, opt_group);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Draw a rectangle.
***REMOVED***
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED*** @param {goog.graphics.Stroke} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper
***REMOVED***     element to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {!goog.graphics.RectElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.drawRect = function(x, y, width, height,
    stroke, fill, opt_group) {
  var element = new goog.graphics.CanvasRectElement(null, this,
      x, y, width, height, stroke, fill);
  this.append(element, opt_group);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Draw an image.
***REMOVED***
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @param {number} width Width of image.
***REMOVED*** @param {number} height Height of image.
***REMOVED*** @param {string} src Source of the image.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper
***REMOVED***     element to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {!goog.graphics.ImageElement} The newly created element.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.drawImage = function(x, y, width, height,
    src, opt_group) {
  var element = new goog.graphics.CanvasImageElement(null, this, x, y, width,
      height, src);
  this.append(element, opt_group);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Draw a text string vertically centered on a given line.
***REMOVED***
***REMOVED*** @param {string} text The text to draw.
***REMOVED*** @param {number} x1 X coordinate of start of line.
***REMOVED*** @param {number} y1 Y coordinate of start of line.
***REMOVED*** @param {number} x2 X coordinate of end of line.
***REMOVED*** @param {number} y2 Y coordinate of end of line.
***REMOVED*** @param {?string} align Horizontal alignment: left (default), center, right.
***REMOVED*** @param {goog.graphics.Font} font Font describing the font properties.
***REMOVED*** @param {goog.graphics.Stroke} stroke Stroke object describing the stroke.
***REMOVED*** @param {goog.graphics.Fill} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper
***REMOVED***     element to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {!goog.graphics.TextElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.drawTextOnLine = function(
    text, x1, y1, x2, y2, align, font, stroke, fill, opt_group) {
  var element = new goog.graphics.CanvasTextElement(this,
      text, x1, y1, x2, y2, align,***REMOVED*****REMOVED*** @type {!goog.graphics.Font}***REMOVED*** (font),
      stroke, fill);
  this.append(element, opt_group);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Draw a path.
***REMOVED*** @param {!goog.graphics.Path} path The path object to draw.
***REMOVED*** @param {goog.graphics.Stroke} stroke Stroke object describing the stroke.
***REMOVED*** @param {goog.graphics.Fill} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper
***REMOVED***     element to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {!goog.graphics.PathElement} The newly created element.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.drawPath = function(path, stroke, fill,
    opt_group) {
  var element = new goog.graphics.CanvasPathElement(null, this,
      path, stroke, fill);
  this.append(element, opt_group);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** @param {goog.graphics.GroupElement} group The group to possibly
***REMOVED***     draw to.
***REMOVED*** @return {boolean} Whether drawing can occur now.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.isDrawable = function(group) {
  return this.isInDocument() && !this.redrawTimeout_ &&
      !this.isRedrawRequired(group);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if drawing to the given group means a redraw is required.
***REMOVED*** @param {goog.graphics.GroupElement} group The group to draw to.
***REMOVED*** @return {boolean} Whether drawing to this group should force a redraw.
***REMOVED***
goog.graphics.CanvasGraphics.prototype.isRedrawRequired = function(group) {
  // TODO(robbyw): Moving up to any parent of lastGroup should not force redraw.
  return group != this.canvasElement && group != this.lastGroup_;
***REMOVED***


***REMOVED***
***REMOVED*** Create an empty group of drawing elements.
***REMOVED***
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper
***REMOVED***     element to append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {!goog.graphics.CanvasGroupElement} The newly created group.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.createGroup = function(opt_group) {
  var group = new goog.graphics.CanvasGroupElement(this);

  opt_group = opt_group || this.canvasElement;

  // TODO(robbyw): Moving up to any parent group should not force redraw.
  if (opt_group == this.canvasElement || opt_group == this.lastGroup_) {
    this.lastGroup_ = group;
  }

  this.append(group, opt_group);

  return group;
***REMOVED***


***REMOVED***
***REMOVED*** Measure and return the width (in pixels) of a given text string.
***REMOVED*** Text measurement is needed to make sure a text can fit in the allocated
***REMOVED*** area. The way text length is measured is by writing it into a div that is
***REMOVED*** after the visible area, measure the div width, and immediatly erase the
***REMOVED*** written value.
***REMOVED***
***REMOVED*** @param {string} text The text string to measure.
***REMOVED*** @param {goog.graphics.Font} font The font object describing the font style.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.getTextWidth = goog.abstractMethod;


***REMOVED***
***REMOVED*** Disposes of the component by removing event handlers, detacing DOM nodes from
***REMOVED*** the document body, and removing references to them.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.graphics.CanvasGraphics.prototype.disposeInternal = function() {
  this.context_ = null;
  goog.graphics.CanvasGraphics.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.graphics.CanvasGraphics.prototype.enterDocument = function() {
  var oldPixelSize = this.getPixelSize();
  goog.graphics.CanvasGraphics.superClass_.enterDocument.call(this);
  if (!oldPixelSize) {
    this.updateSize();
    this.dispatchEvent(goog.events.EventType.RESIZE);
  }
  this.redraw();
***REMOVED***


***REMOVED***
***REMOVED*** Start preventing redraws - useful for chaining large numbers of changes
***REMOVED*** together.  Not guaranteed to do anything - i.e. only use this for
***REMOVED*** optimization of a single code path.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.suspend = function() {
  this.preventRedraw_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Stop preventing redraws.  If any redraws had been prevented, a redraw will
***REMOVED*** be done now.
***REMOVED*** @override
***REMOVED***
goog.graphics.CanvasGraphics.prototype.resume = function() {
  this.preventRedraw_ = false;

  if (this.needsRedraw_) {
    this.redraw();
    this.needsRedraw_ = false;
  }
***REMOVED***
