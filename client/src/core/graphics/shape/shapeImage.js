/**
 * @fileoverview
 */

goog.provide('xrx.shape.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.shape.Stylable');



/**
 * @constructor
 */
xrx.shape.Image = function(drawing) {

  goog.base(this, drawing, new xrx.geometry.Rect());

  this.image_;
};
goog.inherits(xrx.shape.Image, xrx.shape.Stylable);



xrx.shape.Image.prototype.engineClass_ = 'Image';



/**
 * Returns the HTML image element used to create the image.
 * @return {Image} The HTML image element.
 */
xrx.shape.Image.prototype.getImage = function() {
  return this.image_;
};



/**
 * Sets a new HTML image element.
 * @param {Image} image The HTML image element.
 */
xrx.shape.Image.prototype.setImage = function(image) {
  this.image_ = image;
  this.geometry_.width = image.naturalWidth;
  this.geometry_.height = image.naturalHeight;
};



xrx.shape.Image.create = function(drawing) {
  return new xrx.shape.Circle(drawing);
};