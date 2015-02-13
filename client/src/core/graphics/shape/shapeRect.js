/**
 * @fileoverview Classes representing a modifiable and creatable
 *     rectangle shape.
 */

goog.provide('xrx.shape.Rect');
goog.provide('xrx.shape.RectCreate');
goog.provide('xrx.shape.RectModify');



goog.require('xrx.engine.Engines');
goog.require('xrx.shape.Polygon');
goog.require('xrx.shape.Shape');
goog.require('xrx.shape.VertexDragger');



/**
 * A class representing a rectangle shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.shape.Rect = function(drawing) {

  goog.base(this, drawing);
};
goog.inherits(xrx.shape.Rect, xrx.shape.Shape);



/**
 * The engine class used to render this shape.
 * @type {string}
 * @const
 */
xrx.shape.Rect.prototype.engineClass_ = 'Polygon';



/**
 * Creates a new rectangle shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 */
xrx.shape.Rect.create = function(drawing) {
  var rect = new xrx.shape.Rect(drawing);
  rect.setCoords([[0,0],[0,0],[0,0],[0,0]]);
  return rect;
};



/**
 * Function makes sure that the underlying polygon rendering class
 * stays a rectangle.
 * @param {number} position The nth vertex currently modified.
 */
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



/**
 * Creates a new instance of a modifiable rectangle shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 */
xrx.shape.Rect.prototype.createModify = function() {
  return xrx.shape.RectModify.create(this);
};



/**
 * A class representing a modifiable rectangle shape.
 * @constructor
 */
xrx.shape.RectModify = function() {};



/**
 * Creates a new modifiable rectangle shape.
 * @param {xrx.shape.Polygon} polygon The related rectangle shape.
 */
xrx.shape.RectModify.create = xrx.shape.PolygonModify.create;



/**
 * A class representing a creatable rectangle shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.shape.RectCreate = function(drawing) {

  /**
   * The parent drawing object.
   * @type {xrx.drawing.Drawing}
   * @private
   */
  this.drawing_ = drawing;

  this.rect_;

  /**
   * Number of vertexes the user has created so far.
   * @type {number}
   * @private
   */
  this.count_ = 0;
};



/**
 * Returns the coordinates of the rectangle currently created.
 * @return Array.<Array.<number>> The coordinates.
 */
xrx.shape.RectCreate.prototype.getCoords = function() {
  return this.rect_.getCoords();
};



/**
 * Handles click events for a creatable rectangle shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.RectCreate.prototype.handleClick = function(e) {
  var vertex;
  var shape;
  var coords;
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
    this.rect_.setCoords(coords);
    this.drawing_.getLayerShape().addShapes(this.rect_);

    // remove the temporary shapes
    this.drawing_.getLayerShapeCreate().removeShapes();

    // redraw
    this.drawing_.draw();
    this.count_ = 0;

    if (this.handleValueChanged) this.handleValueChanged();

    if (this.drawing_.handleCreated) this.drawing_.handleCreated();

  } else { // The user creates the first vertex
    // create a rectangle
    this.rect_ = xrx.shape.Rect.create(this.drawing_);
    coords = new Array(4);
    coords[0] = point;
    coords[1] = [0, point[1]];
    coords[2] = [0, 0];
    coords[3] = [point[0], 0];
    this.rect_.setCoords(coords);
    
    // insert a vertex
    vertex = xrx.shape.VertexDragger.create(this.drawing_);
    vertex.setCoords([point]);
    this.drawing_.getLayerShapeCreate().addShapes(vertex);

    // redraw
    this.drawing_.draw();
    this.count_ += 1;

    if (this.handleValueChanged) this.handleValueChanged();
  }
};



goog.exportProperty(xrx.shape, 'RectCreate', xrx.shape.RectCreate);
