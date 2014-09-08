***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.canvas.Circle');



goog.require('xrx.graphic.Circle');
goog.require('xrx.canvas.Stylable');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.canvas.Circle = function(canvas) {

  goog.base(this, canvas);

  this.graphic_ = new xrx.graphic.Circle();
***REMOVED***
goog.inherits(xrx.canvas.Circle, xrx.canvas.Stylable);



xrx.canvas.Circle.prototype.getCenter = function() {
  return [this.graphic_.cx, this.graphic_.cy];
***REMOVED***



xrx.canvas.Circle.prototype.setCenter = function(cx, cy) {
  this.graphic_.cx = cx;
  this.graphic_.cy = cy;
***REMOVED***



xrx.canvas.Circle.prototype.getRadius = function() {
  return this.graphic_.r;
***REMOVED***



xrx.canvas.Circle.prototype.setRadius = function(r) {
  this.graphic_.r = r;
***REMOVED***



xrx.canvas.Circle.prototype.draw = function() {
  this.context_.beginPath();
  this.context_.arc(this.graphic_.cx, this.graphic_.cy,
      this.graphic_.r, 0, 2*Math.PI);
  this.strokeAndFill_();
***REMOVED***



xrx.canvas.Circle.create = function(canvas) {
  return new xrx.canvas.Circle(canvas);
***REMOVED***
