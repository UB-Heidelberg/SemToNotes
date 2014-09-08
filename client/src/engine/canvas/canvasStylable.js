/**
 * @fileoverview
 */

goog.provide('xrx.canvas.Stylable');



goog.require('xrx.canvas.Element');



/**
 * @constructor
 */
xrx.canvas.Stylable = function(canvas) {

  goog.base(this, undefined, canvas);

  this.stroke_ = {
    color: 'black',
    width: 1
  };

  this.fill_ = {
    color: 'black',
    opacity: 1
  };
};
goog.inherits(xrx.canvas.Stylable, xrx.canvas.Element);



xrx.canvas.Stylable.prototype.setStrokeWidth = function(width) {
  this.stroke_.width = width;
};



xrx.canvas.Stylable.prototype.setStrokeColor = function(color) {
  this.stroke_.color = color;
};



xrx.canvas.Stylable.prototype.setFillColor = function(color) {
  this.fill_.color = color;
};



xrx.canvas.Stylable.prototype.setFillOpacity = function(factor) {
  this.fill_.opacity = factor;
};


xrx.canvas.Stylable.prototype.strokeAndFill_ = function() {
  this.context_.fillStyle = this.fill_.color;
  this.context_.globalAlpha = this.fill_.opacity;
  this.context_.fill();
  this.context_.globalAlpha = 1;
  this.context_.strokeStyle = this.stroke_.color;
  this.context_.lineWidth = this.stroke_.width;
  this.context_.stroke();
};
