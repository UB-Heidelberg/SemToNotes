***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.shape.Polygon');
goog.provide('xrx.shape.PolygonModify');
goog.provide('xrx.shape.PolygonCreate');



goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('xrx.engine.Engines');
goog.require('xrx.shape.Shape');
goog.require('xrx.shape.VertexDragger');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.shape.Polygon = function(drawing) {

  goog.base(this, drawing);
***REMOVED***
goog.inherits(xrx.shape.Polygon, xrx.shape.Shape);



xrx.shape.Polygon.prototype.primitiveClass_ = 'Polygon';



xrx.shape.Polygon.create = function(drawing) {
  return new xrx.shape.Polygon(drawing);
***REMOVED***



xrx.shape.Polygon.prototype.createModify = function(drawing) {
  return xrx.shape.PolygonModify.create(this);
***REMOVED***



xrx.shape.PolygonModify = function() {***REMOVED***



xrx.shape.PolygonModify.create = function(polygon) {
  var drawing = polygon.getDrawing();
  var graphics = drawing.getGraphics();
  var coords = polygon.getCoords();
  var draggers = [];
  var dragger;

  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.VertexDragger.create(drawing);
    dragger.setCoords([coords[i]]);
    dragger.setPosition(i);
    draggers.push(dragger);
  }

  return draggers;
***REMOVED***



xrx.shape.PolygonCreate = function(drawing) {

  this.drawing_ = drawing;

  this.close_;

  this.count_ = 0;
***REMOVED***



xrx.shape.PolygonCreate.prototype.handleClick = function(e, canvas) {
  var circle;
  var polygon;
  var coords;
  var shapes;
  var point = this.drawing_.getEventPoint(e);
  var shape = this.drawing_.getShapeSelected(point);

  if (this.count_ === 0) {
    this.close_ = xrx.shape.VertexDragger.create(this.drawing_);
    this.close_.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(this.close_);
    this.drawing_.draw();
    this.count_ += 1;
  } else if (shape === this.close_) {
    shapes = this.drawing_.getLayerShapeCreate().getShapes();
    coords = new Array(shapes.length + 1);
    for (var i = 0; i < shapes.length; i++) {
      coords[i] = shapes[i].getCoordsCopy()[0];
    }
    coords[shapes.length] = point;
    polygon = xrx.shape.Polygon.create(this.drawing_);
    polygon.setCoords(coords);
    this.drawing_.getLayerShape().addShapes(polygon);
    this.drawing_.getLayerShapeCreate().removeShapes();
    this.drawing_.draw();
    this.count_ = 0;
  } else {
    cirlce = xrx.shape.VertexDragger.create(this.drawing_);
    cirlce.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(cirlce);
    this.drawing_.draw();
  }
***REMOVED***



goog.exportProperty(xrx.shape, 'PolygonCreate', xrx.shape.PolygonCreate);
