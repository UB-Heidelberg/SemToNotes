/**
 * @fileoverview
 */

goog.provide('xrx.geometry.Line');



goog.require('xrx.geometry');
goog.require('xrx.geometry.Geometry');



/**
 * @constructor
 */
xrx.geometry.Line = function() {

  goog.base(this);

  this.x1 = 0;

  this.y1 = 0;

  this.x2 = 0;

  this.y2 = 0;
};
goog.inherits(xrx.geometry.Line, xrx.geometry.Geometry);



xrx.geometry.Line.prototype.containsPoint = function(point) {
  var tolerance = 7;
  if (Math.abs(this.x1 - this.x2) < tolerance) { // vertical line
    return (Math.abs(point[0] - this.x1) < tolerance);
  } else if (Math.abs(this.y1 - this.y2) < tolerance) { // horizontal line
    return (Math.abs(point[1] - this.y1) < tolerance);
  } else {
    var m = (this.y2 - this.y1) / (this.x2 - this.x1);
    var b = this.y1 - m * this.x1;
    return (Math.abs(point[1] - (m * point[0] + b)) < tolerance);
  }
};
