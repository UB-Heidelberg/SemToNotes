/**
 * @fileoverview
 */

goog.provide('xrx.geometry.Ellipse');



goog.require('xrx.geometry');
goog.require('xrx.geometry.Geometry');



/**
 * @constructor
 */
xrx.geometry.Ellipse = function() {

  goog.base(this);

  this.cx = 0;

  this.cy = 0;

  this.rx = 0;

  this.ry = 0;
};
goog.inherits(xrx.geometry.Ellipse, xrx.geometry.Geometry);
