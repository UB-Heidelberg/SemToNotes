/**
 * @fileoverview VML class representing an image.
 */

goog.provide('xrx.vml.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing an image.
 * @param {Raphael.circle} raphael The Raphael circle object.
 * @constructor
 * @extends xrx.cnvs.Stylable
 */
xrx.vml.Image = function(raphael) {

  goog.base(this, raphael, new xrx.geometry.Rect());

  /**
   * The HTML image element used to instantiate the image.
   * @type {Image}
   */
  this.image_;
};
goog.inherits(xrx.vml.Image, xrx.vml.Stylable);



/**
 * Returns the natural width of the image.
 * @return {number} The width.
 */
xrx.vml.Image.prototype.getWidth = function() {
  return this.geometry_.width;
};



/**
 * @private
 */
xrx.vml.Image.prototype.setWidth_ = function(width) {
  this.geometry_.width = width;
  this.raphael_.attr({width: width});
};



/**
 * Returns the natural height of the image.
 * @return {number} The height.
 */
xrx.vml.Image.prototype.getHeight = function() {
  return this.geometry_.height;
};



/**
 * @private
 */
xrx.vml.Image.prototype.setHeight_ = function(height) {
  this.geometry_.height = height;
  this.raphael_.attr({height: height});
};



/**
 * Returns the HTML image element used to create the image.
 * @return {Image} The HTML image element.
 */
xrx.vml.Image.prototype.getImage = function() {
  return this.image_;
};



/**
 * Sets a new HTML image element.
 * @param {Image} image The HTML image element.
 */
xrx.vml.Image.prototype.setImage = function(image) {
  this.raphael_.attr({'src': image.src, 'width': image.naturalWidth,
      'height': image.naturalHeight});
  this.image_ = image;
  this.setWidth_(image.naturalWidth);
  this.setHeight_(image.naturalHeight);
};



/**
 * Draws the image.
 */
xrx.vml.Image.prototype.draw = function() {
  this.raphael_.show();
};



/**
 * Creates a new image by optionally overloading a HTML image element.
 * @param {?Image} The HTML image element.
 * @param {Raphael} canvas The parent Raphael object.
 */
xrx.vml.Image.create = function(opt_image, canvas) {
  var raphael = canvas.getRaphael().image('', 0, 0, 0, 0);
  var newImage = new xrx.vml.Image(raphael);
  if (opt_image) newImage.setImage(opt_image);
  raphael.hide();
  return newImage;
};
