***REMOVED***
***REMOVED*** @fileoverview Canvas class representing an image.
***REMOVED***

goog.provide('xrx.canvas.Image');



goog.require('goog.math.Box');
goog.require('xrx.canvas.Stylable');
goog.require('xrx.geometry.Rect');



***REMOVED***
***REMOVED*** Canvas class representing an image.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Stylable
***REMOVED***
xrx.canvas.Image = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Rect());

 ***REMOVED*****REMOVED***
  ***REMOVED*** The HTML image element used to instantiate the image.
  ***REMOVED*** @type {Image}
 ***REMOVED*****REMOVED***
  this.image_;
***REMOVED***
goog.inherits(xrx.canvas.Image, xrx.canvas.Stylable);



***REMOVED***
***REMOVED*** Returns the natural width of the image.
***REMOVED*** @return {number} The width.
***REMOVED***
xrx.canvas.Image.prototype.getWidth = function() {
  return this.geometry_.width;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Image.prototype.setWidth_ = function(width) {
  this.geometry_.width = width;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the natural height of the image.
***REMOVED*** @return {number} The height.
***REMOVED***
xrx.canvas.Image.prototype.getHeight = function() {
  return this.geometry_.height;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Image.prototype.setHeight_ = function(height) {
  this.geometry_.height = height;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the HTML image element used to create the image.
***REMOVED*** @return {Image} The HTML image element.
***REMOVED***
xrx.canvas.Image.prototype.getImage = function() {
  return this.image_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets a new HTML image element.
***REMOVED*** @param {Image} image The HTML image element.
***REMOVED***
xrx.canvas.Image.prototype.setImage = function(image) {
  this.image_ = image;
  this.setWidth_(image.naturalWidth);
  this.setHeight_(image.naturalHeight);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the image.
***REMOVED***
xrx.canvas.Image.prototype.draw = function() {
  if (this.image_) this.context_.drawImage(this.image_, this.geometry_.x,
      this.geometry_.y, this.geometry_.width, this.geometry_.height);
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new image by optionally overloading a HTML image element.
***REMOVED*** @param {?Image} The HTML image element.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
xrx.canvas.Image.create = function(opt_image, canvas) {
  var newImage = new xrx.canvas.Image(canvas);
  if (opt_image) newImage.setImage(opt_image);
  return newImage;
***REMOVED***
