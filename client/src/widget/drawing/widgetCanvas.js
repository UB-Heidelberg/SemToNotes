/**
 * @fileoverview 
 */

goog.provide('xrx.widget.Canvas');
goog.provide('xrx.widget.CanvasGroup');
goog.provide('xrx.widget.CanvasBackgroundImage');



goog.require('goog.array');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.dataset');
goog.require('goog.object');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.drawing.Toolbar');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.mvc.Controller');



/**
 * @constructor
 */
xrx.widget.Canvas = function(element) {

  this.drawing_;

  this.graphics_;

  this.groups_ = [];

  this.nameInsertShapeCreate_;

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



xrx.widget.Canvas.prototype.setNameShapeCreate = function(name) {
  this.nameInsertShapeCreate_ = name;
};



xrx.widget.Canvas.prototype.getActiveGroup = function() {
  var group;
  goog.array.forEach(this.groups_, function(e, i, a) {
    if (e.getName() === this.nameInsertShapeCreate_)
        group = e;
  }, this);
  return group;
};



xrx.widget.Canvas.prototype.getWidgetShape = function() {
  var self = this;
  var layerGraphics = goog.dom.getElementsByClass(
      'xrx-widget-canvas-layer-graphics', this.element_)[0];
  var shapeDiv = goog.dom.findNode(layerGraphics, function(node) {
    if (!goog.dom.isElement(node)) {
      return false;
    } else if (goog.dom.dataset.get(node, 'xrxGraphicsName') === self.nameInsertShapeCreate_) {
      return true;
    } else {
      return false;
    }
  });
  return xrx.mvc.getViewComponent(shapeDiv.id);
};



xrx.widget.Canvas.prototype.refresh = function() {
  var repeat;
  this.drawing_.getLayerShape().removeShapes();
  goog.array.forEach(this.groups_, function(e, i, a) {
    repeat = goog.dom.getChildren(e.getElement())[0];
    xrx.mvc.getComponent(repeat.id).mvcRefresh();
  });
};



xrx.widget.Canvas.prototype.createDom = function() {
  var self = this;
  // initialize drawing
  var datasetEngine = goog.dom.dataset.get(this.elment_, 'xrxEngine');
  this.drawing_ = new xrx.drawing.Drawing(this.element_, datasetEngine);
  this.drawing_.setModeView();
  // search for graphics DIV
  this.graphics_ = goog.dom.getElementsByClass('xrx-widget-canvas-graphics',
      this.element_)[0];
  // initialize named graphic groups
  var groups = goog.dom.getChildren(this.graphics_);
  goog.array.forEach(groups, function(e, i, a) {
    self.groups_.push(new xrx.widget.CanvasGroup(e, self));
  });
  // handle shape create
  this.drawing_.handleCreated = function() {
    self.getActiveGroup().dispatchShapeCreated();
    self.refresh();
  };
};



/**
 * @constructor
 */
xrx.widget.CanvasGroup = function(element, canvas) {

  this.element_ = element;

  this.canvas_ = canvas;

  this.name_ = goog.dom.dataset.get(this.element_, 'xrxGraphicsName');
};



xrx.widget.CanvasGroup.prototype.dispatchShapeCreated = function() {
  var actionElement = goog.dom.findNode(this.element_, function(node) {
    return goog.dom.isElement(node) &&
    goog.dom.dataset.get(node, 'xrxEvent') === 'xrx-event-graphic-created' ?
        true : false; 
  });
  if (actionElement) xrx.mvc.getModelComponent(actionElement.id).execute();
};



xrx.widget.CanvasGroup.prototype.getElement = function() {
  return this.element_;
};



xrx.widget.CanvasGroup.prototype.getName = function() {
  return this.name_;
};



xrx.widget.CanvasGroup.prototype.getShapeCreate = function() {
  var div = goog.dom.getChildren(this.element_)[1];
  return xrx.mvc.getComponent(div.id);
};



xrx.widget.CanvasGroup.prototype.getShapeInsert = function() {
  var div = goog.dom.getChildren(this.element_)[2];
  return xrx.mvc.getComponent(div.id);
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



xrx.widget.CanvasBackgroundImage.prototype.mvcRefresh = function() {
  var url = this.getNode().getStringValue();
  this.canvas_.getDrawing().setBackgroundImage(url);
};



xrx.widget.CanvasBackgroundImage.prototype.createDom = function() {
  var canvasDiv = goog.dom.getAncestorByClass(this.element_, 'xrx-widget-canvas');
  this.canvas_ = xrx.mvc.getViewComponent(canvasDiv.id);
};
