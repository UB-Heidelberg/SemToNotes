/**
 * @fileoverview
 */

goog.provide('xrx.geometry.Point');



goog.require('xrx.geometry.Geometry');



xrx.geometry.Point = function() {

  goog.base(this);
};
goog.inherits(xrx.geometry.Point, xrx.geometry.Geometry);



xrx.geometry.Point.distancePoint = function(point, otherPoint) {
  var dx = point[0] - otherPoint[0];
  var dy = point[1] - otherPoint[1];
  return Math.sqrt(dx * dx + dy * dy);
};
