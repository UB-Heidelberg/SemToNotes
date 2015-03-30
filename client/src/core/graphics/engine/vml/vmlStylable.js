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
 * @param {xrx.geometry.Geometry} geometry A geometry object.
 * @constructor
 * @extends {xrx.vml.Element}
 */
xrx.vml.Stylable = function(raphael, geometry) {

  goog.base(this, raphael);

  /**
   * Object describing the geometry of the stylable element.
   * @type {xrx.geometry.Geometry}
   */
  this.geometry_ = geometry;

  /**
   * Object describing the style of the stylable element.
   * @type {xrx.engine.Stylable}
   * @private
   */
  this.stylable_ = new xrx.engine.Stylable();
};
goog.inherits(xrx.vml.Stylable, xrx.vml.Element);



/**
 * Returns the geometry object of the stylable element.
 * @return {xrx.geometry.Geometry} The geometry object.
 */
xrx.vml.Stylable.prototype.getGeometry = function() {
  return this.geometry_;
};



/**
 * Returns the style object of the stylable element.
 * @return {xrx.engine.Stylable} The style object.
 */
xrx.vml.Stylable.prototype.getStylable = function() {
  return this.stylable_;
};



/**
 * Sets all styles at once by overloading a stylable object.
 * @param {xrx.engine.Stylable} stylable The stylable object.
 */
xrx.vml.Stylable.prototype.setStylable = function(stylable) {
  this.stylable_.setAll(stylable);
  this.setStrokeWidth(stylable.getStrokeWidth());
  this.setStrokeColor(stylable.getStrokeColor());
  this.setFillColor(stylable.getFillColor());
  this.setFillOpacity(stylable.getFillOpacity());
};



/**
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.vml.Stylable.prototype.setStrokeWidth = function(width) {
  var self = this;
  this.stylable_.setStrokeWidth(width);
  this.raphael_.attr({'stroke-width': self.stylable_.getStrokeWidth()});
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.vml.Stylable.prototype.setStrokeColor = function(color) {
  var self = this;
  this.stylable_.setStrokeColor(color);
  this.raphael_.attr({'stroke': self.stylable_.getStrokeColor()});
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.vml.Stylable.prototype.setFillColor = function(color) {
  var self = this;
  this.stylable_.setFillColor(color);
  this.raphael_.attr({'fill': self.stylable_.getFillColor()});
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {number} factor The fill opacity.
 */
xrx.vml.Stylable.prototype.setFillOpacity = function(factor) {
  var self = this;
  this.stylable_.setFillOpacity(factor);
  this.raphael_.attr({'fill-opacity': self.stylable_.getFillOpacity()});
};
