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
***REMOVED*** the different draw methods of the graphics. This is the SVG implementation.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author yoah@google.com (Yoah Bar-David)
***REMOVED***

goog.provide('goog.graphics.SvgEllipseElement');
goog.provide('goog.graphics.SvgGroupElement');
goog.provide('goog.graphics.SvgImageElement');
goog.provide('goog.graphics.SvgPathElement');
goog.provide('goog.graphics.SvgRectElement');
goog.provide('goog.graphics.SvgTextElement');


goog.require('goog.dom');
goog.require('goog.graphics.EllipseElement');
goog.require('goog.graphics.GroupElement');
goog.require('goog.graphics.ImageElement');
goog.require('goog.graphics.PathElement');
goog.require('goog.graphics.RectElement');
goog.require('goog.graphics.TextElement');



***REMOVED***
***REMOVED*** Thin wrapper for SVG group elements.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.SvgGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.GroupElement}
***REMOVED***
goog.graphics.SvgGroupElement = function(element, graphics) {
  goog.graphics.GroupElement.call(this, element, graphics);
***REMOVED***
goog.inherits(goog.graphics.SvgGroupElement, goog.graphics.GroupElement);


***REMOVED***
***REMOVED*** Remove all drawing elements from the group.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGroupElement.prototype.clear = function() {
  goog.dom.removeChildren(this.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** Set the size of the group element.
***REMOVED*** @param {number|string} width The width of the group element.
***REMOVED*** @param {number|string} height The height of the group element.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgGroupElement.prototype.setSize = function(width, height) {
  this.getGraphics().setElementAttributes(this.getElement(),
      {'width': width, 'height': height});
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for SVG ellipse elements.
***REMOVED*** This is an implementation of the goog.graphics.EllipseElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.SvgGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.EllipseElement}
***REMOVED***
goog.graphics.SvgEllipseElement = function(element, graphics, stroke, fill) {
  goog.graphics.EllipseElement.call(this, element, graphics, stroke, fill);
***REMOVED***
goog.inherits(goog.graphics.SvgEllipseElement, goog.graphics.EllipseElement);


***REMOVED***
***REMOVED*** Update the center point of the ellipse.
***REMOVED*** @param {number} cx Center X coordinate.
***REMOVED*** @param {number} cy Center Y coordinate.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgEllipseElement.prototype.setCenter = function(cx, cy) {
  this.getGraphics().setElementAttributes(this.getElement(),
      {'cx': cx, 'cy': cy});
***REMOVED***


***REMOVED***
***REMOVED*** Update the radius of the ellipse.
***REMOVED*** @param {number} rx Radius length for the x-axis.
***REMOVED*** @param {number} ry Radius length for the y-axis.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgEllipseElement.prototype.setRadius = function(rx, ry) {
  this.getGraphics().setElementAttributes(this.getElement(),
      {'rx': rx, 'ry': ry});
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for SVG rectangle elements.
***REMOVED*** This is an implementation of the goog.graphics.RectElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.SvgGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.RectElement}
***REMOVED***
goog.graphics.SvgRectElement = function(element, graphics, stroke, fill) {
  goog.graphics.RectElement.call(this, element, graphics, stroke, fill);
***REMOVED***
goog.inherits(goog.graphics.SvgRectElement, goog.graphics.RectElement);


***REMOVED***
***REMOVED*** Update the position of the rectangle.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgRectElement.prototype.setPosition = function(x, y) {
  this.getGraphics().setElementAttributes(this.getElement(), {'x': x, 'y': y});
***REMOVED***


***REMOVED***
***REMOVED*** Update the size of the rectangle.
***REMOVED*** @param {number} width Width of rectangle.
***REMOVED*** @param {number} height Height of rectangle.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgRectElement.prototype.setSize = function(width, height) {
  this.getGraphics().setElementAttributes(this.getElement(),
      {'width': width, 'height': height});
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for SVG path elements.
***REMOVED*** This is an implementation of the goog.graphics.PathElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.SvgGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.PathElement}
***REMOVED***
goog.graphics.SvgPathElement = function(element, graphics, stroke, fill) {
  goog.graphics.PathElement.call(this, element, graphics, stroke, fill);
***REMOVED***
goog.inherits(goog.graphics.SvgPathElement, goog.graphics.PathElement);


***REMOVED***
***REMOVED*** Update the underlying path.
***REMOVED*** @param {!goog.graphics.Path} path The path object to draw.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgPathElement.prototype.setPath = function(path) {
  this.getGraphics().setElementAttributes(this.getElement(),
      {'d': goog.graphics.SvgGraphics.getSvgPath(path)});
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for SVG text elements.
***REMOVED*** This is an implementation of the goog.graphics.TextElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.SvgGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke to use for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill to use for this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.TextElement}
***REMOVED***
goog.graphics.SvgTextElement = function(element, graphics, stroke, fill) {
  goog.graphics.TextElement.call(this, element, graphics, stroke, fill);
***REMOVED***
goog.inherits(goog.graphics.SvgTextElement, goog.graphics.TextElement);


***REMOVED***
***REMOVED*** Update the displayed text of the element.
***REMOVED*** @param {string} text The text to draw.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgTextElement.prototype.setText = function(text) {
  this.getElement().firstChild.data = text;
***REMOVED***



***REMOVED***
***REMOVED*** Thin wrapper for SVG image elements.
***REMOVED*** This is an implementation of the goog.graphics.ImageElement interface.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.SvgGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.ImageElement}
***REMOVED***
goog.graphics.SvgImageElement = function(element, graphics) {
  goog.graphics.ImageElement.call(this, element, graphics);
***REMOVED***
goog.inherits(goog.graphics.SvgImageElement, goog.graphics.ImageElement);


***REMOVED***
***REMOVED*** Update the position of the image.
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgImageElement.prototype.setPosition = function(x, y) {
  this.getGraphics().setElementAttributes(this.getElement(), {'x': x, 'y': y});
***REMOVED***


***REMOVED***
***REMOVED*** Update the size of the image.
***REMOVED*** @param {number} width Width of image.
***REMOVED*** @param {number} height Height of image.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgImageElement.prototype.setSize = function(width, height) {
  this.getGraphics().setElementAttributes(this.getElement(),
      {'width': width, 'height': height});
***REMOVED***


***REMOVED***
***REMOVED*** Update the source of the image.
***REMOVED*** @param {string} src Source of the image.
***REMOVED*** @override
***REMOVED***
goog.graphics.SvgImageElement.prototype.setSource = function(src) {
  this.getGraphics().setElementAttributes(this.getElement(),
      {'xlink:href': src});
***REMOVED***
