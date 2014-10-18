/**
 * @fileoverview 
 */

goog.provide('xrx.widget.ShapePolygon');
goog.provide('xrx.widget.ShapePolygonCoords');



goog.require('goog.dom.dataset');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.mvc.Controller');
goog.require('xrx.shape.Polygon');
goog.require('xrx.widget.Shape');



/**
 * @constructor
 */
xrx.widget.ShapePolygon = function(element, drawing) {

  goog.base(this, element, drawing);

  this.shapePolygonCoords_;
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



xrx.widget.ShapePolygon.prototype.serializeCoords = function(coords) {
  var str = '';
  for(var i = 0, len = coords.length; i < len; i++) {
    str += coords[i][0].toString();
    str += ',';
    str += coords[i][1].toString();
    if (i <= len - 2) str += ' ';
  }
  return str;
};



xrx.widget.ShapePolygon.prototype.mvcRefresh = function() {
  this.shapePolygonCoords_.refresh();
};



xrx.widget.ShapePolygon.prototype.mvcDelete = function() {
  xrx.mvc.Controller.removeTagLike(this);
};



xrx.widget.ShapePolygon.prototype.mvcRemove = function() {
};



xrx.widget.ShapePolygon.prototype.update = function() {
  this.shapePolygonCoords_.update();
};



xrx.widget.ShapePolygon.prototype.createDom = function() {
  var self = this;
  this.shape_ = xrx.shape.Polygon.create(this.drawing_);
  this.shapePolygonCoords_ = new xrx.widget.ShapePolygonCoords(this);
  // handle value changes
  this.shape_.handleValueChanged = function() {
    self.update();
  }
  // handle delete component
  this.shape_.handleDeleted = function() {
    self.mvcDelete();
  }
};



/**
 * @constructor
 */
xrx.widget.ShapePolygonCoords = function(polygon) {

  this.polygon_ = polygon;

  goog.base(this, polygon.getElement());
};
goog.inherits(xrx.widget.ShapePolygonCoords, xrx.mvc.Component);



/**
 * @override
 */
xrx.widget.ShapePolygonCoords.prototype.getRefExpression = function() {
  return goog.dom.dataset.get(this.element_, 'xrxRefCoords');
};



xrx.widget.ShapePolygonCoords.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var coords = this.polygon_.parseCoords(str);
  this.polygon_.getShape().setCoords(coords);
};



xrx.widget.ShapePolygonCoords.prototype.update = function(coords) {
  xrx.mvc.Controller.replaceValueLike(this, this.polygon_.serializeCoords(
      this.polygon_.getShape().getCoords()));
};
