/**
 * @fileoverview SVG class representing a poly-line.
 */

goog.provide('xrx.svg.Polyline');



goog.require('xrx.geometry.Path');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



/**
 * SVG class representing a poly-line.
 * @param {SVGPolylineElement} element The SVG polyline element.
 * @constructor
 * @extends xrx.svg.Stylable
 */
xrx.svg.Polyline = function(element) {

  goog.base(this, element, new xrx.geometry.Path());
};
goog.inherits(xrx.svg.Polyline, xrx.svg.Stylable);



/**
 * Sets the coordinates for the poly-line.
 * @param {Array.<Array.<number>>} coords The coordinates.
 */
xrx.svg.Polyline.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
  xrx.svg.setCoords(this.element_, coords);
};



/**
 * Returns the coordinates of the poly-line.
 * @return {Array.<Array.<number>>} The coordinates.
 */
xrx.svg.Polyline.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
};



/**
 * Appends a coordinate to the poly-line.
 * @param {Array.<number>} coord The new coordinate.
 */
xrx.svg.Polyline.prototype.appendCoord = function(coord) {
  this.geometry_.coords.push(coord);
  xrx.svg.setCoords(this.element_, this.geometry_.coords, false);
};



/**
 * Draws the poly-line.
 */
xrx.svg.Polyline.prototype.draw = function() {};



/**
 * Creates a new poly-line.
 */
xrx.svg.Polyline.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'polyline');
  return new xrx.svg.Polyline(element);
};
