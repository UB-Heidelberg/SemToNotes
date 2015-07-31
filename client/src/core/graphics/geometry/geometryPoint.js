/**
 * @fileoverview
 */

goog.provide('xrx.geometry.Point');



xrx.geometry.Point = function() {};



xrx.geometry.Point.distancePoint = function(point, otherPoint) {
  var dx = point[0] - otherPoint[0];
  var dy = point[1] - otherPoint[1];
  return Math.sqrt(dx * dx + dy * dy);
};
