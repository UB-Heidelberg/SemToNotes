/**
 * @fileoverview VML class representing a rectangle.
 */

goog.provide('xrx.vml.Rect');



goog.require('xrx.vml.Element');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing a rectangle.
 * @param {Raphael.rect} raphael The Raphael object.
 * @constructor
 * @extends {xrx.vml.Stylable}
 */
xrx.vml.Rect = function(raphael) {

  goog.base(this, raphael);
};
goog.inherits(xrx.vml.Rect, xrx.vml.Stylable);



/**
 * Sets the X coordinate of the rectangle.
 * @param {number} x The coordinate.
 */
xrx.vml.Rect.prototype.setX = function(x) {
  this.raphael_.attr({x: x});
};



/**
 * Sets the Y coordinate of the rectangle.
 * @param {number} y The coordinate.
 */
xrx.vml.Rect.prototype.setY = function(y) {
  this.raphael_.attr({y: y});
};



/**
 * Sets the width of the rectangle.
 * @param {number} width The width.
 */
xrx.vml.Rect.prototype.setWidth = function(width) {
  this.raphael_.attr({width: width});
};



/**
 * Sets the height of the rectangle.
 * @param {height} height The height.
 */
xrx.vml.Rect.prototype.setHeight = function(height) {
  this.raphael_.attr({height: height});
};



/**
 * Draws the rectangle.
 * @param {number} x The X offset.
 * @param {number} y The Y offset.
 * @param {number} width The width.
 * @param {number} height The height.
 * @param {string} fillColor The fill color.
 * @param {number} fillOpacity Opacity of the fill color.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.vml.Rect.prototype.draw = function(x, y, width, height, fillColor,
    fillOpacity, strokeColor, strokeWidth) {
  if (x !== undefined) this.setX(x);
  if (y !== undefined) this.setY(y);
  if (width !== undefined) this.setWidth(width);
  if (height !== undefined) this.setHeight(height);
  this.strokeAndFill_(fillColor, fillOpacity, strokeColor, strokeWidth);
  this.raphael_.show();
};



/**
 * Creates a new rectangle.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Rect.create = function(canvas) {
  var raphael = canvas.getRaphael().rect(0, 0, 0, 0);
  raphael.hide();
  return new xrx.vml.Rect(raphael);
};
