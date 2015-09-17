/**
 * @fileoverview A class representing an engine-independent
 * circle graphic.
 */

goog.provide('xrx.shape.Circle');



goog.require('xrx.geometry.Circle');
goog.require('xrx.shape.Stylable');



/**
 * A class representing an engine-independent circle graphic.
 * @constructor
 */
xrx.shape.Circle = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Circle());
};
goog.inherits(xrx.shape.Circle, xrx.shape.Stylable);



/**
 * The engine class used to render this circle.
 * @type {string}
 * @const
 */
xrx.shape.Circle.prototype.engineClass_ = 'Circle';



/**
 * Returns the center point of this circle.
 * @return {Array<number>}
 */
xrx.shape.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
};



/**
 * Sets the center point of this circle.
 * @param {number} cx The X coordinate of the center point.
 * @param {number} cy The Y coordinate of the center point.
 */
xrx.shape.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
};



/**
 * Returns the radius of this circle.
 * @return {number} The radius.
 */
xrx.shape.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
};



/**
 * Sets the radius of this circle.
 * @param {number} r The radius.
 */
xrx.shape.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
};



/**
 * Draws this circle.
 */
xrx.shape.Circle.prototype.draw = function() {
  var center = this.getCenter();
  this.engineElement_.draw(center[0], center[1], this.getRadius(),
      this.getFillColor(), this.getFillOpacity(), this.getStrokeColor(),
      this.getStrokeWidth());
};



/**
 * Creates a new circle.
 * @param {xrx.shape.Canvas} The parent canvas object.
 */
xrx.shape.Circle.create = function(canvas) {
  return new xrx.shape.Circle(canvas);
};
