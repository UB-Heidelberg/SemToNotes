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
***REMOVED*** @fileoverview Thin wrappers around the DOM element returned from
***REMOVED*** the different draw methods of the graphics. This is the VML implementation.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author yoah@google.com (Yoah Bar-David)
***REMOVED***

goog.provide('goog.graphics.VmlEllipseElement');
goog.provide('goog.graphics.VmlGroupElement');
goog.provide('goog.graphics.VmlImageElement');
goog.provide('goog.graphics.VmlPathElement');
goog.provide('goog.graphics.VmlRectElement');
goog.provide('goog.graphics.VmlTextElement');


goog.require('goog.dom');
goog.require('goog.graphics.EllipseElement');
goog.require('goog.graphics.GroupElement');
goog.require('goog.graphics.ImageElement');
goog.require('goog.graphics.PathElement');
goog.require('goog.graphics.RectElement');
goog.require('goog.graphics.TextElement');


***REMOVED***
***REMOVED*** Returns the VML element corresponding to this object.  This method is added
***REMOVED*** to several classes below.  Note that the return value of this method may
***REMOVED*** change frequently in IE8, so it should not be cached externally.
***REMOVED*** @return {Element} The VML element corresponding to this object.
***REMOVED*** @this {goog.graphics.VmlGroupElement|goog.graphics.VmlEllipseElement|
***REMOVED***     goog.graphics.VmlRectElement|goog.graphics.VmlPathElement|
***REMOVED***     goog.graphics.VmlTextElement|goog.graphics.VmlImageElement}
***REMOVED*** @private
***REMOVED***
goog.graphics.vmlGetElement_ = function() {
  this.element_ = this.getGraphics().getVmlElement(this.id_) || this.element_;
  return this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for VML group elements.
***REMOVED*** This is an implementation of the goog.graphics.GroupElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.VmlGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.GroupElement}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED*** @final
***REMOVED***
goog.graphics.VmlGroupElement = function(element, graphics) {
  this.id_ = element.id;
  goog.graphics.GroupElement.call(this, element, graphics);
***REMOVED***
goog.inherits(goog.graphics.VmlGroupElement, goog.graphics.GroupElement);


***REMOVED*** @override***REMOVED***
goog.graphics.VmlGroupElement.prototype.getElement =
    goog.graphics.vmlGetElement_;


***REMOVED***
***REMOVED*** Remove all drawing elements from the group.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGroupElement.prototype.clear = function() {
  goog.dom.removeChildren(this.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if this group is the root canvas element.
***REMOVED*** @private
***REMOVED***
goog.graphics.VmlGroupElement.prototype.isRootElement_ = function() {
  return this.getGraphics().getCanvasElement() == this;
***REMOVED***


***REMOVED***
***REMOVED*** Set the size of the group element.
***REMOVED*** @param {number|string} width The width of the group element.
***REMOVED*** @param {number|string} height The height of the group element.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlGroupElement.prototype.setSize = function(width, height) {
  var element = this.getElement();

  var style = element.style;
  style.width =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED*** (
      goog.graphics.VmlGraphics.toSizePx(width));
  style.height =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED*** (
      goog.graphics.VmlGraphics.toSizePx(height));

  element.coordsize =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toSizeCoord(width) +
      ' ' +
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toSizeCoord(height);

  // Don't overwrite the root element's origin.
  if (!this.isRootElement_()) {
    element.coordorigin = '0 0';
  }
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for VML ellipse elements.
***REMOVED*** This is an implementation of the goog.graphics.EllipseElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.VmlGraphics} graphics  The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {number} cx Center X coordinate.
***REMOVED*** @param {number} cy Center Y coordinate.
***REMOVED*** @param {number} rx Radius length for the x-axis.
***REMOVED*** @param {number} ry Radius length for the y-axis.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.EllipseElement}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED*** @final
***REMOVED***
goog.graphics.VmlEllipseElement = function(element, graphics,
    cx, cy, rx, ry, stroke, fill) {
  this.id_ = element.id;

  goog.graphics.EllipseElement.call(this, element, graphics, stroke, fill);

  // Store center and radius for future calls to setRadius or setCenter.

 ***REMOVED*****REMOVED***
  ***REMOVED*** X coordinate of the ellipse center.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.cx = cx;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Y coordinate of the ellipse center.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.cy = cy;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Radius length for the x-axis.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.rx = rx;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Radius length for the y-axis.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.ry = ry;
***REMOVED***
goog.inherits(goog.graphics.VmlEllipseElement, goog.graphics.EllipseElement);


***REMOVED*** @override***REMOVED***
goog.graphics.VmlEllipseElement.prototype.getElement =
    goog.graphics.vmlGetElement_;


***REMOVED***
***REMOVED*** Update the center point of the ellipse.
***REMOVED*** @param {number} cx Center X coordinate.
***REMOVED*** @param {number} cy Center Y coordinate.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlEllipseElement.prototype.setCenter = function(cx, cy) {
  this.cx = cx;
  this.cy = cy;
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.graphics.VmlGraphics.setPositionAndSize(this.getElement(),
      cx - this.rx, cy - this.ry, this.rx***REMOVED*** 2, this.ry***REMOVED*** 2);
***REMOVED***


***REMOVED***
***REMOVED*** Update the radius of the ellipse.
***REMOVED*** @param {number} rx Center X coordinate.
***REMOVED*** @param {number} ry Center Y coordinate.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlEllipseElement.prototype.setRadius = function(rx, ry) {
  this.rx = rx;
  this.ry = ry;
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.graphics.VmlGraphics.setPositionAndSize(this.getElement(),
      this.cx - rx, this.cy - ry, rx***REMOVED*** 2, ry***REMOVED*** 2);
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for VML rectangle elements.
***REMOVED*** This is an implementation of the goog.graphics.RectElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.VmlGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.RectElement}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED*** @final
***REMOVED***
goog.graphics.VmlRectElement = function(element, graphics, stroke, fill) {
  this.id_ = element.id;
  goog.graphics.RectElement.call(this, element, graphics, stroke, fill);
***REMOVED***
goog.inherits(goog.graphics.VmlRectElement, goog.graphics.RectElement);


***REMOVED*** @override***REMOVED***
goog.graphics.VmlRectElement.prototype.getElement =
    goog.graphics.vmlGetElement_;


***REMOVED***
***REMOVED*** Update the position of the rectangle.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlRectElement.prototype.setPosition = function(x, y) {
  var style = this.getElement().style;

  style.left =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toPosPx(x);
  style.top =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toPosPx(y);
***REMOVED***


***REMOVED***
***REMOVED*** Update the size of the rectangle.
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlRectElement.prototype.setSize = function(width, height) {
  var style = this.getElement().style;
  style.width =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toSizePx(width);
  style.height =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toSizePx(height);
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for VML path elements.
***REMOVED*** This is an implementation of the goog.graphics.PathElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.VmlGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.PathElement}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED*** @final
***REMOVED***
goog.graphics.VmlPathElement = function(element, graphics, stroke, fill) {
  this.id_ = element.id;
  goog.graphics.PathElement.call(this, element, graphics, stroke, fill);
***REMOVED***
goog.inherits(goog.graphics.VmlPathElement, goog.graphics.PathElement);


***REMOVED*** @override***REMOVED***
goog.graphics.VmlPathElement.prototype.getElement =
    goog.graphics.vmlGetElement_;


***REMOVED***
***REMOVED*** Update the underlying path.
***REMOVED*** @param {!goog.graphics.Path} path The path object to draw.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlPathElement.prototype.setPath = function(path) {
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.graphics.VmlGraphics.setAttribute(
      this.getElement(), 'path',
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.getVmlPath(path));
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for VML text elements.
***REMOVED*** This is an implementation of the goog.graphics.TextElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.VmlGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.TextElement}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED*** @final
***REMOVED***
goog.graphics.VmlTextElement = function(element, graphics, stroke, fill) {
  this.id_ = element.id;
  goog.graphics.TextElement.call(this, element, graphics, stroke, fill);
***REMOVED***
goog.inherits(goog.graphics.VmlTextElement, goog.graphics.TextElement);


***REMOVED*** @override***REMOVED***
goog.graphics.VmlTextElement.prototype.getElement =
    goog.graphics.vmlGetElement_;


***REMOVED***
***REMOVED*** Update the displayed text of the element.
***REMOVED*** @param {string} text The text to draw.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlTextElement.prototype.setText = function(text) {
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.graphics.VmlGraphics.setAttribute(this.getElement().childNodes[1],
      'string', text);
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for VML image elements.
***REMOVED*** This is an implementation of the goog.graphics.ImageElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.VmlGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.ImageElement}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED*** @final
***REMOVED***
goog.graphics.VmlImageElement = function(element, graphics) {
  this.id_ = element.id;
  goog.graphics.ImageElement.call(this, element, graphics);
***REMOVED***
goog.inherits(goog.graphics.VmlImageElement, goog.graphics.ImageElement);


***REMOVED*** @override***REMOVED***
goog.graphics.VmlImageElement.prototype.getElement =
    goog.graphics.vmlGetElement_;


***REMOVED***
***REMOVED*** Update the position of the image.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlImageElement.prototype.setPosition = function(x, y) {
  var style = this.getElement().style;

  style.left =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toPosPx(x);
  style.top =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toPosPx(y);
***REMOVED***


***REMOVED***
***REMOVED*** Update the size of the image.
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlImageElement.prototype.setSize = function(width, height) {
  var style = this.getElement().style;
  style.width =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toPosPx(width);
  style.height =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.graphics.VmlGraphics.toPosPx(height);
***REMOVED***


***REMOVED***
***REMOVED*** Update the source of the image.
***REMOVED*** @param {string} src Source of the image.
***REMOVED*** @override
***REMOVED***
goog.graphics.VmlImageElement.prototype.setSource = function(src) {
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.graphics.VmlGraphics.setAttribute(this.getElement(), 'src', src);
***REMOVED***
