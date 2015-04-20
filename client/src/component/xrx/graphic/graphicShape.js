/**
 * @fileoverview 
 */

goog.provide('xrx.graphic.Shape');



goog.require('goog.dom.classes');
goog.require('goog.dom.DomHelper');
goog.require('goog.style');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.graphic.Canvas');



/**
 * @constructor
 */
xrx.graphic.Shape = function(element) {

  this.canvas_;

  this.drawing_;

  this.shape_;

  this.unit_;

  goog.base(this, element);

  goog.dom.classes.add(element, 'xrx-shape');

  this.init_();
};
goog.inherits(xrx.graphic.Shape, xrx.mvc.ComponentView);



xrx.graphic.Shape.prototype.initModifiable_ = function() {
  var modifiable;
  var dataset = this.getDataset('xrxModifiable');
  dataset === 'false' ? modifiable = false : modifiable = true;
  if (this.shape_.setModifiable) this.shape_.setModifiable(modifiable);
};



xrx.graphic.Shape.prototype.initSelectable_ = function() {
  var self = this;
  this.shape_.handleSelected = function() {
    self.dispatch('xrx-event-graphic-selected');
    self.getCanvas().refresh();
  };
};



xrx.graphic.Shape.prototype.initStyle_ = function() {
  if (!this.shape_.getEngineShape) return;
  var shp = this.shape_.getEngineShape();
  var strokeWidth = this.getDataset('xrxStrokeWidth');
  var strokeColor = this.getDataset('xrxStrokeColor');
  var fillColor = this.getDataset('xrxFillColor');
  var fillOpacity = this.getDataset('xrxFillOpacity');
  if (strokeWidth) shp.setStrokeWidth(parseFloat(strokeWidth));
  if (strokeColor) shp.setStrokeColor(strokeColor);
  if (fillColor) shp.setFillColor(fillColor);
  if (fillOpacity) shp.setFillOpacity(parseFloat(fillOpacity));
};



xrx.graphic.Shape.prototype.init_ = function() {
  if (!this.getDrawing().getEngine().isAvailable()) return;
  this.initModifiable_();
  this.initSelectable_();
  this.initStyle_();
};



xrx.graphic.Shape.prototype.getCanvas = function() {
  if (this.canvas_ === undefined) {
    var canvasDiv = goog.dom.getAncestorByClass(this.element_, 'xrx-canvas');
    var canvasComponent = xrx.mvc.getComponent(canvasDiv.id);
    !canvasComponent ? this.canvas_ = new xrx.graphic.Canvas(canvasDiv) :
        this.canvas_ = canvasComponent;
  }
  return this.canvas_;
};



xrx.graphic.Shape.prototype.getDrawing = function() {
  return this.getCanvas().getDrawing();
};



xrx.graphic.Shape.prototype.getShape = function() {
  return this.shape_;
};



xrx.graphic.Shape.prototype.getUnit = function() {
  if (!this.unit_) this.unit_ = this.getDataset('xrxUnit');
  return this.unit_;
};



xrx.graphic.Shape.prototype.parseCoords = function(str) {
  var points = str.split(' ');
  var coords = [];
  var coord;
  for (var i = 0; i < points.length; i++) {
    coord = new Array(2);
    coord[0] = parseFloat(points[i].split(',')[0]);
    coord[1] = parseFloat(points[i].split(',')[1]);
    coords.push(coord);
  }
  return coords;
};



xrx.graphic.Shape.prototype.serializeCoords = function(coords) {
  var str = '';
  for(var i = 0, len = coords.length; i < len; i++) {
    str += coords[i][0].toFixed(1).toString();
    str += ',';
    str += coords[i][1].toFixed(1).toString();
    if (i <= len - 2) str += ' ';
  }
  return str;
};