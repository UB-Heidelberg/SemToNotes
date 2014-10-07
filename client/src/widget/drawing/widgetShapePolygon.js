/**
 * @fileoverview 
 */

goog.provide('xrx.widget.ShapePolygon');
goog.provide('xrx.widget.ShapePolygonCoords');



goog.require('xrx.shape.Polygon');
goog.require('xrx.widget.Shape');



/**
 * @constructor
 */
xrx.widget.ShapePolygon = function(element, drawing) {

  goog.base(this, element, drawing);

  this.coords_;
};
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
};



xrx.widget.ShapePolygon.prototype.refresh = function() {
};



xrx.widget.ShapePolygon.prototype.createDom = function() {
  this.shape_ = xrx.shape.Polygon.create(this.drawing_);
  this.coords_ = new xrx.widget.ShapePolygonCoords(this.element_, this);
};



/**
 * @constructor
 */
xrx.widget.ShapePolygonCoords = function(element, polygon) {

  this.polygon_ = polygon;

  goog.base(this, element);
};
goog.inherits(xrx.widget.ShapePolygonCoords, xrx.mvc.ComponentView);



/**
 * @override
 */
xrx.widget.ShapePolygonCoords.prototype.getRefExpression = function() {
  return goog.dom.dataset.get(this.element_, 'xrxRefCoords');
};



xrx.widget.ShapePolygonCoords.prototype.createDom = function() {
};



xrx.widget.ShapePolygonCoords.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var coords = this.polygon_.parseCoords(str);
  this.polygon_.getShape().setCoords(coords);
};




