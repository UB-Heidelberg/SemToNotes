/**
 * @fileoverview VML class representing a stylable element.
 */

goog.provide('xrx.vml.Stylable');



goog.require('xrx.vml.Element');
goog.require('xrx.engine');



/**
 * VML class representing a stylable element.
 * @param
 * @constructor
 * @extends {xrx.vml.Element}
 */
xrx.vml.Stylable = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.vml.Stylable, xrx.vml.Element);



/**
 * @private
 */
xrx.vml.Stylable.prototype.strokeAndFill_ = function(fillColor,
    fillOpacity, strokeColor, strokeWidth) {
  if (fillColor !== undefined) this.setFillColor(fillColor);
  if (fillOpacity !== undefined) this.setFillOpacity(fillOpacity);
  if (strokeColor !== undefined) this.setStrokeColor(strokeColor);
  if (strokeWidth !== undefined) this.setStrokeWidth(strokeWidth);
};



/**
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.vml.Stylable.prototype.setStrokeWidth = function(width) {
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.vml.Stylable.prototype.setStrokeColor = function(color) {
  this.element_['strokecolor'] = '' + color;
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.vml.Stylable.prototype.setFillColor = function(color) {
  this.element_['fillcolor'] = '' + color;
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {number} factor The fill opacity.
 */
xrx.vml.Stylable.prototype.setFillOpacity = function(factor) {
};
