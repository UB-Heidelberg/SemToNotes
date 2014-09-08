***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg.Image');



goog.require('xrx.svg.Element');
goog.require('xrx.svg.Namespace');



xrx.svg.Image = function(element, image) {

***REMOVED***

  this.image_ = image;

  this.x_ = 0;

  this.y_ = 0;
***REMOVED***
goog.inherits(xrx.svg.Image, xrx.svg.Element);



xrx.svg.Image.tagName = 'image';



xrx.svg.Image.prototype.getWidth = function() {
  return this.image_ ? this.image_.naturalWidth : 0;
***REMOVED***



xrx.svg.Image.prototype.getHeight = function() {
  return this.image_ ? this.image_.naturalHeight : 0;
***REMOVED***



xrx.svg.Image.prototype.draw = function() {***REMOVED***



xrx.svg.Image.prototype.setImage = function(image) {
  this.element_.setAttributeNS(xrx.svg.Namespace['xlink'], 'xlink:href', image.src);
  this.image_ = image;
  this.setWidth(image.naturalWidth);
  this.setHeight(image.naturalHeight);
***REMOVED***



xrx.svg.Image.prototype.getBox = function() {
  return new goog.math.Box(this.y_, this.width_, this.height_, this.x_);
***REMOVED***



xrx.svg.Image.create = function(image) {
  var element = xrx.svg.Element.create(xrx.svg.Image);
  var newImage = new xrx.svg.Image(element)

  if (image) newImage.setImage(image);

  return newImage;
***REMOVED***
