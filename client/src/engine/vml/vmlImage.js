***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.vml.Image');



goog.require('xrx.graphic.Rect');
goog.require('xrx.vml');
goog.require('xrx.vml.Element');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.vml.Image = function(raphael, image) {

  goog.base(this, raphael);

  this.image_ = image;

  this.graphic_ = new xrx.graphic.Rect()
***REMOVED***
goog.inherits(xrx.vml.Image, xrx.vml.Element);



xrx.vml.Image.prototype.getWidth = function() {
  return this.image_ ? this.image_.naturalWidth : 0;
***REMOVED***



xrx.vml.Image.prototype.setWidth = function(width) {
  this.graphic_.width = width;
  this.raphael_.attr({width: width});
***REMOVED***



xrx.vml.Image.prototype.getHeight = function() {
  return this.image_ ? this.image_.naturalHeight : 0;
***REMOVED***



xrx.vml.Image.prototype.setHeight = function(height) {
  this.graphic_.height = height;
  this.raphael_.attr({height: height});
***REMOVED***



xrx.vml.Image.prototype.draw = function() {
  this.raphael_.show();
***REMOVED***



xrx.vml.Image.prototype.setImage = function(image) {
  this.image_ = image;
  this.raphael_.attr({'src': image.src, 'width': image.naturalWidth,
      'height': image.naturalHeight});
***REMOVED***



xrx.vml.Image.prototype.getBox = function() {
  return new goog.math.Box(this.y_, this.width_, this.height_, this.x_);
***REMOVED***



xrx.vml.Image.create = function(image, canvas) {
  var raphael = canvas.getRaphael().image('', 0, 0, 0, 0);
  raphael.hide();
  return new xrx.vml.Image(raphael, image);
***REMOVED***
