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

  goog.base(this, raphael, new xrx.geometry.Circle());
};
goog.inherits(xrx.vml.Circle, xrx.vml.Stylable);



/**
 * Returns the centre point of the circle.
 * @return {Array<number>}
 */
xrx.vml.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
};



/**
 * Sets the centre point of a circle.
 * @param {number} cx The X coordinate of the centre point.
 * @param {number} cy The Y coordinate of the centre point.
 */
xrx.vml.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
  this.raphael_.attr({'cx': cx, 'cy': cy});
};



/**
 * Returns the radius of the circle.
 * @return {number} The radius.
 */
xrx.vml.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
};



/**
 * Sets the radius of the circle.
 * @param {number} r The radius.
 */
xrx.vml.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
  this.raphael_.attr({'r': r});
};



/**
 * Draws the circle on the canvas.
 */
xrx.vml.Circle.prototype.draw = function() {
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
