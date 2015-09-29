/**
 * @fileoverview VML class representing a polygon.
 */

goog.provide('xrx.vml.Polygon');



goog.require('xrx.vml');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing a polygon.
 * @param {HTMLElement} The HTML element.
 * @constructor
 * @extends xrx.vml.Stylable
 */
xrx.vml.Polygon = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.vml.Polygon, xrx.vml.Stylable);



/**
 * Sets the coordinates for the polygon.
 * @param {Array<Array<number>>} coords The coordinates.
 */
xrx.vml.Polygon.prototype.setCoords = function(coords) {
  xrx.vml.setPath(this.element_, coords, true);
};



/**
 * Draws the polygon.
 * @param {Array<Array<number>>} coords The polygon's coordinates.
 * @param {string} fillColor The fill color.
 * @param {number} fillOpacity Opacity of the fill color.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.vml.Polygon.prototype.draw = function(coords, fillColor,
    fillOpacity, strokeColor, strokeWidth) {
  if (coords !== undefined) this.setCoords(coords);
  this.strokeAndFill_(fillColor, fillOpacity, strokeColor, strokeWidth);
};



/**
 * Creates a new polygon.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Polygon.create = function(canvas) {
  var element = xrx.vml.createElement('shape');
  element.style['position'] = 'absolute';
  element.style['top'] = '0px';
  element.style['left'] = '0px';
  element.style['width'] = '100px';
  element.style['height'] = '100px';
  return new xrx.vml.Polygon(element);
};
