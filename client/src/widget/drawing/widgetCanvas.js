/**
 * @fileoverview 
 */

goog.provide('xrx.widget.Canvas');
goog.provide('xrx.widget.CanvasBackgroundImage');



goog.require('goog.dom.DomHelper');
goog.require('goog.object');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.drawing.Toolbar');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');



/**
 * @constructor
 */
xrx.widget.Canvas = function(element) {

  this.drawing_;

  this.toolbar_;

  goog.base(this, element);
};
goog.inherits(xrx.widget.Canvas, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-widget-canvas', xrx.widget.Canvas);



xrx.widget.Canvas.prototype.getDrawing = function() {
  return this.drawing_;
};



xrx.widget.Canvas.prototype.getNode = function() {
  return undefined;
};



xrx.widget.Canvas.prototype.mvcRefresh = function() {
};



xrx.widget.Canvas.prototype.createDrawing_ = function() {
  this.drawing_ = new xrx.drawing.Drawing(this.element_);
  this.drawing_.setModeView();
};



xrx.widget.Canvas.prototype.createToolbar_ = function() {
  var element = goog.dom.getElementsByClass('xrx-widget-canvas-toolbar',
      this.element_)[0];
  if (this.drawing_.getEngine().isAvailable() && element)
      this.toolbar_ = new xrx.drawing.Toolbar(element, this.drawing_);
};



xrx.widget.Canvas.prototype.createDom = function() {
  this.createDrawing_();
  this.createToolbar_();
};




/**
 * @constructor
 */
xrx.widget.CanvasBackgroundImage = function(element) {

  this.canvas_;

  goog.base(this, element);
};
goog.inherits(xrx.widget.CanvasBackgroundImage, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-widget-canvas-background-image', xrx.widget.CanvasBackgroundImage);



xrx.widget.CanvasBackgroundImage.prototype.createDom = function() {
  var containerDiv = goog.dom.getAncestorByClass(this.element_, 'xrx-widget-container');
  var canvasDiv = goog.dom.getPreviousElementSibling(containerDiv);
  this.canvas_ = xrx.mvc.getViewComponent(canvasDiv.id);
};



xrx.widget.CanvasBackgroundImage.prototype.mvcRefresh = function() {
  var url = this.getNode().getStringValue();
  this.canvas_.getDrawing().setBackgroundImage(url);
};
