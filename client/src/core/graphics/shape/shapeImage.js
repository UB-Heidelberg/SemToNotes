/**
 * @fileoverview A class representing an engine-independent
 * image graphic.
 */

goog.provide('xrx.shape.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.shape.Stylable');



/**
 * A class representing an engine-independent image graphic.
 * @constructor
 */
xrx.shape.Image = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Rect());

  /**
   * The HTML image element.
   * @type {HTMLImage}
   */
  this.image_;
};
goog.inherits(xrx.shape.Image, xrx.shape.Stylable);



/**
 * The engine class used to render this image graphic.
 * @type {string}
 * @const
 */
xrx.shape.Image.prototype.engineClass_ = 'Image';



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
 * Draws this image.
 */
xrx.shape.Image.prototype.draw = function() {
  this.engineElement_.draw(this.image_);
};



/**
 * Creates a new image graphic.
 * @param {xrx.shape.Canvas} The parent canvas object.
 */
xrx.shape.Image.create = function(canvas) {
  return new xrx.shape.Image(canvas);
};
