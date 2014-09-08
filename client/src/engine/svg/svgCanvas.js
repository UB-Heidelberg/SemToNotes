/**
 * @fileoverview
 */

goog.provide('xrx.svg.Canvas');



goog.require('goog.dom.DomHelper');
goog.require('xrx.svg.Element');



xrx.svg.Canvas = function(element) {

  goog.base(this, element);

  this.width_;

  this.height_;
};
goog.inherits(xrx.svg.Canvas, xrx.svg.Element);



xrx.svg.Canvas.tagName = 'svg';



xrx.svg.Canvas.prototype.addChild = function(element) {
  element.draw();
  goog.dom.append(this.element_, element.getElement());
};



xrx.svg.Canvas.create = function(parent) {
  var element = xrx.svg.Element.create(xrx.svg.Canvas);
  var canvas = new xrx.svg.Canvas(element);
  goog.dom.insertChildAt(parent, canvas.getElement(), 0);
  return canvas;
};
