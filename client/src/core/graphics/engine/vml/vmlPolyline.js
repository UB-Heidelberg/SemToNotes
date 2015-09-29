/**
 * @fileoverview VML class representing a poly-line.
 */

goog.provide('xrx.vml.Polyline');



goog.require('xrx.vml');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing a poly-line.
 * @param {HTMLElement} The HTML element.
 * @constructor
 * @extends xrx.vml.Stylable
 */
xrx.vml.Polyline = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.vml.Polyline, xrx.vml.Stylable);



/**
 * Sets the coordinates for the poly-line.
 * @param {Array<Array<number>>} coords The coordinates.
 */
xrx.vml.Polyline.prototype.setCoords = function(coords) {
  xrx.vml.setPath(this.element_, coords);
};



/**
 * Draws this poly-line.
 * @param {Array<Array<number>>} coords The coordinates of the poly-line.
 * @param {string} fillColor The fill color.
 * @param {number} fillOpacity Opacity of the fill color.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.vml.Polyline.prototype.draw = function(coords, fillColor,
    fillOpacity, strokeColor, strokeWidth) {
  if (coords !== undefined) this.setCoords(coords);
  this.strokeAndFill_(fillColor, fillOpacity, strokeColor, strokeWidth);
};



/**
 * Creates a new poly-line.
 * @param {xrx.vml.Canvas} canvas The parent canvas object.
 */
xrx.vml.Polyline.create = function(canvas) {
  var element = xrx.vml.createElement('shape');
  element.style['position'] = 'absolute';
  element.style['top'] = '0px';
  element.style['left'] = '0px';
  element.style['width'] = '100px';
  element.style['height'] = '100px';
  return new xrx.vml.Polyline(element);
};
