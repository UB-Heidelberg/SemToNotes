/**
 * @fileoverview SVG class representing an image.
 */

goog.provide('xrx.svg.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



/**
 * SVG class representing an image.
 * @param {SVGImageElement} element The SVG image element.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.svg.Image = function(element) {

  goog.base(this, element, new xrx.geometry.Rect());

  /**
   * The HTML image element used to instantiate the image.
   * @type {Image}
   */
  this.image_;
};
goog.inherits(xrx.svg.Image, xrx.svg.Stylable);



/**
 * Returns the natural width of the image.
 * @return {number} The width.
 */
xrx.svg.Image.prototype.getWidth = function() {
  return this.geometry_.width;
};



/**
 * @private
 */
xrx.svg.Image.prototype.setWidth_ = function(width) {
  this.geometry_.width = width;
  this.element_.setAttribute('width', width);
};



/**
 * Returns the natural height of the image.
 * @return {number} The height.
 */
xrx.svg.Image.prototype.getHeight = function() {
  return this.geometry_.height;
};



/**
 * @private
 */
xrx.svg.Image.prototype.setHeight_ = function(height) {
  this.geometry_.height = height;
  this.element_.setAttribute('height', height);
};



/**
 * Returns the HTML image element used to create the image.
 * @return {Image} The HTML image element.
 */
xrx.svg.Image.prototype.getImage = function() {
  return this.image_;
};



/**
 * Sets a new HTML image element.
 * @param {Image} image The HTML image element.
 */
xrx.svg.Image.prototype.setImage = function(image) {
  this.element_.setAttributeNS(xrx.svg.Namespace['xlink'], 'xlink:href', image.src);
  this.image_ = image;
  this.setWidth_(image.naturalWidth);
  this.setHeight_(image.naturalHeight);
};



/**
 * Draws the image.
 */
xrx.svg.Image.prototype.draw = function() {};



/**
 * Creates a new image by optionally overloading a HTML image element.
 * @param {?Image} The HTML image element.
 */
xrx.svg.Image.create = function(opt_image, undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'image');
  var newImage = new xrx.svg.Image(element)
  if (opt_image) newImage.setImage(opt_image);
  return newImage;
};
