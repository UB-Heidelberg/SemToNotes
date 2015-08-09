/**
 * @fileoverview
 */

goog.provide('xrx.shape.Circle');



goog.require('xrx.geometry.Circle');
goog.require('xrx.shape.Stylable');



/**
 * @constructor
 */
xrx.shape.Circle = function(drawing) {

  goog.base(this, drawing, new xrx.geometry.Circle());
};
goog.inherits(xrx.shape.Circle, xrx.shape.Stylable);



xrx.shape.Circle.prototype.engineClass_ = 'Circle';



/**
 * Returns the center point of the circle.
 * @return {Array<number>}
 */
xrx.shape.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
};



/**
 * Sets the centre point of a circle.
 * @param {number} cx The X coordinate of the centre point.
 * @param {number} cy The Y coordinate of the centre point.
 */
xrx.shape.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
};



/**
 * Returns the radius of the circle.
 * @return {number} The radius.
 */
xrx.shape.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
};



/**
 * Sets the radius of the circle.
 * @param {number} r The radius.
 */
xrx.shape.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
};



xrx.shape.Circle.create = function(drawing) {
  return new xrx.shape.Circle(drawing);
};