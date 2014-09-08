/**
 * @fileoverview
 */

goog.provide('xrx.svg.Image');



goog.require('xrx.svg.Element');
goog.require('xrx.svg');



/**
 * @constructor
 */
xrx.svg.Image = function(element, image) {

  goog.base(this, element);

  this.image_ = image;

  this.x_ = 0;

  this.y_ = 0;
};
goog.inherits(xrx.svg.Image, xrx.svg.Element);



xrx.svg.Image.tagName = 'image';



xrx.svg.Image.prototype.getWidth = function() {
  return this.image_ ? this.image_.naturalWidth : 0;
};



xrx.svg.Image.prototype.getHeight = function() {
  return this.image_ ? this.image_.naturalHeight : 0;
};



xrx.svg.Image.prototype.draw = function() {};



xrx.svg.Image.prototype.setImage = function(image) {
  this.element_.setAttributeNS(xrx.svg.Namespace['xlink'], 'xlink:href', image.src);
  this.image_ = image;
  this.setWidth(image.naturalWidth);
  this.setHeight(image.naturalHeight);
};



xrx.svg.Image.prototype.getBox = function() {
  return new goog.math.Box(this.y_, this.width_, this.height_, this.x_);
};



xrx.svg.Image.create = function(image) {
  var element = xrx.svg.Element.create(xrx.svg.Image);
  var newImage = new xrx.svg.Image(element)

  if (image) newImage.setImage(image);

  return newImage;
};
