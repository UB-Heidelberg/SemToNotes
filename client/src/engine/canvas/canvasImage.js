/**
 * @fileoverview Canvas class representing an image.
 */

goog.provide('xrx.canvas.Image');



goog.require('goog.math.Box');
goog.require('xrx.canvas.Stylable');
goog.require('xrx.geometry.Rect');



/**
 * Canvas class representing an image.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.canvas.Image = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Rect());

  /**
   * The HTML image element used to instantiate the image.
   * @type {Image}
   */
  this.image_;
};
goog.inherits(xrx.canvas.Image, xrx.canvas.Stylable);



/**
 * Returns the natural width of the image.
 * @return {number} The width.
 */
xrx.canvas.Image.prototype.getWidth = function() {
  return this.geometry_.width;
};



/**
 * @private
 */
xrx.canvas.Image.prototype.setWidth_ = function(width) {
  this.geometry_.width = width;
};



/**
 * Returns the natural height of the image.
 * @return {number} The height.
 */
xrx.canvas.Image.prototype.getHeight = function() {
  return this.geometry_.height;
};



/**
 * @private
 */
xrx.canvas.Image.prototype.setHeight_ = function(height) {
  this.geometry_.height = height;
};



/**
 * Returns the HTML image element used to create the image.
 * @return {Image} The HTML image element.
 */
xrx.canvas.Image.prototype.getImage = function() {
  return this.image_;
};



/**
 * Sets a new HTML image element.
 * @param {Image} image The HTML image element.
 */
xrx.canvas.Image.prototype.setImage = function(image) {
  this.image_ = image;
  this.setWidth_(image.naturalWidth);
  this.setHeight_(image.naturalHeight);
};



/**
 * Draws the image.
 */
xrx.canvas.Image.prototype.draw = function() {
  if (this.image_) this.context_.drawImage(this.image_, this.geometry_.x,
      this.geometry_.y, this.geometry_.width, this.geometry_.height);
};



/**
 * Creates a new image by optionally overloading a HTML image element.
 * @param {?Image} The HTML image element.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Image.create = function(opt_image, canvas) {
  var newImage = new xrx.canvas.Image(canvas);
  if (opt_image) newImage.setImage(opt_image);
  return newImage;
};
