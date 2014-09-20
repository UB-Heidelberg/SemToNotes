***REMOVED***
***REMOVED*** @fileoverview VML class representing an image.
***REMOVED***

goog.provide('xrx.vml.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.vml.Stylable');



***REMOVED***
***REMOVED*** VML class representing an image.
***REMOVED*** @param {Raphael.circle} raphael The Raphael circle object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Stylable
***REMOVED***
xrx.vml.Image = function(raphael) {

  goog.base(this, raphael, new xrx.geometry.Rect());

 ***REMOVED*****REMOVED***
  ***REMOVED*** The HTML image element used to instantiate the image.
  ***REMOVED*** @type {Image}
 ***REMOVED*****REMOVED***
  this.image_;
***REMOVED***
goog.inherits(xrx.vml.Image, xrx.vml.Stylable);



***REMOVED***
***REMOVED*** Returns the natural width of the image.
***REMOVED*** @return {number} The width.
***REMOVED***
xrx.vml.Image.prototype.getWidth = function() {
  return this.geometry_.width;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.vml.Image.prototype.setWidth_ = function(width) {
  this.geometry_.width = width;
  this.raphael_.attr({width: width});
***REMOVED***



***REMOVED***
***REMOVED*** Returns the natural height of the image.
***REMOVED*** @return {number} The height.
***REMOVED***
xrx.vml.Image.prototype.getHeight = function() {
  return this.geometry_.height;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.vml.Image.prototype.setHeight_ = function(height) {
  this.geometry_.height = height;
  this.raphael_.attr({height: height});
***REMOVED***



***REMOVED***
***REMOVED*** Returns the HTML image element used to create the image.
***REMOVED*** @return {Image} The HTML image element.
***REMOVED***
xrx.vml.Image.prototype.getImage = function() {
  return this.image_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets a new HTML image element.
***REMOVED*** @param {Image} image The HTML image element.
***REMOVED***
xrx.vml.Image.prototype.setImage = function(image) {
  this.raphael_.attr({'src': image.src, 'width': image.naturalWidth,
      'height': image.naturalHeight});
  this.image_ = image;
  this.setWidth_(image.naturalWidth);
  this.setHeight_(image.naturalHeight);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the image.
***REMOVED***
xrx.vml.Image.prototype.draw = function() {
  this.raphael_.show();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new image by optionally overloading a HTML image element.
***REMOVED*** @param {?Image} The HTML image element.
***REMOVED*** @param {Raphael} canvas The parent Raphael object.
***REMOVED***
xrx.vml.Image.create = function(opt_image, canvas) {
  var raphael = canvas.getRaphael().image('', 0, 0, 0, 0);
  var newImage = new xrx.vml.Image(raphael);
  if (opt_image) newImage.setImage(opt_image);
  raphael.hide();
  return newImage;
***REMOVED***
