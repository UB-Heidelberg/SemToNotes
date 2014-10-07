***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.ShapePolygon');



goog.require('xrx.shape.Polygon');
goog.require('xrx.widget.Shape');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapePolygon = function(element, drawing) {

  goog.base(this, element, drawing);
***REMOVED***
goog.inherits(xrx.widget.ShapePolygon, xrx.widget.Shape);



xrx.widget.ShapePolygon.prototype.parseCoords = function(str) {
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
***REMOVED***



xrx.widget.ShapePolygon.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var coords = this.parseCoords(str);
  this.shape_.setCoords(coords);
***REMOVED***



xrx.widget.ShapePolygon.prototype.createDom = function() {
  this.shape_ = xrx.shape.Polygon.create(this.drawing_);
***REMOVED***
