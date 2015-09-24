/**
 * @fileoverview VML rendering class representing a circle.
 */

goog.provide('xrx.vml.Circle');



goog.require('xrx.vml');
goog.require('xrx.vml.Stylable');



/**
 * VML rendering class representing a circle.
 * @param
 * @constructor
 * @extends xrx.vml.Stylable
 */
xrx.vml.Circle = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.vml.Circle, xrx.vml.Stylable);



/**
 * Sets the center point of this circle.
 * @param {number} cx The x coordinate of the center point.
 * @param {number} cy The y coordinate of the center point.
 */
xrx.vml.Circle.prototype.setCenter = function(cx, cy) {
};



/**
 * Sets the radius of the circle.
 * @param {number} r The radius.
 */
xrx.vml.Circle.prototype.setRadius = function(r) {
};



/**
 * Draws the circle on the canvas.
 * @param {number} cx x coordinate of the circle's center point.
 * @param {number} cy y coordinate of the circle's center point.
 * @param {number} r Radius of the circle.
 * @param {string} fillColor The fill color.
 * @param {number} fillOpacity Opacity of the fill color.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.vml.Circle.prototype.draw = function(cx, cy, r, fillColor,
    fillOpacity, strokeColor, strokeWidth) {
  this.setCenter(cx, cy);
  this.setRadius(r);
  this.strokeAndFill_(fillColor, fillOpacity, strokeColor, strokeWidth);
};



/**
 * Creates a new circle.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Circle.create = function(canvas) {
  var element = xrx.vml.createVml('circle');
  return new xrx.vml.Circle(element);
};
