/**
 * @fileoverview 
 */

goog.provide('xrx.widget.Shape');



goog.require('xrx.mvc.ComponentView');
goog.require('xrx.widget.Canvas');



/**
 * @constructor
 */
xrx.widget.Shape = function(element) {

  this.drawing_;

  this.shape_;

  goog.base(this, element);
};
goog.inherits(xrx.widget.Shape, xrx.mvc.ComponentView);



xrx.widget.Shape.prototype.findDrawing_ = function() {
  var canvasDiv = goog.dom.getAncestorByClass(this.element_, 'xrx-widget-canvas');
  var canvasComponent = xrx.mvc.getViewComponent(canvasDiv.id) || new xrx.widget.Canvas(canvasDiv);
  this.drawing_ = canvasComponent.getDrawing()
  return this.drawing_;
};



xrx.widget.Shape.prototype.getDrawing = function() {
  return this.drawing_ ||  this.findDrawing_();
};



xrx.widget.Shape.prototype.getShape = function() {
  return this.shape_;
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
