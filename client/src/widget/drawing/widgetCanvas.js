***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.Canvas');
goog.provide('xrx.widget.CanvasBackgroundImage');



***REMOVED***
goog.require('xrx');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.mvc.Mvc');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.Canvas = function(element) {

  this.element_ = element;

  this.drawing_;

  this.container;

  this.backgroundImage_;

  this.createDom();
***REMOVED***



xrx.widget.Canvas.prototype.getDrawing = function() {
  return this.drawing_;
***REMOVED***



xrx.widget.Canvas.prototype.refresh = function() {
***REMOVED***



xrx.widget.Canvas.prototype.createDom = function() {
  // drawing
  this.drawing_ = new xrx.drawing.Drawing(this.element_);
  this.drawing_.setModeView();

  // container
  this.container_ = goog.dom.getNextElementSibling(this.element_);

  // background image
  var backgroundImage = goog.dom.getElementsByClass('xrx-widget-canvas-background-image',
      this.container_)[0];
  this.backgroundImage_ = new xrx.widget.CanvasBackgroundImage(backgroundImage, this);
  xrx.mvc.Mvc.addComponentView(this.backgroundImage_);

  // graphics layer
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
