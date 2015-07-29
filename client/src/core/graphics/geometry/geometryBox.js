/**
 * @fileoverview
 */

goog.provide('xrx.geometry.Box');



xrx.geometry.Box = function() {};



xrx.geometry.Box.containsPoint = function(box, point) {
  return point[0] >= box[3] && point[0] <= box[1] &&
      point[1] >= box[0] && point[1] <= box[2];
};
