***REMOVED***
***REMOVED*** @fileoverview Canvas class representing a rectangle.
***REMOVED***

goog.provide('xrx.canvas.Rect');



goog.require('xrx.canvas.Stylable');
goog.require('xrx.geometry.Rect');



***REMOVED***
***REMOVED*** Canvas class representing a rectangle.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
***REMOVED*** @extends {xrx.canvas.Stylable}
***REMOVED***
xrx.canvas.Rect = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Rect());
***REMOVED***
goog.inherits(xrx.canvas.Rect, xrx.canvas.Stylable);



***REMOVED***
***REMOVED*** Sets the X coordinate of the rectangle.
***REMOVED*** @param {number} x The coordinate.
***REMOVED***
xrx.canvas.Rect.prototype.setX = function(x) {
  this.geometry_.x = x;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the Y coordinate of the rectangle.
***REMOVED*** @param {number} y The coordinate.
***REMOVED***
xrx.canvas.Rect.prototype.setY = function(y) {
  this.geometry_.y = y;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the width of the rectangle.
***REMOVED*** @param {number} width The width.
***REMOVED***
xrx.canvas.Rect.prototype.setWidth = function(width) {
  this.geometry_.width = width;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the height of the rectangle.
***REMOVED*** @param {height} height The height.
***REMOVED***
xrx.canvas.Rect.prototype.setHeight = function(height) {
  this.geometry_.height = height;
***REMOVED***



***REMOVED***
***REMOVED*** Draws the rectangle.
***REMOVED***
xrx.canvas.Rect.prototype.draw = function() {
  var x = this.geometry_.x;
  var y = this.geometry_.y;
  var width = this.geometry_.width;
  var height = this.geometry_.height;
  this.context_.beginPath();
  this.context_.moveTo(x, y);
  this.context_.lineTo(x, y + height);
  this.context_.lineTo(x + width, y + height);
  this.context_.lineTo(x + width, y);
  this.context_.closePath();
  this.strokeAndFill_();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new rectangle.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
xrx.canvas.Rect.create = function(canvas) {
  return new xrx.canvas.Rect(canvas);
***REMOVED***
