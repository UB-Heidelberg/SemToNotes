***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.Canvas');
goog.provide('xrx.widget.CanvasBackgroundImage');



goog.require('goog.array');
***REMOVED***
goog.require('goog.dom.dataset');
goog.require('goog.object');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.drawing.Toolbar');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.mvc.Controller');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.Canvas = function(element) {

  this.drawing_;

  this.toolbar_;

  this.nameInsertShapeCreate_;

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.Canvas, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-widget-canvas', xrx.widget.Canvas);



xrx.widget.Canvas.prototype.getDrawing = function() {
  return this.drawing_;
***REMOVED***



xrx.widget.Canvas.prototype.getNode = function() {
  return undefined;
***REMOVED***



xrx.widget.Canvas.prototype.mvcRefresh = function() {
***REMOVED***



xrx.widget.Canvas.prototype.createDrawing_ = function() {
  this.drawing_ = new xrx.drawing.Drawing(this.element_);
  this.drawing_.setModeView();
***REMOVED***



xrx.widget.Canvas.prototype.setNameShapeCreate = function(name) {
  this.nameInsertShapeCreate_ = name;
***REMOVED***



xrx.widget.Canvas.prototype.getWidgetShapeCreate = function() {
  var insertId;
  var containerDiv = goog.dom.getNextElementSibling(this.element_);
  var layerCreateDiv = goog.dom.getElementsByClass(
      'xrx-widget-canvas-layer-graphics-create', containerDiv)[0];
  var shapeDivs = goog.dom.getChildren(layerCreateDiv);
  goog.array.forEach(shapeDivs, function(e, i, a) {
    if (goog.dom.dataset.get(e, 'xrxGraphicsName') === this.nameInsertShapeCreate_)
        insertId = e.id;
  }, this);
  return xrx.mvc.getViewComponent(insertId);
***REMOVED***



xrx.widget.Canvas.prototype.createLayerGraphicsCreate_ = function() {
***REMOVED***
  // handle shape create
  this.drawing_.handleCreated = function() {
    self.getWidgetShapeCreate().execute();
 ***REMOVED*****REMOVED***
***REMOVED***



xrx.widget.Canvas.prototype.createDom = function() {
  this.createDrawing_();
  this.createLayerGraphicsCreate_();
***REMOVED***




***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasBackgroundImage = function(element) {

  this.canvas_;

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasBackgroundImage, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-widget-canvas-background-image', xrx.widget.CanvasBackgroundImage);



xrx.widget.CanvasBackgroundImage.prototype.createDom = function() {
  var containerDiv = goog.dom.getAncestorByClass(this.element_, 'xrx-widget-container');
  var canvasDiv = goog.dom.getPreviousElementSibling(containerDiv);
  this.canvas_ = xrx.mvc.getViewComponent(canvasDiv.id);
***REMOVED***



xrx.widget.CanvasBackgroundImage.prototype.mvcRefresh = function() {
  var url = this.getNode().getStringValue();
  this.canvas_.getDrawing().setBackgroundImage(url);
***REMOVED***
