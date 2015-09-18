/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent polygon shape.
 */

goog.provide('xrx.shape.Polygon');
goog.provide('xrx.shape.PolygonModify');
goog.provide('xrx.shape.PolygonCreate');



goog.require('goog.dom.DomHelper');
goog.require('goog.dom.classes');
goog.require('xrx.engine.Engines');
goog.require('xrx.geometry.Path');
goog.require('xrx.mvc');
goog.require('xrx.shape.Polyline');
goog.require('xrx.shape.Stylable');
goog.require('xrx.shape.VertexDragger');



/**
 * A class representing an engine-independent polygon shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.Polygon = function(canvas, engineElement) {

  goog.base(this, canvas, engineElement, new xrx.geometry.Path());
};
goog.inherits(xrx.shape.Polygon, xrx.shape.Stylable);



/**
 * Draws this polygon shape.
 */
xrx.shape.Polygon.prototype.draw = function() {
  this.engineElement_.draw(this.getCoords(), this.getFillColor(),
      this.getFillOpacity(), this.getStrokeColor(), this.getStrokeWidth());
};



/**
 * Creates a new polygon shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.Polygon.create = function(canvas) {
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
  return new xrx.shape.Polygon(canvas, engineElement);
};



/**
 * Creates a new instance of a modifiable polygon shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 */
xrx.shape.Polygon.prototype.createModify = function(drawing) {
  return xrx.shape.PolygonModify.create(this);
};



/**
 * A class representing a modifiable polygon shape.
 * @constructor
 */
xrx.shape.PolygonModify = function() {};



/**
 * Creates a new modifiable polygon shape.
 * @param {xrx.shape.Polygon} polygon The related polygon shape.
 */
xrx.shape.PolygonModify.create = function(polygon) {
  var coords = polygon.getCoords();
  var draggers = [];
  var dragger;

  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.VertexDragger.create(polygon.getCanvas());
    dragger.setCoords([coords[i]]);
    dragger.setPosition(i);
    draggers.push(dragger);
  }

  return draggers;
};



/**
 * A class representing a creatable polygon shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.shape.PolygonCreate = function(drawing) {

  /**
   * The parent drawing object.
   * @type {xrx.drawing.Drawing}
   * @private
   */
  this.drawing_ = drawing;

  /**
   * The first vertex created by the user, which at the same time
   * closes the polygon when touched.
   * @type {xrx.shape.VertexDragger}
   * @private
   */
  this.close_;

  /**
   * A poly-line shape to give the user a preview of the created
   *     polygon.
   * @type {xrx.shape.Polyline}
   * @private
   */
  this.polyline_;

  /**
   * An array of vertexes the user has created so far.
   * @type {xrx.shape.VertexDragger}
   * @private
   */
  this.vertexes_ = [];

  /**
   * Number of vertexes the user has created so far.
   * @type {number}
   * @private
   */
  this.count_ = 0;
};



/**
 * Returns the coordinates of the poly-line currently creating a
 * polygon.
 * @return Array<Array<number>> The coordinates.
 */
xrx.shape.PolygonCreate.prototype.getCoords = function() {
  return this.polyline_.getCoords();
};



/**
 * Handles click events for a creatable polygon shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
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

    if (this.handleValueChanged) this.handleValueChanged();
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
    if (this.drawing_.handleCreated) this.drawing_.handleCreated();

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

    if (this.handleValueChanged) this.handleValueChanged();
  } 
};
