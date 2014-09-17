***REMOVED***
***REMOVED*** @fileoverview VML rendering class representing a circle.
***REMOVED***

goog.provide('xrx.vml.Circle');



goog.require('xrx.geometry.Circle');
goog.require('xrx.vml.Stylable');



***REMOVED***
***REMOVED*** VML rendering class representing a circle.
***REMOVED*** @param {Raphael.circle} raphael The Raphael circle object.
***REMOVED***
***REMOVED*** @extends xrx.vml.Stylable
***REMOVED***
xrx.vml.Circle = function(raphael) {

  goog.base(this, raphael, new xrx.geometry.Circle());
***REMOVED***
goog.inherits(xrx.vml.Circle, xrx.vml.Stylable);



***REMOVED***
***REMOVED*** Returns the centre point of the circle.
***REMOVED*** @return {Array.<number>}
***REMOVED***
xrx.vml.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
***REMOVED***



***REMOVED***
***REMOVED*** Sets the centre point of a circle.
***REMOVED*** @param {number} cx The X coordinate of the centre point.
***REMOVED*** @param {number} cy The Y coordinate of the centre point.
***REMOVED***
xrx.vml.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
  this.raphael_.attr({'cx': cx, 'cy': cy});
***REMOVED***



***REMOVED***
***REMOVED*** Returns the radius of the circle.
***REMOVED*** @return {number} The radius.
***REMOVED***
xrx.vml.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the radius of the circle.
***REMOVED*** @param {number} r The radius.
***REMOVED***
xrx.vml.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
  this.raphael_.attr({'r': r});
***REMOVED***



***REMOVED***
***REMOVED*** Draws the circle on the canvas.
***REMOVED***
xrx.vml.Circle.prototype.draw = function() {
  this.raphael_.show();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new circle.
***REMOVED*** @param {xrx.vml.Canvas} canvas The parent canvas object.
***REMOVED***
xrx.vml.Circle.create = function(canvas) {
  var raphael = canvas.getRaphael().circle(0, 0, 0);
  raphael.hide();
  return new xrx.vml.Circle(raphael);
***REMOVED***
