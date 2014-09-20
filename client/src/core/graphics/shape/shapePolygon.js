***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.shape.Polygon');
goog.provide('xrx.shape.PolygonModify');
goog.provide('xrx.shape.PolygonCreate');



goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('xrx.engine.Engines');
goog.require('xrx.shape.Polyline');
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

  this.polyline_;

  this.circles_ = [];

  this.count_ = 0;
***REMOVED***



xrx.shape.PolygonCreate.prototype.handleClick = function(e, canvas) {
  var circle;
  var polygon;
  var coords;
  var point = this.drawing_.getEventPoint(e);
  var shape = this.drawing_.getShapeSelected(point);

  if (this.count_ === 0) { // user creates the first point
    // insert a poly-line
    this.polyline_ = xrx.shape.Polyline.create(this.drawing_);
    this.polyline_.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(this.polyline_);

    // insert a circle
    this.close_ = xrx.shape.VertexDragger.create(this.drawing_);
    this.close_.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(this.close_);
    this.circles_.push(this.close_);

    // redraw
    this.drawing_.draw();
    this.count_ += 1;

  } else if (shape === this.close_ && this.count_ === 1) { // user tries to create an invalid point
    // Do nothing if the user tries to close the path at the time
    // when there is only one point yet

  } else if (shape === this.close_) { // user closes the polygon
    // get the coordinates
    coords = new Array(this.circles_.length + 1);
    for (var i = 0; i < this.circles_.length; i++) {
      coords[i] = this.circles_[i].getCoordsCopy()[0];
    }
    coords[this.circles_.length] = this.circles_[0].getCoordsCopy()[0];

    // insert the polygon
    polygon = xrx.shape.Polygon.create(this.drawing_);
    polygon.setCoords(coords);
    this.drawing_.getLayerShape().addShapes(polygon);

    // remove the temporary shapes
    this.drawing_.getLayerShapeCreate().removeShapes();
    this.close_ = null;
    this.circles_ = [];

    // redraw
    this.drawing_.draw();
    this.count_ = 0;

  } else { // user creates another point
    // extend the poly-line
    this.polyline_.appendCoord(point);

    // insert another circle
    circle = xrx.shape.VertexDragger.create(this.drawing_);
    circle.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(circle);
    this.circles_.push(circle);

    // redraw
    this.drawing_.draw();
    this.count_ += 1;

  } 
***REMOVED***



goog.exportProperty(xrx.shape, 'PolygonCreate', xrx.shape.PolygonCreate);
