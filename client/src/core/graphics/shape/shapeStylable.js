/**
 * @fileoverview An abstract class describing style information for shapes.
 */

goog.provide('xrx.shape.Stylable');



goog.require('xrx.shape.Shape');



/**
 * An abstract class describing style information for shapes.
 * @constructor
 */
xrx.shape.Stylable = function(canvas, geometry) {

  goog.base(this, canvas);

  /**
   * Object describing the stroke style.
   */
  this.stroke_ = {
    color: 'black',
    width: 3
  };

  /**
   * Object describing the fill style.
   */
  this.fill_ = {
    color: '',
    opacity: 0
  };

  /**
   * Object describing the geometry of this stylable element.
   * @type {xrx.geometry.Geometry}
   */
  this.geometry_ = geometry;
};
goog.inherits(xrx.shape.Stylable, xrx.shape.Shape);



/**
 * Returns the geometry object of this stylable element.
 * @return {xrx.geometry.Geometry} The geometry object.
 */
xrx.shape.Stylable.prototype.getGeometry = function() {
  return this.geometry_;
};



/**
 * Sets the coordinates for this stylable element.
 * @param {Array<Array<number>>} coords The coordinates.
 */
xrx.shape.Stylable.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
};



/**
 * Returns the coordinates of this stylable element.
 * @return {Array<Array<number>>} The coordinates.
 */
xrx.shape.Stylable.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
};



/**
 * Updates one coordinate in the list of coordinates.
 * @param {number} pos Index of the coordinate to be updated.
 * @param {Array<number>} coord The new coordinate.
 */
xrx.shape.Stylable.prototype.setCoordAt = function(pos, coord) {
  this.geometry_.coords[pos] = coord;
};



/**
 * Sets all stylable parameters at once from another stylable object.
 * @param {xrx.shape.Stylable} stylable 
 */
xrx.shape.Stylable.prototype.setAll = function(stylable) {
  this.stroke_.color = stylable.getStrokeColor();
  this.stroke_.width = stylable.getStrokeWidth();
  this.fill_.color = stylable.getFillColor();
  this.fill_.opacity = stylable.getFillOpacity();
};



/**
 * Returns the stroke width of this stylable element.
 * @return {number} The stroke width.
 */
xrx.shape.Stylable.prototype.getStrokeWidth = function() {
  return this.stroke_.width;
};



/**
 * Sets the stroke width of this stylable element.
 * @param {number} width The stroke width.
 */
xrx.shape.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width || this.stroke_.width;
};



/**
 * Returns the stroke color of this stylable element.
 * @return {string} The stroke color.
 */
xrx.shape.Stylable.prototype.getStrokeColor = function() {
  return this.stroke_.color;
};



/**
 * Sets the stroke color of this stylable element.
 * @param {string} color The stroke color.
 */
xrx.shape.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color || this.stroke_.color;
};



/**
 * Returns the fill color of this stylable element.
 * @return {string} The fill color.
 */
xrx.shape.Stylable.prototype.getFillColor = function() {
  return this.fill_.color;
};



/**
 * Sets the fill color of this stylable element.
 * @param {string} color The fill color.
 */
xrx.shape.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color || this.fill_.color;
};



/**
 * Returns the fill opacity of this stylable element.
 * @return {number} The fill opacity.
 */
xrx.shape.Stylable.prototype.getFillOpacity = function() {
  return this.fill_.opacity;
};



/**
 * Sets the fill opacity of this stylable element.
 * @param {number} factor The fill opacity.
 */
xrx.shape.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor || this.fill_.opacity;
};
