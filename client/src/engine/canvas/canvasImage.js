***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.canvas.Image');



goog.require('goog.math.Box');
goog.require('xrx.canvas.Element');



xrx.canvas.Image = function(canvas, image) {

  goog.base(this, undefined, canvas);

  this.image_ = image;

  this.x_ = 0;

  this.y_ = 0;
***REMOVED***
goog.inherits(xrx.canvas.Image, xrx.canvas.Element);



xrx.canvas.Image.prototype.getWidth = function() {
  return this.image_ ? this.image_.naturalWidth : 0;
***REMOVED***



xrx.canvas.Image.prototype.setWidth = function(width) {
  this.width_ = width;
***REMOVED***



xrx.canvas.Image.prototype.getHeight = function() {
  return this.image_ ? this.image_.naturalHeight : 0;
***REMOVED***



xrx.canvas.Image.prototype.setHeight = function(height) {
  this.height_ = height;
***REMOVED***



xrx.canvas.Image.prototype.setImage = function(image) {
  this.image_ = image;
***REMOVED***



xrx.canvas.Image.prototype.getBox = function() {
  return new goog.math.Box(this.y_, this.width_, this.height_, this.x_);
***REMOVED***



xrx.canvas.Image.prototype.draw = function() {
  if (this.image_) this.context_.drawImage(this.image_, this.x_,
      this.y_);
***REMOVED***



xrx.canvas.Image.create = function(image, canvas) {
  return new xrx.canvas.Image(canvas, image);
***REMOVED***
