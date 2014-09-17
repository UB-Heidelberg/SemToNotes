/**
 * @fileoverview SVG class representing a polygon.
 */

goog.provide('xrx.svg.Polygon');



goog.require('xrx.geometry.Polygon');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



/**
 * SVG class representing a polygon
 * @param {SVGPolygonElement} element The SVG polygon element.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.svg.Polygon = function(element) {

  goog.base(this, element, new xrx.geometry.Polygon());
};
goog.inherits(xrx.svg.Polygon, xrx.svg.Stylable);



/**
 * Sets the coordinates for the polygon.
 * @param {Array.<Array.<number>>} coords The coordinates.
 */
xrx.svg.Polygon.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
  xrx.svg.setCoords(this.element_, coords);
};



/**
 * Returns the coordinates of the polygon.
 * @return {Array.<Array.<number>>} The coordinates.
 */
xrx.svg.Polygon.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
};



/**
 * Updates one coordinate in the list of coordinates.
 * @param {number} pos Index of the coordinate to be updated.
 * @param {Array.<number>} coord The new coordinate.
 */
xrx.svg.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.geometry_.coords[pos] = coord;
  xrx.svg.setCoords(this.element_, this.geometry_.coords);
};



/**
 * Draws the polygon.
 */
xrx.svg.Polygon.prototype.draw = function() {};



/**
 * Creates a new polygon.
 */
xrx.svg.Polygon.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'polygon');
  return new xrx.svg.Polygon(element);
};
