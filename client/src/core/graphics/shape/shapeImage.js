/**
 * @fileoverview A class representing an engine-independent
 * image graphic.
 */

goog.provide('xrx.shape.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.shape.Stylable');



/**
 * A class representing an engine-independent image graphic.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Image = function(canvas) {

  goog.base(this, canvas,
      canvas.getEngine().createImage(canvas.getEngineElement()),
      new xrx.geometry.Rect());

  /**
   * The HTML image element.
   * @type {HTMLImage}
   */
  this.image_;
};
goog.inherits(xrx.shape.Image, xrx.shape.Stylable);



/**
 * Returns the HTML image element used to create the image.
 * @return {HTMLImage} The HTML image element.
 */
xrx.shape.Image.prototype.getImage = function() {
  return this.image_;
};



/**
 * Sets a new HTML image element.
 * @param {HTMLImage} image The HTML image element.
 */
xrx.shape.Image.prototype.setImage = function(image) {
  this.image_ = image;
  this.geometry_.width = image.naturalWidth;
  this.geometry_.height = image.naturalHeight;
};



/**
 * Returns the height of this image.
 * @return {number} The height.
 */
xrx.shape.Image.prototype.getHeight = function() {
  return this.geometry_.height;
};



/**
 * Returns the width of this image.
 * @return {number} The width.
 */
xrx.shape.Image.prototype.getWidth = function() {
  return this.geometry_.width;
};



/**
 * Draws this image.
 */
xrx.shape.Image.prototype.draw = function() {
  this.startDrawing_();
  if (this.image_) this.engineElement_.draw(this.image_);
  this.finishDrawing_();
};



/**
 * Creates a new image graphic.
 * @param {xrx.shape.Canvas} The parent canvas object.
 */
xrx.shape.Image.create = function(canvas) {
  return new xrx.shape.Image(canvas);
};
