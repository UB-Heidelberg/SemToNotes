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
    color: 'black',
    opacity: 1
  };
};
goog.inherits(xrx.vml.Stylable, xrx.vml.Element);



/**
 * Sets the stroke width of the stylable element.
 * @param {number} width The stroke width.
 */
xrx.vml.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
  this.raphael_.attr({'stroke-width': width});
};



/**
 * Sets the stroke color of the stylable element.
 * @param {string} color The stroke color.
 */
xrx.vml.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
  this.raphael_.attr({'stroke': color});
};



/**
 * Sets the fill color of the stylable element.
 * @param {string} color The fill color.
 */
xrx.vml.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
  this.raphael_.attr({'fill': color});
};



/**
 * Sets the fill opacity of the stylable element.
 * @param {string} factor The fill opacity.
 */
xrx.vml.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
  this.raphael_.attr({'fill-opacity': factor});
};
