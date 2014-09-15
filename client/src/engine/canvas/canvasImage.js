/**
 * @fileoverview
 */

goog.provide('xrx.canvas.Image');



goog.require('goog.math.Box');
goog.require('xrx.canvas.Element');



/**
 * @constructor
 */
xrx.canvas.Image = function(canvas, image) {

  goog.base(this, undefined, canvas);

  this.image_ = image;

  this.x_ = 0;

  this.y_ = 0;
};
goog.inherits(xrx.canvas.Image, xrx.canvas.Element);



xrx.canvas.Image.prototype.getWidth = function() {
  return this.image_ ? this.image_.naturalWidth : 0;
};



xrx.canvas.Image.prototype.setWidth = function(width) {
  this.width_ = width;
};



xrx.canvas.Image.prototype.getHeight = function() {
  return this.image_ ? this.image_.naturalHeight : 0;
};



xrx.canvas.Image.prototype.setHeight = function(height) {
  this.height_ = height;
};



xrx.canvas.Image.prototype.getImage = function() {
  return this.image_;
};



xrx.canvas.Image.prototype.setImage = function(image) {
  this.image_ = image;
  this.width_ = image.naturalWidth;
  this.height_ = image.naturalHeight;
};



xrx.canvas.Image.prototype.getBox = function() {
  return new goog.math.Box(this.y_, this.width_, this.height_, this.x_);
};



xrx.canvas.Image.prototype.draw = function() {
  if (this.image_) this.context_.drawImage(this.image_, this.x_,
      this.y_, this.width_, this.height_);
};



xrx.canvas.Image.create = function(image, canvas) {
  var i = new xrx.canvas.Image(canvas, image);
  i.width_ = image ? image.naturalWidth : 0;
  i.height_ = image ? image.naturalHeight : 0;
  return i;
};
