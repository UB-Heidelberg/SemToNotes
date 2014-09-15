/**
 * @fileoverview
 */

goog.provide('xrx.vml.Canvas');



goog.require('goog.dom.DomHelper');
goog.require('xrx.vml');
goog.require('xrx.vml.Element');



/**
 * @constructor
 */
xrx.vml.Canvas = function(raphael) {

  goog.base(this, raphael);

  this.width_ = 0;

  this.height_ = 0;
};
goog.inherits(xrx.vml.Canvas, xrx.vml.Element);



xrx.vml.Canvas.prototype.addChild = function(element) {
  goog.dom.append(this.getElement(), element.getElement());
  element.draw();
};



xrx.vml.Canvas.prototype.setWidth = function(width) {
  this.width_ = width;
  this.raphael_.setSize(this.width_, this.height_);
};



xrx.vml.Canvas.prototype.setHeight = function(height) {
  this.height_ = height;
  this.raphael_.setSize(this.width_, this.height_);
};



xrx.vml.Canvas.create = function(parent) {
  var element = goog.dom.createElement('div');
  var raphael = Raphael(element, 0, 0);
  var canvas = new xrx.vml.Canvas(raphael);
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
};
