***REMOVED***
***REMOVED*** @fileoverview A class representing a layer of a drawing canvas.
***REMOVED***

goog.provide('xrx.drawing.Layer');



***REMOVED***
***REMOVED*** A class representing a layer of a drawing canvas.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
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
***REMOVED*** Returns the drawing object.
***REMOVED*** @return {xrx.drawing.Drawing}
***REMOVED***
xrx.drawing.Layer.prototype.getDrawing = function() {
  return this.drawing_;
***REMOVED***



***REMOVED***
***REMOVED*** Locks or unlocks the layer so that the shapes are ignored by
***REMOVED*** xrx.drawing.EventTarget.
***REMOVED*** @param {boolean} flag Whether to lock or unlock the layer.
***REMOVED***
xrx.drawing.Layer.prototype.setLocked = function(flag) {
  flag === true ? this.locked_ = true : this.locked_ = false;
***REMOVED***



***REMOVED***
***REMOVED*** Returns whether the layer is locked currently.
***REMOVED*** @return {boolean} Locked or not.
***REMOVED***
xrx.drawing.Layer.prototype.isLocked = function() {
  return this.locked_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the layers group.
***REMOVED*** @return {Object} The group.
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
***REMOVED*** @param {xrx.shape.Shape} shapes The shapes.
***REMOVED***
xrx.drawing.Layer.prototype.addShapes = function(shapes) {
  if (!goog.isArray(shapes)) shapes = [shapes];
  var primitiveShapes = [];
  for(var i = 0, len = shapes.length; i < len; i++) {
    this.shapes_.push(shapes[i]);
    primitiveShapes.push(shapes[i].getEngineShape());
  }
  this.group_.addChildren(primitiveShapes);
***REMOVED***



***REMOVED***
***REMOVED*** Removes all shapes from the layer;
***REMOVED***
xrx.drawing.Layer.prototype.removeShapes = function() {
  this.shapes_ = [];
  this.group_.removeChildren();
***REMOVED***



***REMOVED***
***REMOVED*** Removes one shape from the layer.
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
