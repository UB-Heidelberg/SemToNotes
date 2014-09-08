/**
 * @fileoverview A class representing a layer of a drawing canvas.
 */

goog.provide('xrx.drawing.Layer');



goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.MouseWheelHandler.EventType');
goog.require('xrx.graphics.Graphics');



/**
 * A class representing a layer of a drawing canvas.
 *
 * @param {xrx.drawing.Drawing} canvas A drawing object.
 * @constructor
 */
xrx.drawing.Layer = function(drawing) {

  this.drawing_ = drawing;

  this.locked_ = false;

  this.group_;

  this.shapes_ = [];

  this.create_();
};



/**
 * Returns the drawing canvas.
 * @return {xrx.drawing.Drawing}
 */
xrx.drawing.Layer.prototype.getDrawing = function() {
  return this.drawing_;
};



xrx.drawing.Layer.prototype.setLocked = function(flag) {
  flag === true ? this.locked_ = true : this.locked_ = false;
};



xrx.drawing.Layer.prototype.isLocked = function() {
  return this.locked_;
};



/**
 * Returns the layers group.
 * @return {xrx.graphics.Group} The group.
 */
xrx.drawing.Layer.prototype.getGroup = function() {
  return this.group_;
};



/**
 * Returns the shapes of the layer.
 * @return {xrx.shape.Shape} The shapes.
 */
xrx.drawing.Layer.prototype.getShapes = function() {
  return this.shapes_;
};



/**
 * Draws all shapes of the layer.
 */
xrx.drawing.Layer.prototype.draw = function() {
  this.group_.draw();
};



/**
 * Adds shapes to the layer.
 * @param {?} shapes The shapes.
 */
xrx.drawing.Layer.prototype.addShapes = function(shapes) {
  if (!goog.isArray(shapes)) shapes = [shapes];
  var primitiveShapes = [];
  for(var i = 0, len = shapes.length; i < len; i++) {
    this.shapes_.push(shapes[i]);
    primitiveShapes.push(shapes[i].getPrimitiveShape());
  }
  this.group_.addChildren(primitiveShapes);
};



/**
 * Returns all shapes available in the layer.
 * @return {xrx.shape.Shape} The shapes.
 */
xrx.drawing.Layer.prototype.getShapes = function() {
  return this.shapes_;
};



/**
 * Removes all shapes from the layer;
 */
xrx.drawing.Layer.prototype.removeShapes = function() {
  this.shapes_ = [];
  this.group_.removeChildren();
};



/**
 * Removes a shape from the layer.
 * @param {xrx.shape.Shape} shape The shape to remove.
 */
xrx.drawing.Layer.prototype.removeShape = function(shape) {
  var s;
  for (var i = 0, len = this.shapes_.length; i < len; i++) {
    s = this.shapes_[i];
    if (s === shape) {
      this.group_.removeChildAt(i);
      this.shapes_.splice(i, 1);
      break;
    }
  }
};



/**
 * @private
 */
xrx.drawing.Layer.prototype.create_ = function() {
  var graphics = this.drawing_.getGraphics();
  var canvas = this.drawing_.getCanvas();
  this.group_ = graphics.Group.create(canvas);
};
