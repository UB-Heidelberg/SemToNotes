/**
 * @fileoverview Canvas rendering class representing a circle.
 */

goog.provide('xrx.cnvs.Circle');



goog.require('xrx.geometry.Circle');
goog.require('xrx.cnvs.Stylable');



/**
 * Canvas rendering class representing a circle.
 * @param {xrx.cnvs.Canvas} element The parent canvas object.
 * @constructor
 * @extends xrx.cnvs.Stylable
 */
xrx.cnvs.Circle = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Circle());
};
goog.inherits(xrx.cnvs.Circle, xrx.cnvs.Stylable);



/**
 * Returns the centre point of the circle.
 * @return {Array.<number>}
 */
xrx.cnvs.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
};



/**
 * Sets the centre point of a circle.
 * @param {number} cx The X coordinate of the centre point.
 * @param {number} cy The Y coordinate of the centre point.
 */
xrx.cnvs.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
};



/**
 * Returns the radius of the circle.
 * @return {number} The radius.
 */
xrx.cnvs.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
};



/**
 * Sets the radius of the circle.
 * @param {number} r The radius.
 */
xrx.cnvs.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
};



/**
 * Draws the circle on the canvas.
 */
xrx.cnvs.Circle.prototype.draw = function() {
  this.context_.beginPath();
  this.context_.arc(this.geometry_.cx, this.geometry_.cy,
      this.geometry_.r, 0, 2*Math.PI);
  this.strokeAndFill_();
};



/**
 * Creates a new circle.
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object.
 */
xrx.cnvs.Circle.create = function(canvas) {
  return new xrx.cnvs.Circle(canvas);
};
