***REMOVED***
***REMOVED*** @fileoverview VML class representing a rectangle.
***REMOVED***

goog.provide('xrx.vml.Rect');



goog.require('xrx.geometry.Rect');
goog.require('xrx.vml.Element');
goog.require('xrx.vml.Stylable');



***REMOVED***
***REMOVED*** VML class representing a rectangle.
***REMOVED*** @param {Raphael.rect} raphael The Raphael object.
***REMOVED***
***REMOVED*** @extends {xrx.vml.Stylable}
***REMOVED***
xrx.vml.Rect = function(raphael) {

  goog.base(this, raphael, new xrx.geometry.Rect());
***REMOVED***
goog.inherits(xrx.vml.Rect, xrx.vml.Stylable);



***REMOVED***
***REMOVED*** Sets the X coordinate of the rectangle.
***REMOVED*** @param {number} x The coordinate.
***REMOVED***
xrx.vml.Rect.prototype.setX = function(x) {
  this.geometry_.x = x;
  this.raphael_.attr({x: x});
***REMOVED***



***REMOVED***
***REMOVED*** Sets the Y coordinate of the rectangle.
***REMOVED*** @param {number} y The coordinate.
***REMOVED***
xrx.vml.Rect.prototype.setY = function(y) {
  this.geometry_.y = y;
  this.raphael_.attr({y: y});
***REMOVED***



***REMOVED***
***REMOVED*** Sets the width of the rectangle.
***REMOVED*** @param {number} width The width.
***REMOVED***
xrx.vml.Rect.prototype.setWidth = function(width) {
  this.geometry_.width = width;
  this.raphael_.attr({width: width});
***REMOVED***



***REMOVED***
***REMOVED*** Sets the height of the rectangle.
***REMOVED*** @param {height} height The height.
***REMOVED***
xrx.vml.Rect.prototype.setHeight = function(height) {
  this.geometry_.height = height;
  this.raphael_.attr({height: height});
***REMOVED***



***REMOVED***
***REMOVED*** Draws the rectangle.
***REMOVED***
xrx.vml.Rect.prototype.draw = function() {
  this.raphael_.show();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new rectangle.
***REMOVED*** @param {xrx.vml.Canvas} canvas The parent canvas object.
***REMOVED***
xrx.vml.Rect.create = function(canvas) {
  var raphael = canvas.getRaphael().rect(0, 0, 0, 0);
  raphael.hide();
  return new xrx.vml.Rect(raphael);
***REMOVED***
