***REMOVED***
***REMOVED*** @fileoverview Classes representing a modifiable and creatable
***REMOVED***     rectangle shape.
***REMOVED***

goog.provide('xrx.shape.Rect');
goog.provide('xrx.shape.RectCreate');
goog.provide('xrx.shape.RectModify');



goog.require('xrx.engine.Engines');
goog.require('xrx.shape.Polygon');
goog.require('xrx.shape.Shape');
goog.require('xrx.shape.VertexDragger');



***REMOVED***
***REMOVED*** A class representing a rectangle shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
***REMOVED***
xrx.shape.Rect = function(drawing) {

  goog.base(this, drawing);
***REMOVED***
goog.inherits(xrx.shape.Rect, xrx.shape.Shape);



***REMOVED***
***REMOVED*** The engine class used to render this shape.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED***
xrx.shape.Rect.prototype.engineClass_ = 'Polygon';



***REMOVED***
***REMOVED*** Creates a new rectangle shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
xrx.shape.Rect.create = function(drawing) {
  var rect = new xrx.shape.Rect(drawing);
  rect.setCoords([[0,0],[0,0],[0,0],[0,0]]);
  return rect;
***REMOVED***



***REMOVED***
***REMOVED*** Function makes sure that the underlying polygon rendering class
***REMOVED*** stays a rectangle.
***REMOVED*** @param {number} position The nth vertex currently modified.
***REMOVED***
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
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new instance of a modifiable rectangle shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
xrx.shape.Rect.prototype.createModify = function() {
  return xrx.shape.RectModify.create(this);
***REMOVED***



***REMOVED***
***REMOVED*** A class representing a modifiable rectangle shape.
***REMOVED***
***REMOVED***
xrx.shape.RectModify = function() {***REMOVED***



***REMOVED***
***REMOVED*** Creates a new modifiable rectangle shape.
***REMOVED*** @param {xrx.shape.Polygon} polygon The related rectangle shape.
***REMOVED***
xrx.shape.RectModify.create = xrx.shape.PolygonModify.create;



***REMOVED***
***REMOVED*** A class representing a creatable rectangle shape.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
***REMOVED***
xrx.shape.RectCreate = function(drawing) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The parent drawing object.
  ***REMOVED*** @type {xrx.drawing.Drawing}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.drawing_ = drawing;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of vertexes the user has created so far.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.count_ = 0;
***REMOVED***



***REMOVED***
***REMOVED*** Handles click events for a creatable rectangle shape.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED***
xrx.shape.RectCreate.prototype.handleClick = function(e) {
  var vertex;
  var shape;
  var coords;
  var rect;
  var point = this.drawing_.getEventPoint(e);

  if (this.count_ === 1) { // The user creates the second vertex and
                           // in that the rectangle
    // insert a rectangle
    shape = this.drawing_.getLayerShapeCreate().getShapes()[0];
    coords = new Array(4);
    coords[0] = shape.getCoordsCopy()[0];
    coords[1] = [point[0], coords[0][1]];
    coords[2] = [point[0], point[1]];
    coords[3] = [coords[0][0], point[1]];
    rect = xrx.shape.Rect.create(this.drawing_);
    rect.setCoords(coords);
    this.drawing_.getLayerShape().addShapes(rect);
    if (this.drawing_.handleCreated) this.drawing_.handleCreated();

    // remove the temporary shapes
    this.drawing_.getLayerShapeCreate().removeShapes();

    // redraw
    this.drawing_.draw();
    this.count_ = 0;

  } else { // The user creates the first vertex
    // insert a vertex
    vertex = xrx.shape.VertexDragger.create(this.drawing_);
    vertex.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(vertex);

    // redraw
    this.drawing_.draw();
    this.count_ += 1;
  }
***REMOVED***



goog.exportProperty(xrx.shape, 'RectCreate', xrx.shape.RectCreate);
