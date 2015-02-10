/**
 * @fileoverview VML class representing a stylable element.
 */

goog.provide('xrx.vml.Stylable');



goog.require('xrx.vml.Element');



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
   * Object describing the stroke style.
   */
  this.stroke_ = {
    color: 'black',
    width: 1
  };

  /**
   * Object describing the fill style.
   */
  this.fill_ = {
    color: '',
    opacity: 0
  };
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
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.vml.Stylable.prototype.setStrokeWidth = function(width) {
  var self = this;
  this.stroke_.width = width || this.stroke_.width;
  this.raphael_.attr({'stroke-width': self.stroke_.width});
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.vml.Stylable.prototype.setStrokeColor = function(color) {
  var self = this;
  this.stroke_.color = color || this.stroke_.color;
  this.raphael_.attr({'stroke': self.stroke_.color});
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.vml.Stylable.prototype.setFillColor = function(color) {
  var self = this;
  this.fill_.color = color || this.fill_.color;
  this.raphael_.attr({'fill': self.fill_.color});
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {string} factor The fill opacity.
 */
xrx.vml.Stylable.prototype.setFillOpacity = function(factor) {
  var self = this;
  this.fill_.opacity = factor || this.fill_.opacity;
  this.raphael_.attr({'fill-opacity': self.fill_.opacity});
};
