/**
 * @fileoverview
 */

goog.provide('xrx.vml.Rect');



goog.require('xrx.graphic.Rect');
goog.require('xrx.vml.Element');
goog.require('xrx.vml.Stylable');



/**
 * @constructor
 */
xrx.vml.Rect = function(raphael) {

  goog.base(this, raphael);

  this.graphic_ = new xrx.graphic.Rect()
};
goog.inherits(xrx.vml.Rect, xrx.vml.Stylable);



xrx.vml.Rect.prototype.setX = function(x) {
  this.graphic_.x = x;
  this.raphael_.attr({x: x});
};



xrx.vml.Rect.prototype.setY = function(y) {
  this.graphic_.y = y;
  this.raphael_.attr({y: y});
};



xrx.vml.Rect.prototype.setWidth = function(width) {
  this.graphic_.width = width;
  this.raphael_.attr({width: width});
};



xrx.vml.Rect.prototype.setHeight = function(height) {
  this.graphic_.height = height;
  this.raphael_.attr({height: height});
};



xrx.vml.Rect.prototype.draw = function() {
  this.raphael_.show();
};



xrx.vml.Rect.create = function(canvas) {
  var raphael = canvas.getRaphael().rect(0, 0, 0, 0);
  raphael.hide();
  return new xrx.vml.Rect(raphael);
};
