/**
 * @fileoverview
 */

goog.provide('xrx.shape.Rect');
goog.provide('xrx.shape.RectCreate');
goog.provide('xrx.shape.RectModify');



goog.require('xrx.engine.Engines');
goog.require('xrx.shape.Polygon');
goog.require('xrx.shape.Shape');
goog.require('xrx.shape.VertexDragger');



/**
 * @constructor
 */
xrx.shape.Rect = function(drawing) {

  goog.base(this, drawing);
};
goog.inherits(xrx.shape.Rect, xrx.shape.Shape);



xrx.shape.Rect.prototype.primitiveClass_ = 'Polygon';



xrx.shape.Rect.prototype.getBox = function() { 
};



xrx.shape.Rect.create = function(drawing) {
  return new xrx.shape.Rect(drawing);
};



xrx.shape.Rect.prototype.createModify = function() {
  return xrx.shape.RectModify.create(this);
};



xrx.shape.Rect.prototype.setAffineCoords = function(position) {
  var coords = this.getCoords();
  if (position === 0 || position === 2) {
    coords[1][0] = coords[2][0];
    coords[1][1] = coords[0][1];
    coords[3][0] = coords[0][0];
    coords[3][1] = coords[2][1];
  } else {
    coords[0][0] = coords[3][0];
    coords[0][1] = coords[1][1];
    coords[2][0] = coords[1][0];
    coords[2][1] = coords[3][1];
  }
  return coords;
};



xrx.shape.RectModify = function() {};



xrx.shape.RectModify.create = xrx.shape.PolygonModify.create;



xrx.shape.RectCreate = function(drawing) {

  this.drawing_ = drawing;

  this.count_ = 0;
};



xrx.shape.RectCreate.prototype.handleClick = function(e) {
  var circle;
  var shape;
  var coords;
  var rect;
  var point = this.drawing_.getEventPoint(e);

  if (this.count_ === 1) {
    shape = this.drawing_.getLayerShapeCreate().getShapes()[0];
    coords = new Array(4);
    coords[0] = shape.getCoordsCopy()[0];
    coords[1] = [point[0], coords[0][1]];
    coords[2] = [point[0], point[1]];
    coords[3] = [coords[0][0], point[1]];
    rect = xrx.shape.Rect.create(this.drawing_);
    rect.setCoords(coords);
    this.drawing_.getLayerShape().addShapes(rect);
    this.drawing_.getLayerShapeCreate().removeShapes();
    this.drawing_.draw();
    this.count_ = 0;
  } else {
    circle = xrx.shape.VertexDragger.create(this.drawing_);
    circle.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(circle);
    this.drawing_.draw();
    this.count_ += 1;
  }
};



goog.exportProperty(xrx.shape, 'RectCreate', xrx.shape.RectCreate);
