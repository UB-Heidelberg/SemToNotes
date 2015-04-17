/**
 * @fileoverview Canvas class representing an image.
 */

goog.provide('xrx.cnvs.Image');



goog.require('goog.math.Box');
goog.require('xrx.cnvs.Stylable');
goog.require('xrx.geometry.Rect');



/**
 * Canvas class representing an image.
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.cnvs.Stylable
 */
xrx.cnvs.Image = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Rect());

  /**
   * The HTML image element used to instantiate the image.
   * @type {Image}
   */
  this.image_;
};
goog.inherits(xrx.cnvs.Image, xrx.cnvs.Stylable);



/**
 * Returns the natural width of the image.
 * @return {number} The width.
 */
xrx.cnvs.Image.prototype.getWidth = function() {
  return this.geometry_.width;
};



/**
 * @private
 */
xrx.cnvs.Image.prototype.setWidth_ = function(width) {
  this.geometry_.width = width;
};



goog.exportSymbol('xrx.cnvs.Image', xrx.cnvs.Image);



/**
 * Returns the natural height of the image.
 * @return {number} The height.
 */
xrx.cnvs.Image.prototype.getHeight = function() {
  return this.geometry_.height;
};



/**
 * @private
 */
xrx.cnvs.Image.prototype.setHeight_ = function(height) {
  this.geometry_.height = height;
};



/**
 * Returns the HTML image element used to create the image.
 * @return {Image} The HTML image element.
 */
xrx.cnvs.Image.prototype.getImage = function() {
  return this.image_;
};



/**
 * Sets a new HTML image element.
 * @param {Image} image The HTML image element.
 */
xrx.cnvs.Image.prototype.setImage = function(image) {
  this.image_ = image;
  this.setWidth_(image.naturalWidth);
  this.setHeight_(image.naturalHeight);
};



/**
 * Draws the image.
 */
xrx.cnvs.Image.prototype.draw = function() {
  if (this.image_) this.context_.drawImage(this.image_, this.geometry_.x,
      this.geometry_.y, this.geometry_.width, this.geometry_.height);
};



/**
 * Creates a new image by optionally overloading a HTML image element.
 * @param {?Image} The HTML image element.
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object.
 */
xrx.cnvs.Image.create = function(opt_image, canvas) {
  var newImage = new xrx.cnvs.Image(canvas);
  if (opt_image) newImage.setImage(opt_image);
  return newImage;
};
