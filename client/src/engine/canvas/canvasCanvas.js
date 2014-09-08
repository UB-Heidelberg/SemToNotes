/**
 * @fileoverview
 */

goog.provide('xrx.canvas.Canvas');



goog.require('goog.dom.DomHelper');
goog.require('xrx.canvas.Element');



/**
 * @constructor
 */
xrx.canvas.Canvas = function(element) {

  goog.base(this, element, element);

  this.childs_ = [];
};
goog.inherits(xrx.canvas.Canvas, xrx.canvas.Element);



xrx.canvas.Canvas.tagName = 'canvas';



xrx.canvas.Canvas.prototype.addChild = function(element) {
  this.childs_.push(element);
  element.draw();
};



xrx.canvas.Canvas.create = function(parent) {
  var element = goog.dom.createElement(xrx.canvas.Canvas.tagName);
  var canvas = new xrx.canvas.Canvas(element);
  goog.dom.insertChildAt(parent, canvas.getElement(), 0);
  return canvas;
};
