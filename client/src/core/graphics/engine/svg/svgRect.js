***REMOVED***
***REMOVED*** @fileoverview SVG class representing a rectangle.
***REMOVED***

goog.provide('xrx.svg.Rect');



goog.require('xrx.geometry.Rect');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



***REMOVED***
***REMOVED*** SVG class representing a rectangle.
***REMOVED*** @param {SVGRectElement} element The SVG element.
***REMOVED***
***REMOVED*** @extends {xrx.svg.Stylable}
***REMOVED***
xrx.svg.Rect = function(element) {

  goog.base(this, element, new xrx.geometry.Rect());
***REMOVED***
goog.inherits(xrx.svg.Rect, xrx.svg.Stylable);



***REMOVED***
***REMOVED*** Sets the X coordinate of the rectangle.
***REMOVED*** @param {number} x The coordinate.
***REMOVED***
xrx.svg.Rect.prototype.setX = function(x) {
  this.geometry_.x = x;
  this.element_.setAttribute('x', x);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the Y coordinate of the rectangle.
***REMOVED*** @param {number} y The coordinate.
***REMOVED***
xrx.svg.Rect.prototype.setY = function(y) {
  this.geometry_.y = y;
  this.element_.setAttribute('y', y);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the width of the rectangle.
***REMOVED*** @param {number} width The width.
***REMOVED***
xrx.svg.Rect.prototype.setWidth = function(width) {
  this.geometry_.width = width;
  this.element_.setAttribute('width', width);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the height of the rectangle.
***REMOVED*** @param {height} height The height.
***REMOVED***
xrx.svg.Rect.prototype.setHeight = function(height) {
  this.geometry_.height = height;
  this.element_.setAttribute('height', height);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the rectangle.
***REMOVED***
xrx.svg.Rect.prototype.draw = function() {***REMOVED***



***REMOVED***
***REMOVED*** Creates a new rectangle.
***REMOVED***
xrx.svg.Rect.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'rect');
  return new xrx.svg.Rect(element);
***REMOVED***
