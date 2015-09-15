/**
 * @fileoverview A class representing the background layer of a drawing canvas.
 */

goog.provide('xrx.drawing.LayerBackground');



goog.require('xrx.drawing.Layer');
goog.require('xrx.shape.Group');
goog.require('xrx.shape.Rect');



/**
 * A class representing the background layer of a drawing canvas. The 
 * background layer can hold an image for image annotation.
 * @param {xrx.drawing.Drawing} canvas A canvas object.
 * @constructor
 * @extends xrx.drawing.Layer
 */
xrx.drawing.LayerBackground = function(drawing) {

  goog.base(this, drawing);

  /**
   * Pointer to the background image object.
   * @type {Object}
   * @private
   */
  this.image_;
};
goog.inherits(xrx.drawing.LayerBackground, xrx.drawing.Layer);



/**
 * Returns the background image object.
 * @return {Object} The background image object. 
 */
xrx.drawing.LayerBackground.prototype.getImage = function(image) {
  return this.image_;
};



/**
 * Sets a new background image.
 * @param {Image} image The new image.
 */
xrx.drawing.LayerBackground.prototype.setImage = function(image) {
  this.image_.setImage(image);
};



/**
 * Draws the layer.
 */
xrx.drawing.LayerBackground.prototype.draw = function() {
  this.image_.draw();
};



/**
 * @private
 */
xrx.drawing.LayerBackground.prototype.create_ = function() {
  var drawing = this.getDrawing();
  this.group_ = xrx.shape.Group.create(drawing);
  // install the background image
  this.image_ = xrx.shape.Image.create(drawing);
  this.group_.addChildren(this.image_);
};
