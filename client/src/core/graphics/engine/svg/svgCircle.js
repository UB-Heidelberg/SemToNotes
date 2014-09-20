/**
 * @fileoverview SVG rendering class representing a circle.
 */

goog.provide('xrx.svg.Circle');



goog.require('xrx.geometry.Circle');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



/**
 * SVG rendering class representing a circle.
 * @param {SVGCircleElement} element The SVG circle element.
 * @constructor
 * @extends xrx.svg.Stylable
 */
xrx.svg.Circle = function(element) {

  goog.base(this, element, new xrx.geometry.Circle());
};
goog.inherits(xrx.svg.Circle, xrx.svg.Stylable);



/**
 * Returns the centre point of the circle.
 * @return {Array.<number>}
 */
xrx.svg.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
};



/**
 * Sets the centre point of a circle.
 * @param {number} cx The X coordinate of the centre point.
 * @param {number} cy The Y coordinate of the centre point.
 */
xrx.svg.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
  this.element_.setAttribute('cx', cx);
  this.element_.setAttribute('cy', cy);
};



/**
 * Returns the radius of the circle.
 * @return {number} The radius.
 */
xrx.svg.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
};



/**
 * Sets the radius of the circle.
 * @param {number} r The radius.
 */
xrx.svg.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
  this.element_.setAttribute('r', r);
};



/**
 * Draws the circle on the canvas.
 */
xrx.svg.Circle.prototype.draw = function() {};



/**
 * Creates a new circle.
 */
xrx.svg.Circle.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'circle');
  return new xrx.svg.Circle(element);
};
