/**
 * @fileoverview SVG class representing a polygon.
 */

goog.provide('xrx.svg.Polygon');



goog.require('xrx.geometry.Path');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



/**
 * SVG class representing a polygon.
 * @param {SVGPolygonElement} element The SVG polygon element.
 * @constructor
 * @extends xrx.svg.Stylable
 */
xrx.svg.Polygon = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.svg.Polygon, xrx.svg.Stylable);



/**
 * Sets the coordinates for the polygon.
 * @param {Array<Array<number>>} coords The coordinates.
 */
xrx.svg.Polygon.prototype.setCoords = function(coords) {
  xrx.svg.setCoords(this.element_, coords);
};



/**
 * Draws the polygon.
 * @param {xrx.shape.Shape} graphic The graphic to be drawn.
 */
xrx.svg.Polygon.prototype.draw = function(graphic) {
  this.setCoords(graphic.getGeometry().coords);
  this.strokeAndFill_(graphic);
};



/**
 * Creates a new polygon.
 */
xrx.svg.Polygon.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'polygon');
  return new xrx.svg.Polygon(element);
};
