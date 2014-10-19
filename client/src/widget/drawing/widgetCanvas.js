***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.Canvas');
goog.provide('xrx.widget.CanvasBackgroundImage');



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



xrx.widget.Canvas.prototype.createToolbar_ = function() {
  var element = goog.dom.getElementsByClass('xrx-widget-canvas-toolbar',
      this.element_)[0];
  if (this.drawing_.getEngine().isAvailable() && element)
      this.toolbar_ = new xrx.drawing.Toolbar(element, this.drawing_);
***REMOVED***



xrx.widget.Canvas.prototype.createLayerGraphicsCreate_ = function() {
***REMOVED***
  var containerDiv = goog.dom.getNextElementSibling(this.element_);
  var polygonDiv = goog.dom.getElementsByClass('xrx-widget-shape-polygon',
      containerDiv)[0];
  var rectDiv = goog.dom.getElementsByClass('xrx-widget-shape-rect',
      containerDiv)[0];
  var polygonDataset = goog.dom.dataset.get(polygonDiv, 'xrxInsertOrigin');
  var rectDataset = goog.dom.dataset.get(rectDiv, 'xrxInsertOrigin');
  var polygonOriginNode = xrx.mvc.getModelComponent(polygonDataset).getNode(0);
  var rectOriginNode = xrx.mvc.getModelComponent(rectDataset).getNode(0);
  // handle shape create
  this.drawing_.handleCreated = function() {
    var polygonRepeat = xrx.mvc.getViewComponent(polygonDiv.id).getRepeat();
    var rectRepeat = xrx.mvc.getViewComponent(rectDiv.id).getRepeat();
    var create = self.getDrawing().getCreate();
    if (create instanceof xrx.shape.PolygonCreate) {
      xrx.mvc.Controller.insertNode(polygonRepeat, polygonOriginNode);
    } else if (create instanceof xrx.shape.RectCreate) {
      //xrx.mvc.Controller.insertNode(undefined, rectOriginNode);
    } else {}
 ***REMOVED*****REMOVED***
***REMOVED***



xrx.widget.Canvas.prototype.createDom = function() {
  this.createDrawing_();
  this.createToolbar_();
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
