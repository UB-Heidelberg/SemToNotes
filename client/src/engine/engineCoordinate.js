/**
 * @fileoverview
 */

goog.provide('xrx.engine.Coordinate');



goog.require('xrx.engine');



/**
 * @constructor
 */
xrx.engine.Coordinate = function() {};



xrx.engine.Coordinate.equals = function(a, b) {
  return a[0] === b[0] && a[1] === b[1];
};
