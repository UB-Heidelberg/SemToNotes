***REMOVED***
***REMOVED*** @fileoverview Classes representing a modifiable and creatable
***REMOVED***     polygon shape.
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
***REMOVED*** A class representing a polygon shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
***REMOVED***
xrx.shape.Polygon = function(drawing) {

  goog.base(this, drawing);
***REMOVED***
goog.inherits(xrx.shape.Polygon, xrx.shape.Shape);



***REMOVED***
***REMOVED*** The engine class used to render this shape.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED***
xrx.shape.Polygon.prototype.engineClass_ = 'Polygon';



***REMOVED***
***REMOVED*** Creates a new polygon shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
xrx.shape.Polygon.create = function(drawing) {
  return new xrx.shape.Polygon(drawing);
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new instance of a modifiable polygon shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
xrx.shape.Polygon.prototype.createModify = function(drawing) {
  return xrx.shape.PolygonModify.create(this);
***REMOVED***



***REMOVED***
***REMOVED*** A class representing a modifiable polygon shape.
***REMOVED***
***REMOVED***
xrx.shape.PolygonModify = function() {***REMOVED***



***REMOVED***
***REMOVED*** Creates a new modifiable polygon shape.
***REMOVED*** @param {xrx.shape.Polygon} polygon The related polygon shape.
***REMOVED***
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



***REMOVED***
***REMOVED*** A class representing a creatable polygon shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
***REMOVED***
xrx.shape.PolygonCreate = function(drawing) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The parent drawing object.
  ***REMOVED*** @type {xrx.drawing.Drawing}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.drawing_ = drawing;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The first vertex created by the user, which at the same time
  ***REMOVED*** closes the polygon when touched.
  ***REMOVED*** @type {xrx.shape.VertexDragger}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.close_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A poly-line shape to give the user a preview of the created
  ***REMOVED***     polygon.
  ***REMOVED*** @type {xrx.shape.Polyline}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.polyline_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An array of vertexes the user has created so far.
  ***REMOVED*** @type {xrx.shape.VertexDragger}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.vertexes_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of vertexes the user has created so far.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.count_ = 0;
***REMOVED***



***REMOVED***
***REMOVED*** Handles click events for a creatable polygon shape.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED***
xrx.shape.PolygonCreate.prototype.handleClick = function(e) {
  var vertex;
  var polygon;
  var coords;
  var point = this.drawing_.getEventPoint(e);
  var shape = this.drawing_.getShapeSelected(point);

  if (this.count_ === 0) { // user creates the first point
    // insert a poly-line
    this.polyline_ = xrx.shape.Polyline.create(this.drawing_);
    this.polyline_.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(this.polyline_);

    // insert a vertex
    this.close_ = xrx.shape.VertexDragger.create(this.drawing_);
    this.close_.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(this.close_);
    this.vertexes_.push(this.close_);

    // redraw
    this.drawing_.draw();
    this.count_ += 1;

  } else if (shape === this.close_ && this.count_ === 1) { // user tries to create an invalid vertex
    // Do nothing if the user tries to close the path at the time
    // when there is only one point yet

  } else if (shape === this.close_) { // user closes the polygon
    // get the coordinates
    coords = new Array(this.vertexes_.length + 1);
    for (var i = 0; i < this.vertexes_.length; i++) {
      coords[i] = this.vertexes_[i].getCoordsCopy()[0];
    }
    coords[this.vertexes_.length] = this.vertexes_[0].getCoordsCopy()[0];

    // insert the polygon
    polygon = xrx.shape.Polygon.create(this.drawing_);
    polygon.setCoords(coords);
    this.drawing_.getLayerShape().addShapes(polygon);

    // remove the temporary shapes
    this.drawing_.getLayerShapeCreate().removeShapes();
    this.close_ = null;
    this.vertexes_ = [];

    // redraw
    this.drawing_.draw();
    this.count_ = 0;

  } else { // user creates another vertex
    // extend the poly-line
    this.polyline_.appendCoord(point);

    // insert another vertex
    vertex = xrx.shape.VertexDragger.create(this.drawing_);
    vertex.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(vertex);
    this.vertexes_.push(vertex);

    // redraw
    this.drawing_.draw();
    this.count_ += 1;

  } 
***REMOVED***



goog.exportProperty(xrx.shape, 'PolygonCreate', xrx.shape.PolygonCreate);
