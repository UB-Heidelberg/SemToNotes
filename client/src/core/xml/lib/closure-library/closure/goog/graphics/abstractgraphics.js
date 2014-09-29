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
***REMOVED*** @fileoverview Graphics utility functions and factory methods.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


goog.provide('goog.graphics.AbstractGraphics');

goog.require('goog.graphics.Path');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** Base class for the different graphics. You should never construct objects
***REMOVED*** of this class. Instead us goog.graphics.createGraphics
***REMOVED*** @param {number|string} width The width in pixels or percent.
***REMOVED*** @param {number|string} height The height in pixels or percent.
***REMOVED*** @param {?number=} opt_coordWidth Optional coordinate system width - if
***REMOVED***     omitted or null, defaults to same as width.
***REMOVED*** @param {?number=} opt_coordHeight Optional coordinate system height - if
***REMOVED***     omitted or null, defaults to same as height.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.graphics.AbstractGraphics = function(width, height,
                                          opt_coordWidth, opt_coordHeight,
                                          opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Width of graphics in pixels or percentage points.
  ***REMOVED*** @type {number|string}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.width = width;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Height of graphics in pixels or precentage points.
  ***REMOVED*** @type {number|string}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.height = height;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Width of coordinate system in units.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.coordWidth = opt_coordWidth || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Height of coordinate system in units.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.coordHeight = opt_coordHeight || null;
***REMOVED***
goog.inherits(goog.graphics.AbstractGraphics, goog.ui.Component);


***REMOVED***
***REMOVED*** The root level group element.
***REMOVED*** @type {goog.graphics.GroupElement?}
***REMOVED*** @protected
***REMOVED***
goog.graphics.AbstractGraphics.prototype.canvasElement = null;


***REMOVED***
***REMOVED*** Left coordinate of the view box
***REMOVED*** @type {number}
***REMOVED*** @protected
***REMOVED***
goog.graphics.AbstractGraphics.prototype.coordLeft = 0;


***REMOVED***
***REMOVED*** Top coordinate of the view box
***REMOVED*** @type {number}
***REMOVED*** @protected
***REMOVED***
goog.graphics.AbstractGraphics.prototype.coordTop = 0;


***REMOVED***
***REMOVED*** @return {goog.graphics.GroupElement} The root level canvas element.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.getCanvasElement = function() {
  return this.canvasElement;
***REMOVED***


***REMOVED***
***REMOVED*** Changes the coordinate size.
***REMOVED*** @param {number} coordWidth  The coordinate width.
***REMOVED*** @param {number} coordHeight  The coordinate height.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.setCoordSize = function(coordWidth,
                                                                 coordHeight) {
  this.coordWidth = coordWidth;
  this.coordHeight = coordHeight;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.math.Size} The coordinate size.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.getCoordSize = function() {
  if (this.coordWidth) {
    return new goog.math.Size(this.coordWidth,
       ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.coordHeight));
  } else {
    return this.getPixelSize();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Changes the coordinate system position.
***REMOVED*** @param {number} left  The coordinate system left bound.
***REMOVED*** @param {number} top  The coordinate system top bound.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.setCoordOrigin = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {goog.math.Coordinate} The coordinate system position.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.getCoordOrigin = function() {
  return new goog.math.Coordinate(this.coordLeft, this.coordTop);
***REMOVED***


***REMOVED***
***REMOVED*** Change the size of the canvas.
***REMOVED*** @param {number} pixelWidth  The width in pixels.
***REMOVED*** @param {number} pixelHeight  The height in pixels.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.setSize = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {goog.math.Size} The size of canvas.
***REMOVED*** @deprecated Use getPixelSize.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.getSize = function() {
  return this.getPixelSize();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.math.Size?} Returns the number of pixels spanned by the
***REMOVED***     surface, or null if the size could not be computed due to the size being
***REMOVED***     specified in percentage points and the component not being in the
***REMOVED***     document.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.getPixelSize = function() {
  if (this.isInDocument()) {
    return goog.style.getSize(this.getElement());
  }
  if (goog.isNumber(this.width) && goog.isNumber(this.height)) {
    return new goog.math.Size(this.width, this.height);
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Returns the number of pixels per unit in the x direction.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.getPixelScaleX = function() {
  var pixelSize = this.getPixelSize();
  return pixelSize ? pixelSize.width / this.getCoordSize().width : 0;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Returns the number of pixels per unit in the y direction.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.getPixelScaleY = function() {
  var pixelSize = this.getPixelSize();
  return pixelSize ? pixelSize.height / this.getCoordSize().height : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Remove all drawing elements from the graphics.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.clear = goog.abstractMethod;


***REMOVED***
***REMOVED*** Remove a single drawing element from the surface.  The default implementation
***REMOVED*** assumes a DOM based drawing surface.
***REMOVED*** @param {goog.graphics.Element} element The element to remove.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.removeElement = function(element) {
  goog.dom.removeNode(element.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** Sets the fill for the given element.
***REMOVED*** @param {goog.graphics.StrokeAndFillElement} element The element wrapper.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill object.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.setElementFill = goog.abstractMethod;


***REMOVED***
***REMOVED*** Sets the stroke for the given element.
***REMOVED*** @param {goog.graphics.StrokeAndFillElement} element The element wrapper.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke object.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.setElementStroke = goog.abstractMethod;


***REMOVED***
***REMOVED*** Set the transformation of an element.
***REMOVED*** @param {goog.graphics.Element} element The element wrapper.
***REMOVED*** @param {number} x The x coordinate of the translation transform.
***REMOVED*** @param {number} y The y coordinate of the translation transform.
***REMOVED*** @param {number} angle The angle of the rotation transform.
***REMOVED*** @param {number} centerX The horizontal center of the rotation transform.
***REMOVED*** @param {number} centerY The vertical center of the rotation transform.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.setElementTransform =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Draw a circle
***REMOVED***
***REMOVED*** @param {number} cx Center X coordinate.
***REMOVED*** @param {number} cy Center Y coordinate.
***REMOVED*** @param {number} r Radius length.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element to
***REMOVED***     append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.EllipseElement} The newly created element.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.drawCircle = function(
    cx, cy, r, stroke, fill, opt_group) {
  return this.drawEllipse(cx, cy, r, r, stroke, fill, opt_group);
***REMOVED***


***REMOVED***
***REMOVED*** Draw an ellipse
***REMOVED***
***REMOVED*** @param {number} cx Center X coordinate.
***REMOVED*** @param {number} cy Center Y coordinate.
***REMOVED*** @param {number} rx Radius length for the x-axis.
***REMOVED*** @param {number} ry Radius length for the y-axis.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element to
***REMOVED***     append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.EllipseElement} The newly created element.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.drawEllipse = goog.abstractMethod;


***REMOVED***
***REMOVED*** Draw a rectangle
***REMOVED***
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element to
***REMOVED***     append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.RectElement} The newly created element.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.drawRect = goog.abstractMethod;


***REMOVED***
***REMOVED*** Draw a text string within a rectangle (drawing is horizontal)
***REMOVED***
***REMOVED*** @param {string} text The text to draw.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED*** @param {string} align Horizontal alignment: left (default), center, right.
***REMOVED*** @param {string} vAlign Vertical alignment: top (default), center, bottom.
***REMOVED*** @param {goog.graphics.Font} font Font describing the font properties.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill  Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element to
***REMOVED***     append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.TextElement} The newly created element.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.drawText = function(
    text, x, y, width, height, align, vAlign, font, stroke, fill, opt_group) {
  var baseline = font.size / 2; // Baseline is middle of line
  var textY;
  if (vAlign == 'bottom') {
    textY = y + height - baseline;
  } else if (vAlign == 'center') {
    textY = y + height / 2;
  } else {
    textY = y + baseline;
  }

  return this.drawTextOnLine(text, x, textY, x + width, textY, align,
      font, stroke, fill, opt_group);
***REMOVED***


***REMOVED***
***REMOVED*** Draw a text string vertically centered on a given line.
***REMOVED***
***REMOVED*** @param {string} text  The text to draw.
***REMOVED*** @param {number} x1 X coordinate of start of line.
***REMOVED*** @param {number} y1 Y coordinate of start of line.
***REMOVED*** @param {number} x2 X coordinate of end of line.
***REMOVED*** @param {number} y2 Y coordinate of end of line.
***REMOVED*** @param {string} align Horizontal alingnment: left (default), center, right.
***REMOVED*** @param {goog.graphics.Font} font Font describing the font properties.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element to
***REMOVED***     append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.TextElement} The newly created element.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.drawTextOnLine = goog.abstractMethod;


***REMOVED***
***REMOVED*** Draw a path.
***REMOVED***
***REMOVED*** @param {!goog.graphics.Path} path The path object to draw.
***REMOVED*** @param {goog.graphics.Stroke?} stroke Stroke object describing the
***REMOVED***    stroke.
***REMOVED*** @param {goog.graphics.Fill?} fill Fill object describing the fill.
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element to
***REMOVED***     append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.PathElement} The newly created element.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.drawPath = goog.abstractMethod;


***REMOVED***
***REMOVED*** Create an empty group of drawing elements.
***REMOVED***
***REMOVED*** @param {goog.graphics.GroupElement=} opt_group The group wrapper element to
***REMOVED***     append to. If not specified, appends to the main canvas.
***REMOVED***
***REMOVED*** @return {goog.graphics.GroupElement} The newly created group.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.createGroup = goog.abstractMethod;


***REMOVED***
***REMOVED*** Create an empty path.
***REMOVED***
***REMOVED*** @return {goog.graphics.Path} The path.
***REMOVED*** @deprecated Use {@code new goog.graphics.Path()}.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.createPath = function() {
  return new goog.graphics.Path();
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
***REMOVED***
***REMOVED*** @return {number} The width in pixels of the text strings.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.getTextWidth = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {boolean} Whether the underlying element can be cloned resulting in
***REMOVED***     an accurate reproduction of the graphics contents.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.isDomClonable = function() {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Start preventing redraws - useful for chaining large numbers of changes
***REMOVED*** together.  Not guaranteed to do anything - i.e. only use this for
***REMOVED*** optimization of a single code path.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.suspend = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Stop preventing redraws.  If any redraws had been prevented, a redraw will
***REMOVED*** be done now.
***REMOVED***
goog.graphics.AbstractGraphics.prototype.resume = function() {
***REMOVED***
