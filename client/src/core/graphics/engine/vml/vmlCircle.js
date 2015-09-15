/**
 * @fileoverview VML rendering class representing a circle.
 */

goog.provide('xrx.vml.Circle');



goog.require('xrx.geometry.Circle');
goog.require('xrx.vml.Stylable');



/**
 * VML rendering class representing a circle.
 * @param {Raphael.circle} raphael The Raphael circle object.
 * @constructor
 * @extends xrx.vml.Stylable
 */
xrx.vml.Circle = function(raphael) {

  goog.base(this, raphael);
};
goog.inherits(xrx.vml.Circle, xrx.vml.Stylable);



/**
 * Sets the centre point of a circle.
 * @param {number} cx The X coordinate of the centre point.
 * @param {number} cy The Y coordinate of the centre point.
 */
xrx.vml.Circle.prototype.setCenter = function(cx, cy) {
  this.raphael_.attr({'cx': cx, 'cy': cy});
};



/**
 * Sets the radius of the circle.
 * @param {number} r The radius.
 */
xrx.vml.Circle.prototype.setRadius = function(r) {
  this.raphael_.attr({'r': r});
};



/**
 * Draws the circle on the canvas.
 * @param {number} cx X-coordinate of the circle's center point.
 * @param {number} cy Y-coordinate of the circle's center point.
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
  this.raphael_.show();
};



/**
 * Creates a new circle.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Circle.create = function(canvas) {
  var raphael = canvas.getRaphael().circle(0, 0, 0);
  raphael.hide();
  return new xrx.vml.Circle(raphael);
};
