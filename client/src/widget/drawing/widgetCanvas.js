***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.Canvas');
goog.provide('xrx.widget.CanvasBackgroundImage');



***REMOVED***
goog.require('goog.object');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.drawing.Toolbar');
goog.require('xrx.mvc.Mvc');
goog.require('xrx.widget.Shapes');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.Canvas = function(element) {

  this.element_ = element;

  this.drawing_;

  this.toolbar_;

  this.backgroundImage_;

  this.createDom();
***REMOVED***



xrx.widget.Canvas.prototype.getDrawing = function() {
  return this.drawing_;
***REMOVED***



xrx.widget.Canvas.prototype.refresh = function() {
***REMOVED***



xrx.widget.Canvas.prototype.createDrawing_ = function() {
  this.drawing_ = new xrx.drawing.Drawing(this.element_, 'svg');
  this.drawing_.setModeView();
***REMOVED***



xrx.widget.Canvas.prototype.createToolbar_ = function() {
  var element = goog.dom.getElementsByClass('xrx-widget-canvas-toolbar',
      this.element_)[0];
  if (this.drawing_.getEngine().isAvailable() && element)
      this.toolbar_ = new xrx.drawing.Toolbar(element, this.drawing_);
***REMOVED***



xrx.widget.Canvas.prototype.createBackgroundImage_ = function() {
  var container = goog.dom.getNextElementSibling(this.element_);
  var backgroundImage = goog.dom.getElementsByClass('xrx-widget-canvas-background-image',
      container)[0];
  this.backgroundImage_ = new xrx.widget.CanvasBackgroundImage(backgroundImage, this);
  xrx.mvc.Mvc.addViewComponent(this.backgroundImage_);
***REMOVED***



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
***REMOVED***



xrx.widget.Canvas.prototype.createDom = function() {
  this.createDrawing_();
  this.createToolbar_();
  this.createBackgroundImage_();
  this.createLayerGraphics_();
***REMOVED***




***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasBackgroundImage = function(element, canvas) {

  this.canvas_ = canvas;

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasBackgroundImage, xrx.mvc.ComponentView);



xrx.widget.CanvasBackgroundImage.prototype.createDom = function() {
***REMOVED***



xrx.widget.CanvasBackgroundImage.prototype.refresh = function() {
  var url = this.getNode().getStringValue();
  this.canvas_.getDrawing().setBackgroundImage(url);
***REMOVED***
