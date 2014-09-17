/**
 * @fileoverview
 */

goog.provide('xrx.geometry.Circle');



/**
 * @constructor
 */
xrx.geometry.Circle = function() {

  this.cx = 0;

  this.cy = 0;

  this.r = 0;
};



xrx.geometry.Circle.prototype.containsPoint = function(point) {
  return ((this.cx - point[0]) * (this.cx - point[0]) + (this.cy - point[1]) *
      (this.cy - point[1]) <= this.r * this.r) 
};
