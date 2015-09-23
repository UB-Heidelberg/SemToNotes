/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent line shape.
 */

goog.provide('xrx.shape.Line');



goog.require('xrx.geometry.Path');
goog.require('xrx.shape.Stylable');



/**
 * Classes representing an engine-independent line shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Line = function(canvas) {

  goog.base(this, canvas,
      canvas.getEngine().createLine(canvas.getEngineElement()),
      new xrx.geometry.Path(2));
};
goog.inherits(xrx.shape.Line, xrx.shape.Stylable);



/**
 * Returns the x coordinate of the line's start point.
 * @return {number} The x coordinate of the line's start point.
 */
xrx.shape.Line.prototype.getX1 = function() {
  return this.geometry_.coords[0][0];
};



/**
 * Sets the x coordinate of the line's start point.
 * @param {number} x1 The x coordinate.
 */
xrx.shape.Line.prototype.setX1 = function(x1) {
  this.geometry_.coords[0][0] = x1;
};



/**
 * Returns the y coordinate of the line's start point.
 * @return {number} The y coordinate of the line's start point.
 */
xrx.shape.Line.prototype.getY1 = function() {
  return this.geometry_.coords[0][1];
};



/**
 * Sets the y coordinate of the line's start point.
 * @param {number} y1 The y coordinate.
 */
xrx.shape.Line.prototype.setY1 = function(y1) {
  this.geometry_.coords[0][1] = y1;
};



/**
 * Returns the x coordinate of the line's end point.
 * @return {number} The x coordinate of the line's end point.
 */
xrx.shape.Line.prototype.getX2 = function() {
  return this.geometry_.coords[1][0];
};



/**
 * Sets the x coordinate of the line's end point.
 * @param {number} x2 The x coordinate.
 */
xrx.shape.Line.prototype.setX2 = function(x2) {
  this.geometry_.coords[1][0] = x2;
};



/**
 * Returns the x coordinate of the line's end point.
 * @return {number} The x coordinate of the line's end point.
 */
xrx.shape.Line.prototype.getY2 = function() {
  return this.geometry_.coords[1][1];
};



/**
 * Sets the y coordinate of the line's end point.
 * @param {number} y2 The y coordinate.
 */
xrx.shape.Line.prototype.setY2 = function(y2) {
  this.geometry_.coords[1][1] = y2;
};



/**
 * Draws this line shape.
 */
xrx.shape.Line.prototype.draw = function() {
  var coords = this.getCoords();
  this.startDrawing_();
  this.engineElement_.draw(coords[0][0], coords[0][1], coords[1][0],
      coords[1][1], this.getStrokeColor(), this.getStrokeWidth());
  this.finishDrawing_();
};



/**
 * Creates a new line shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.Line.create = function(canvas) {
  return new xrx.shape.Line(canvas);
};
