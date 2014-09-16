***REMOVED***
***REMOVED*** @fileoverview A class representing the background group of a drawing canvas.
***REMOVED***

goog.provide('xrx.drawing.LayerBackground');



***REMOVED***
goog.require('goog.math.AffineTransform');
goog.require('goog.math');
goog.require('xrx.drawing.Layer');
goog.require('xrx.drawing.Mode');
goog.require('xrx.drawing.State');
goog.require('xrx.engine.Engine');
goog.require('xrx.engine.Engines');



***REMOVED***
***REMOVED*** A class representing the background layer of a drawing canvas. The 
***REMOVED*** background layer can hold an image for image annotation.
***REMOVED*** @param {xrx.drawing.Drawing} canvas A canvas object.
***REMOVED***
***REMOVED*** @extends xrx.drawing.Layer
***REMOVED***
xrx.drawing.LayerBackground = function(drawing) {

  goog.base(this, drawing);

  this.panningRect_;

  this.image_;
***REMOVED***
goog.inherits(xrx.drawing.LayerBackground, xrx.drawing.Layer);



xrx.drawing.LayerBackground.prototype.setCTM = function(matrix) {
  var graphics = this.getCanvas().getGraphics();
  graphics.setCTM(this.image_, matrix);
***REMOVED***



xrx.drawing.LayerBackground.prototype.getImage = function(image) {
  return this.image_;
***REMOVED***



xrx.drawing.LayerBackground.prototype.setImage = function(image) {
  this.image_.setImage(image);
***REMOVED***



xrx.drawing.LayerBackground.prototype.draw = function() {
  this.image_.draw();
***REMOVED***



xrx.drawing.LayerBackground.prototype.getPanningRect = function() {
  return this.panningRect_;
***REMOVED***



xrx.drawing.LayerBackground.prototype.handleResize = function(width, height) {
***REMOVED***
  var graphics = this.getCanvas().getGraphics();
  graphics.Rect.setWidth(self.panningRect_, width);
  graphics.Rect.setHeight(self.panningRect_, height);
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.drawing.LayerBackground.prototype.create_ = function() {
  var graphics = this.getDrawing().getGraphics();
  var canvas = this.getDrawing().getCanvas();

  this.group_ = graphics.Group.create(canvas);

  // install the background image
  this.image_ = graphics.Image.create(undefined, canvas);
  this.group_.addChildren(this.image_);
***REMOVED***
