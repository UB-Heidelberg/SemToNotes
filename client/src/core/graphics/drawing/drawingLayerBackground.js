/**
 * @fileoverview A class representing the background group of a drawing canvas.
 */

goog.provide('xrx.drawing.LayerBackground');



goog.require('goog.dom.DomHelper');
goog.require('goog.math.AffineTransform');
goog.require('goog.math');
goog.require('xrx.drawing.Layer');
goog.require('xrx.drawing.Mode');
goog.require('xrx.drawing.State');
goog.require('xrx.engine.Engine');
goog.require('xrx.engine.Engines');



/**
 * A class representing the background layer of a drawing canvas. The 
 * background layer can hold an image for image annotation.
 * @param {xrx.drawing.Drawing} canvas A canvas object.
 * @constructor
 * @extends xrx.drawing.Layer
 */
xrx.drawing.LayerBackground = function(drawing) {

  goog.base(this, drawing);

  this.panningRect_;

  this.image_;
};
goog.inherits(xrx.drawing.LayerBackground, xrx.drawing.Layer);



xrx.drawing.LayerBackground.prototype.setCTM = function(matrix) {
  var graphics = this.getCanvas().getGraphics();
  graphics.setCTM(this.image_, matrix);
};



xrx.drawing.LayerBackground.prototype.getImage = function(image) {
  return this.image_;
};



xrx.drawing.LayerBackground.prototype.setImage = function(image) {
  this.image_.setImage(image);
};



xrx.drawing.LayerBackground.prototype.draw = function() {
  this.image_.draw();
};



xrx.drawing.LayerBackground.prototype.getPanningRect = function() {
  return this.panningRect_;
};



xrx.drawing.LayerBackground.prototype.handleResize = function(width, height) {
  var self = this;
  var graphics = this.getCanvas().getGraphics();
  graphics.Rect.setWidth(self.panningRect_, width);
  graphics.Rect.setHeight(self.panningRect_, height);
};



/**
 * @private
 */
xrx.drawing.LayerBackground.prototype.create_ = function() {
  var graphics = this.getDrawing().getGraphics();
  var canvas = this.getDrawing().getCanvas();

  this.group_ = graphics.Group.create(canvas);

  // install the background image
  this.image_ = graphics.Image.create(undefined, canvas);
  this.group_.addChildren(this.image_);
};
