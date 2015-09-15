/**
 * @fileoverview VML class representing a stylable element.
 */

goog.provide('xrx.vml.Stylable');



goog.require('xrx.vml.Element');
goog.require('xrx.engine');
goog.require('xrx.engine.Stylable');



/**
 * VML class representing a stylable element.
 * @param {Object} raphael A Raphael object.
 * @constructor
 * @extends {xrx.vml.Element}
 */
xrx.vml.Stylable = function(raphael) {

  goog.base(this, raphael);
};
goog.inherits(xrx.vml.Stylable, xrx.vml.Element);



/**
 * @private
 */
xrx.vml.Stylable.prototype.strokeAndFill_ = function(fillColor,
    fillOpacity, strokeColor, strokeWidth) {
  this.setFillColor(fillColor);
  this.setFillOpacity(fillOpacity);
  this.setStrokeColor(strokeColor);
  this.setStrokeWidth(strokeWidth);
};



/**
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.vml.Stylable.prototype.setStrokeWidth = function(width) {
  this.raphael_.attr({'stroke-width': width});
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.vml.Stylable.prototype.setStrokeColor = function(color) {
  this.raphael_.attr({'stroke': color});
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.vml.Stylable.prototype.setFillColor = function(color) {
  this.raphael_.attr({'fill': color});
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {number} factor The fill opacity.
 */
xrx.vml.Stylable.prototype.setFillOpacity = function(factor) {
  this.raphael_.attr({'fill-opacity': factor});
};
