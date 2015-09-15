/**
 * @fileoverview Class representing a graphic canvas.
 */

goog.provide('xrx.shape.Canvas');



goog.require('xrx.engine');
goog.require('xrx.shape.Container');
goog.require('xrx.engine.Engines');



xrx.shape.Canvas = function(div, engine, canvas) {

  goog.base(this);

  this.div_ = div;

  this.engine_ = engine;

  this.canvas_ = canvas;
};
goog.inherits(xrx.shape.Canvas, xrx.shape.Container);



xrx.shape.Canvas.prototype.setHeight = function(height) {
  this.canvas_.setHeight(height);
};



xrx.shape.Canvas.prototype.setWidth = function(width) {
  this.canvas_.setWidth(width);
};



xrx.shape.Canvas.create = function(div, engine) {
  var canvas;
  switch(engine) {
    case xrx.engine.CANVAS:
      canvas = xrx.canvas.Canvas.create(div);
      break;
    case xrx.engine.SVG:
      canvas = xrx.svg.Canvas.create(div);
      break;
    case xrx.engine.VML:
      canvas = xrx.vml.Canvas.create(div);
      break;
    default:
      throw Error('Unknown engine.');
      break;
  };
  return new xrx.shape.Canvas(div, engine, canvas);
};
