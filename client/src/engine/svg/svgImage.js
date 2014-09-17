***REMOVED***
***REMOVED*** @fileoverview SVG class representing an image.
***REMOVED***

goog.provide('xrx.svg.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



***REMOVED***
***REMOVED*** SVG class representing an image.
***REMOVED*** @param {SVGImageElement} element The SVG image element.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Stylable
***REMOVED***
xrx.svg.Image = function(element) {

  goog.base(this, element, new xrx.geometry.Rect());

 ***REMOVED*****REMOVED***
  ***REMOVED*** The HTML image element used to instantiate the image.
  ***REMOVED*** @type {Image}
 ***REMOVED*****REMOVED***
  this.image_;
***REMOVED***
goog.inherits(xrx.svg.Image, xrx.svg.Stylable);



***REMOVED***
***REMOVED*** Returns the natural width of the image.
***REMOVED*** @return {number} The width.
***REMOVED***
xrx.svg.Image.prototype.getWidth = function() {
  return this.geometry_.width;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.svg.Image.prototype.setWidth_ = function(width) {
  this.geometry_.width = width;
  this.element_.setAttribute('width', width);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the natural height of the image.
***REMOVED*** @return {number} The height.
***REMOVED***
xrx.svg.Image.prototype.getHeight = function() {
  return this.geometry_.height;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.svg.Image.prototype.setHeight_ = function(height) {
  this.geometry_.height = height;
  this.element_.setAttribute('height', height);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the HTML image element used to create the image.
***REMOVED*** @return {Image} The HTML image element.
***REMOVED***
xrx.svg.Image.prototype.getImage = function() {
  return this.image_;
***REMOVED***



***REMOVED***
***REMOVED*** Sets a new HTML image element.
***REMOVED*** @param {Image} image The HTML image element.
***REMOVED***
xrx.svg.Image.prototype.setImage = function(image) {
  this.element_.setAttributeNS(xrx.svg.Namespace['xlink'], 'xlink:href', image.src);
  this.image_ = image;
  this.setWidth_(image.naturalWidth);
  this.setHeight_(image.naturalHeight);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the image.
***REMOVED***
xrx.svg.Image.prototype.draw = function() {***REMOVED***



***REMOVED***
***REMOVED*** Creates a new image by optionally overloading a HTML image element.
***REMOVED*** @param {?Image} The HTML image element.
***REMOVED***
xrx.svg.Image.create = function(opt_image, undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'image');
  var newImage = new xrx.svg.Image(element)
  if (opt_image) newImage.setImage(opt_image);
  return newImage;
***REMOVED***
