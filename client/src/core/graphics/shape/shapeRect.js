/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent rectangle shape.
 */

goog.provide('xrx.shape.Rect');
goog.provide('xrx.shape.RectCreate');
goog.provide('xrx.shape.RectModify');



goog.require('xrx.engine.Engines');
goog.require('xrx.geometry.Path');
goog.require('xrx.mvc');
goog.require('xrx.shape.Stylable');
goog.require('xrx.shape.VertexDragger');



/**
 * A class representing an engine-independent rectangle shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.Rect = function(canvas, engineElement) {

  goog.base(this, canvas, engineElement, new xrx.geometry.Path(4));
};
goog.inherits(xrx.shape.Rect, xrx.shape.Stylable);



/**
 * Sets the X coordinate of this rectangle.
 * @param {number} x The coordinate.
 */
xrx.shape.Rect.prototype.setX = function(x) {
  this.geometry_.coords[0][0] = x;
  this.geometry_.coords[3][0] = x;
};



/**
 * Returns the X coordinate of this rectangle.
 * @return {number} The coordinate.
 */
xrx.shape.Rect.prototype.getX = function() {
  return this.geometry_.coords[0][0];
};



/**
 * Sets the Y coordinate of this rectangle.
 * @param {number} y The coordinate.
 */
xrx.shape.Rect.prototype.setY = function(y) {
  this.geometry_.coords[0][1] = y;
  this.geometry_.coords[1][1] = y;
};



/**
 * Returns the Y coordinate of this rectangle.
 * @return {number} The coordinate.
 */
xrx.shape.Rect.prototype.getY = function() {
  return this.geometry_.coords[0][1];
};



/**
 * Sets the width of this rectangle.
 * @param {number} width The width.
 */
xrx.shape.Rect.prototype.setWidth = function(width) {
  var x = this.geometry_.coords[0][0];
  this.geometry_.coords[1][0] = x + width;
  this.geometry_.coords[2][0] = x + width;
};



/**
 * Returns the width of this rectangle.
 * @return {number} The width.
 */
xrx.shape.Rect.prototype.getWidth = function() {
  var coords = this.geometry_.coords;
  return coords[1][0] - coords[0][0];
};



/**
 * Sets the height of this rectangle.
 * @param {height} height The height.
 */
xrx.shape.Rect.prototype.setHeight = function(height) {
  var y = this.geometry_.coords[0][1];
  this.geometry_.coords[2][1] = y + height;
  this.geometry_.coords[3][1] = y + height;
};



/**
 * Returns the height of this rectangle.
 * @return {number} The height.
 */
xrx.shape.Rect.prototype.getHeight = function() {
  var coords = this.geometry_.coords;
  return coords[3][1] - coords[0][1];
};



/**
 * Draws this rectangle.
 */
xrx.shape.Rect.prototype.draw = function() {
  this.engineElement_.draw(this.getCoords(), this.getFillColor(),
      this.getFillOpacity(), this.getStrokeColor(), this.getStrokeWidth());
};



/**
 * Creates a new rectangle shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.Rect.create = function(canvas) {
  var rect;
  var engineElement;
  var engine = canvas.getEngine();
  var canvasElement = canvas.getEngineElement();
  if (engine.typeOf(xrx.engine.CANVAS)) {
    engineElement = xrx.canvas.Polygon.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.SVG)) {
    engineElement = xrx.svg.Polygon.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.VML)) {
    engineElement = xrx.vml.Polygon.create(canvasElement);
  } else {
    throw Error('Unknown engine.');
  }
  rect = new xrx.shape.Rect(canvas, engineElement);
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
 * @return Array<Array<number>> The coordinates.
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
