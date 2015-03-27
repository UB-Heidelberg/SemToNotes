/**
 * @fileoverview 
 */

goog.provide('xrx.widget.Shape');



goog.require('goog.dom.classes');
goog.require('goog.dom.DomHelper');
goog.require('goog.style');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.widget.Canvas');



/**
 * @constructor
 */
xrx.widget.Shape = function(element) {

  this.canvas_;

  this.drawing_;

  this.shape_;

  this.unit_;

  goog.base(this, element);

  goog.dom.classes.add(element, 'xrx-shape');

  this.init_();
};
goog.inherits(xrx.widget.Shape, xrx.mvc.ComponentView);



xrx.widget.Shape.prototype.initModifiable_ = function() {
  var modifiable;
  var dataset = this.getDataset('xrxModifiable');
  dataset === 'false' ? modifiable = false : modifiable = true;
  if (this.shape_.setModifiable) this.shape_.setModifiable(modifiable);
};



xrx.widget.Shape.prototype.initSelectable_ = function() {
  var self = this;
  this.shape_.handleSelected = function() {
    self.dispatch('xrx-event-graphic-selected');
    self.getCanvas().refresh();
  };
};



xrx.widget.Shape.prototype.initStyle_ = function() {
  var borderWidth = parseInt(goog.style.getStyle_(this.element_, 'borderWidth'));
  var borderColor = goog.style.getStyle_(this.element_, 'borderTopColor');
  if (borderWidth !== NaN && this.shape_.setStrokeWidth) this.shape_.setStrokeWidth(borderWidth);
  if (this.shape_.setStrokeColor) this.shape_.setStrokeColor(borderColor);
};



xrx.widget.Shape.prototype.init_ = function() {
  if (!this.getDrawing().getEngine().isAvailable()) return;
  this.initModifiable_();
  this.initSelectable_();
  this.initStyle_();
};



xrx.widget.Shape.prototype.getCanvas = function() {
  if (this.canvas_ === undefined) {
    var canvasDiv = goog.dom.getAncestorByClass(this.element_, 'xrx-canvas');
    var canvasComponent = xrx.mvc.getComponent(canvasDiv.id);
    !canvasComponent ? this.canvas_ = new xrx.widget.Canvas(canvasDiv) :
        this.canvas_ = canvasComponent;
  }
  return this.canvas_;
};



xrx.widget.Shape.prototype.getDrawing = function() {
  return this.getCanvas().getDrawing();
};



xrx.widget.Shape.prototype.getShape = function() {
  return this.shape_;
};



xrx.widget.Shape.prototype.getUnit = function() {
  if (!this.unit_) this.unit_ = this.getDataset('xrxUnit');
  return this.unit_;
};



xrx.widget.Shape.prototype.parseCoords = function(str) {
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



xrx.widget.Shape.prototype.serializeCoords = function(coords) {
  var str = '';
  for(var i = 0, len = coords.length; i < len; i++) {
    str += coords[i][0].toFixed(1).toString();
    str += ',';
    str += coords[i][1].toFixed(1).toString();
    if (i <= len - 2) str += ' ';
  }
  return str;
};
