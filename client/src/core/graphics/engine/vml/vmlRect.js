/**
 * @fileoverview VML class representing a rectangle.
 */

goog.provide('xrx.vml.Rect');



goog.require('xrx.geometry.Rect');
goog.require('xrx.vml.Element');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing a rectangle.
 * @param {Raphael.rect} raphael The Raphael object.
 * @constructor
 * @extends {xrx.vml.Stylable}
 */
xrx.vml.Rect = function(raphael) {

  goog.base(this, raphael, new xrx.geometry.Rect());
};
goog.inherits(xrx.vml.Rect, xrx.vml.Stylable);



/**
 * Sets the X coordinate of the rectangle.
 * @param {number} x The coordinate.
 */
xrx.vml.Rect.prototype.setX = function(x) {
  this.geometry_.x = x;
  this.raphael_.attr({x: x});
};



/**
 * Sets the Y coordinate of the rectangle.
 * @param {number} y The coordinate.
 */
xrx.vml.Rect.prototype.setY = function(y) {
  this.geometry_.y = y;
  this.raphael_.attr({y: y});
};



/**
 * Sets the width of the rectangle.
 * @param {number} width The width.
 */
xrx.vml.Rect.prototype.setWidth = function(width) {
  this.geometry_.width = width;
  this.raphael_.attr({width: width});
};



/**
 * Sets the height of the rectangle.
 * @param {height} height The height.
 */
xrx.vml.Rect.prototype.setHeight = function(height) {
  this.geometry_.height = height;
  this.raphael_.attr({height: height});
};



/**
 * Draws the rectangle.
 */
xrx.vml.Rect.prototype.draw = function() {
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
