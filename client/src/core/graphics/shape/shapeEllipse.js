/**
 * @fileoverview A class representing an engine-independent
 * ellipse graphic.
 */

goog.provide('xrx.shape.Ellipse');



goog.require('xrx.geometry.Ellipse');
goog.require('xrx.shape.Stylable');



/**
 * A class representing an engine-independent ellipse graphic.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.Ellipse = function(canvas, engineElement) {

  goog.base(this, canvas, engineElement, new xrx.geometry.Ellipse());
};
goog.inherits(xrx.shape.Ellipse, xrx.shape.Stylable);



/**
 * Returns the center point of this ellipse.
 * @return {Array<number>}
 */
xrx.shape.Ellipse.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
};



/**
 * Sets the center point of this ellipse.
 * @param {number} cx The X coordinate of the center point.
 * @param {number} cy The Y coordinate of the center point.
 */
xrx.shape.Ellipse.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
};



/**
 * Returns the major-radius of this ellipse.
 * @return {number} The radius.
 */
xrx.shape.Ellipse.prototype.getRadiusX = function() {
  return this.geometry_.rx;
};



/**
 * Sets the major-radius of this ellipse.
 * @param {number} r The radius.
 */
xrx.shape.Ellipse.prototype.setRadiusX = function(rx) {
  this.geometry_.rx = rx;
};



/**
 * Returns the minor-radius of this ellipse.
 * @return {number} The radius.
 */
xrx.shape.Ellipse.prototype.getRadiusY = function() {
  return this.geometry_.ry;
};



/**
 * Sets the minor-radius of this ellipse.
 * @param {number} ry The radius.
 */
xrx.shape.Ellipse.prototype.setRadiusY = function(ry) {
  this.geometry_.ry = ry;
};



/**
 * Draws this ellipse.
 */
xrx.shape.Ellipse.prototype.draw = function() {
  this.startDrawing_();
  var center = this.getCenter();
  this.engineElement_.draw(center[0], center[1], this.getRadiusX(),
      this.getRadiusY(), this.getFillColor(), this.getFillOpacity(),
      this.getStrokeColor(), this.getStrokeWidth());
  this.finishDrawing_();
};



/**
 * Creates a new ellipse.
 * @param {xrx.shape.Canvas} The parent canvas object.
 */
xrx.shape.Ellipse.create = function(canvas) {
  var engineElement;
  var engine = canvas.getEngine();
  var canvasElement = canvas.getEngineElement();
  if (engine.typeOf(xrx.engine.CANVAS)) {
    engineElement = xrx.canvas.Ellipse.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.SVG)) {
    engineElement = xrx.svg.Ellipse.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.VML)) {
    engineElement = xrx.vml.Ellipse.create(canvasElement);
  } else {
    throw Error('Unknown engine.');
  }
  return new xrx.shape.Ellipse(canvas, engineElement);
};
