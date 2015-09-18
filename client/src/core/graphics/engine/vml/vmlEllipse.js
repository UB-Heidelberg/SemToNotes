/**
 * @fileoverview VML rendering class representing an ellipse.
 */

goog.provide('xrx.vml.Ellipse');



goog.require('xrx.vml.Stylable');



/**
 * VML rendering class representing an ellipse.
 * @param {Raphael.ellipse} raphael The Raphael ellipse object.
 * @constructor
 * @extends xrx.vml.Stylable
 */
xrx.vml.Ellipse = function(raphael) {

  goog.base(this, raphael);
};
goog.inherits(xrx.vml.Ellipse, xrx.vml.Stylable);



/**
 * Sets the centre point of this ellipse.
 * @param {number} cx The X coordinate of the centre point.
 * @param {number} cy The Y coordinate of the centre point.
 */
xrx.vml.Ellipse.prototype.setCenter = function(cx, cy) {
  if (cx !== undefined) this.raphael_.attr({'cx': cx});
  if (cy !== undefined) this.raphael_.attr({'cy': cy});
};



/**
 * Sets the ellipse's major-axis radius.
 * @param {number} rx The radius.
 */
xrx.vml.Ellipse.prototype.setRadiusX = function(rx) {
  this.raphael_.attr({'rx': rx});
};



/**
 * Sets the ellipse's minor-axis radius.
 * @param {number} ry The radius.
 */
xrx.vml.Ellipse.prototype.setRadiusY = function(ry) {
  this.raphael_.attr({'ry': ry});
};



/**
 * Draws this ellipse on the canvas.
 * @param {number} cx X-coordinate of the ellipse's center point.
 * @param {number} cy Y-coordinate of the ellipse's center point.
 * @param {number} rx Major-radius of the ellipse.
 * @param {number} ry Minor-radius of the ellipse.
 * @param {string} fillColor The fill color.
 * @param {number} fillOpacity Opacity of the fill color.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.vml.Ellipse.prototype.draw = function(cx, cy, rx, ry, fillColor,
    fillOpacity, strokeColor, strokeWidth) {
  this.setCenter(cx, cy);
  if (rx !== undefined) this.setRadiusX(rx);
  if (ry !== undefined) this.setRadiusY(ry);
  this.strokeAndFill_(fillColor, fillOpacity, strokeColor, strokeWidth);
  this.raphael_.show();
};



/**
 * Creates a new ellipse.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Ellipse.create = function(canvas) {
  var raphael = canvas.getRaphael().ellipse(0, 0, 0, 0);
  raphael.hide();
  return new xrx.vml.Ellipse(raphael);
};
