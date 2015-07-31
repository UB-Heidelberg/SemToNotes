/**
 * @fileoverview Canvas rendering class representing a circle.
 */

goog.provide('xrx.canvas.Circle');



goog.require('xrx.geometry.Circle');
goog.require('xrx.canvas.Stylable');



/**
 * Canvas rendering class representing a circle.
 * @param {xrx.canvas.Canvas} element The parent canvas object.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.canvas.Circle = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Circle());
};
goog.inherits(xrx.canvas.Circle, xrx.canvas.Stylable);



/**
 * Returns the center point of the circle.
 * @return {Array<number>}
 */
xrx.canvas.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
};



/**
 * Sets the centre point of a circle.
 * @param {number} cx The X coordinate of the centre point.
 * @param {number} cy The Y coordinate of the centre point.
 */
xrx.canvas.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
};



/**
 * Returns the radius of the circle.
 * @return {number} The radius.
 */
xrx.canvas.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
};



/**
 * Sets the radius of the circle.
 * @param {number} r The radius.
 */
xrx.canvas.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
};



/**
 * Draws the circle on the canvas.
 * @param {number} scale The current scale of the view-box.
 */
xrx.canvas.Circle.prototype.draw = function(scale) {
  this.context_.beginPath();
  this.context_.arc(this.geometry_.cx, this.geometry_.cy,
      this.geometry_.r / scale, 0, 2*Math.PI);
  this.strokeAndFill_(scale);
};



/**
 * Creates a new circle.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Circle.create = function(canvas) {
  return new xrx.canvas.Circle(canvas);
};
