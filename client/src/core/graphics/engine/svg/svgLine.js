/**
 * @fileoverview SVG class representing a line.
 */

goog.provide('xrx.svg.Line');



goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



/**
 * SVG class representing a line.
 * @param {SVGLineElement} element The SVG line element.
 * @constructor
 * @extends xrx.svg.Stylable
 */
xrx.svg.Line = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.svg.Line, xrx.svg.Stylable);



/**
 * Sets the coordinates for this line.
 * @param {Array<Array<number>>} coords The coordinates.
 */
xrx.svg.Line.prototype.setCoords = function(coords) {
  this.element_.setAttribute('x1', coords[0][0]);
  this.element_.setAttribute('y1', coords[0][1]);
  this.element_.setAttribute('x2', coords[1][0]);
  this.element_.setAttribute('y2', coords[1][1]);
};



/**
 * Draws this line.
 * @param {Array<Array<number>>} coords The coordinates of the line.
 * @param {string} strokeColor The stroke color.
 * @param {number} strokeWidth The stroke width.
 */
xrx.svg.Line.prototype.draw = function(coords, strokeColor, strokeWidth) {
  if (coords !== undefined) this.setCoords(coords);
  this.strokeAndFill_(undefined, undefined, strokeColor, strokeWidth);
};



/**
 * Creates a new poly-line.
 */
xrx.svg.Line.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'line');
  return new xrx.svg.Line(element);
};
