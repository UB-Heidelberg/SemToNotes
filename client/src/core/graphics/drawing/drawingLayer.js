***REMOVED***
***REMOVED*** @fileoverview A class representing a layer of a drawing canvas.
***REMOVED***

goog.provide('xrx.drawing.Layer');



***REMOVED***
***REMOVED***
***REMOVED***
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.MouseWheelHandler.EventType');
goog.require('xrx.engine.Engines');



***REMOVED***
***REMOVED*** A class representing a layer of a drawing canvas.
***REMOVED***
***REMOVED*** @param {xrx.drawing.Drawing} canvas A drawing object.
***REMOVED***
***REMOVED***
xrx.drawing.Layer = function(drawing) {

  this.drawing_ = drawing;

  this.locked_ = false;

  this.group_;

  this.shapes_ = [];

  this.create_();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the drawing canvas.
***REMOVED*** @return {xrx.drawing.Drawing}
***REMOVED***
xrx.drawing.Layer.prototype.getDrawing = function() {
  return this.drawing_;
***REMOVED***



xrx.drawing.Layer.prototype.setLocked = function(flag) {
  flag === true ? this.locked_ = true : this.locked_ = false;
***REMOVED***



xrx.drawing.Layer.prototype.isLocked = function() {
  return this.locked_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the layers group.
***REMOVED*** @return {xrx.engine.Group} The group.
***REMOVED***
xrx.drawing.Layer.prototype.getGroup = function() {
  return this.group_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the shapes of the layer.
***REMOVED*** @return {xrx.shape.Shape} The shapes.
***REMOVED***
xrx.drawing.Layer.prototype.getShapes = function() {
  return this.shapes_;
***REMOVED***



***REMOVED***
***REMOVED*** Draws all shapes of the layer.
***REMOVED***
xrx.drawing.Layer.prototype.draw = function() {
  this.group_.draw();
***REMOVED***



***REMOVED***
***REMOVED*** Adds shapes to the layer.
***REMOVED*** @param {?} shapes The shapes.
***REMOVED***
xrx.drawing.Layer.prototype.addShapes = function(shapes) {
  if (!goog.isArray(shapes)) shapes = [shapes];
  var primitiveShapes = [];
  for(var i = 0, len = shapes.length; i < len; i++) {
    this.shapes_.push(shapes[i]);
    primitiveShapes.push(shapes[i].getPrimitiveShape());
  }
  this.group_.addChildren(primitiveShapes);
***REMOVED***



***REMOVED***
***REMOVED*** Returns all shapes available in the layer.
***REMOVED*** @return {xrx.shape.Shape} The shapes.
***REMOVED***
xrx.drawing.Layer.prototype.getShapes = function() {
  return this.shapes_;
***REMOVED***



***REMOVED***
***REMOVED*** Removes all shapes from the layer;
***REMOVED***
xrx.drawing.Layer.prototype.removeShapes = function() {
  this.shapes_ = [];
  this.group_.removeChildren();
***REMOVED***



***REMOVED***
***REMOVED*** Removes a shape from the layer.
***REMOVED*** @param {xrx.shape.Shape} shape The shape to remove.
***REMOVED***
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
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.drawing.Layer.prototype.create_ = function() {
  var graphics = this.drawing_.getGraphics();
  var canvas = this.drawing_.getCanvas();
  this.group_ = graphics.Group.create(canvas);
***REMOVED***
