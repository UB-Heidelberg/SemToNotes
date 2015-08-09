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
 * Sets the centre point of a circle.
 * @param {number} cx The X coordinate of the centre point.
 * @param {number} cy The Y coordinate of the centre point.
 */
xrx.svg.Circle.prototype.setCenter = function(cx, cy) {
  this.element_.setAttribute('cx', cx);
  this.element_.setAttribute('cy', cy);
};



/**
 * Sets the radius of the circle.
 * @param {number} r The radius.
 */
xrx.svg.Circle.prototype.setRadius = function(r) {
  this.element_.setAttribute('r', r);
};



/**
 * Draws the circle on the canvas.
 * @param {xrx.shape.Shape} graphic The graphic to be drawn.
 */
xrx.svg.Circle.prototype.draw = function(graphic) {
  var geometry = graphic.getGeometry();
  this.setCenter(geometry.cx, geometry.cy);
  this.setRadius(geometry.r);
  this.strokeAndFill_(graphic);
};



/**
 * Creates a new circle.
 */
xrx.svg.Circle.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'circle');
  return new xrx.svg.Circle(element);
};
