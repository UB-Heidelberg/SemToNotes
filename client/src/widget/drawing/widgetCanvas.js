/**
 * @fileoverview 
 */

goog.provide('xrx.widget.Canvas');
goog.provide('xrx.widget.CanvasBackgroundImage');



goog.require('goog.dom.DomHelper');
goog.require('goog.object');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.mvc.Mvc');
goog.require('xrx.widget.Shapes');



/**
 * @constructor
 */
xrx.widget.Canvas = function(element) {

  this.element_ = element;

  this.drawing_;

  this.backgroundImage_;

  this.createDom();
};



xrx.widget.Canvas.prototype.getDrawing = function() {
  return this.drawing_;
};



xrx.widget.Canvas.prototype.refresh = function() {
};



xrx.widget.Canvas.prototype.createDrawing_ = function() {
  this.drawing_ = new xrx.drawing.Drawing(this.element_, 'svg');
  this.drawing_.setModeView();
};



xrx.widget.Canvas.prototype.createBackgroundImage_ = function() {
  var container = goog.dom.getNextElementSibling(this.element_);
  var backgroundImage = goog.dom.getElementsByClass('xrx-widget-canvas-background-image',
      container)[0];
  this.backgroundImage_ = new xrx.widget.CanvasBackgroundImage(backgroundImage, this);
  xrx.mvc.Mvc.addViewComponent(this.backgroundImage_);
};



xrx.widget.Canvas.prototype.createLayerGraphics_ = function() {
  var container = goog.dom.getNextElementSibling(this.element_);
  var graphicsLayer = goog.dom.getElementsByClass('xrx-widget-canvas-layer-graphics',
      container)[0];
  var elements;
  var widget;
  var shapes = [];
  goog.object.forEach(xrx.widget.Shapes, function(component, key, o) {
    elements = goog.dom.getElementsByClass(key);
    for (var i = 0; i < elements.length; i++) {
      widget = new xrx.widget.Shapes[key](elements[i], this.drawing_)
      shapes.push(widget.getShape());
    }
  }, this);
  this.drawing_.getLayerShape().addShapes(shapes);
};



xrx.widget.Canvas.prototype.createDom = function() {
  this.createDrawing_();
  this.createBackgroundImage_();
  this.createLayerGraphics_();
};




/**
 * @constructor
 */
xrx.widget.CanvasBackgroundImage = function(element, canvas) {

  this.canvas_ = canvas;

  goog.base(this, element);
};
goog.inherits(xrx.widget.CanvasBackgroundImage, xrx.mvc.ComponentView);



xrx.widget.CanvasBackgroundImage.prototype.createDom = function() {
};



xrx.widget.CanvasBackgroundImage.prototype.refresh = function() {
  var url = this.getNode().getStringValue();
  this.canvas_.getDrawing().setBackgroundImage(url);
};
