***REMOVED***
***REMOVED*** @fileoverview Canvas rendering class representing a circle.
***REMOVED***

goog.provide('xrx.canvas.Circle');



goog.require('xrx.geometry.Circle');
goog.require('xrx.canvas.Stylable');



***REMOVED***
***REMOVED*** Canvas rendering class representing a circle.
***REMOVED*** @param {xrx.canvas.Canvas} element The parent canvas object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Stylable
***REMOVED***
xrx.canvas.Circle = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Circle());
***REMOVED***
goog.inherits(xrx.canvas.Circle, xrx.canvas.Stylable);



***REMOVED***
***REMOVED*** Returns the centre point of the circle.
***REMOVED*** @return {Array.<number>}
***REMOVED***
xrx.canvas.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
***REMOVED***



***REMOVED***
***REMOVED*** Sets the centre point of a circle.
***REMOVED*** @param {number} cx The X coordinate of the centre point.
***REMOVED*** @param {number} cy The Y coordinate of the centre point.
***REMOVED***
xrx.canvas.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the radius of the circle.
***REMOVED*** @return {number} The radius.
***REMOVED***
xrx.canvas.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the radius of the circle.
***REMOVED*** @param {number} r The radius.
***REMOVED***
xrx.canvas.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
***REMOVED***



***REMOVED***
***REMOVED*** Draws the circle on the canvas.
***REMOVED***
xrx.canvas.Circle.prototype.draw = function() {
  this.context_.beginPath();
  this.context_.arc(this.geometry_.cx, this.geometry_.cy,
      this.geometry_.r, 0, 2*Math.PI);
  this.strokeAndFill_();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new circle.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
xrx.canvas.Circle.create = function(canvas) {
  return new xrx.canvas.Circle(canvas);
***REMOVED***
