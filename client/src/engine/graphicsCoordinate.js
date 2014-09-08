/**
 * @fileoverview
 */

goog.provide('xrx.graphics.Coordinate');



goog.require('xrx.graphics');



/**
 * @constructor
 */
xrx.graphics.Coordinate = function() {};



xrx.graphics.Coordinate.equals = function(a, b) {
  return a[0] === b[0] && a[1] === b[1];
};
