/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent polygon shape.
 */

goog.provide('xrx.shape.Polygon');
goog.provide('xrx.shape.PolygonModifiable');
goog.provide('xrx.shape.PolygonCreatable');



goog.require('goog.array');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.classes');
goog.require('goog.object');
goog.require('xrx.geometry.Path');
goog.require('xrx.mvc');
goog.require('xrx.shape.Creatable');
goog.require('xrx.shape.Modifiable');
goog.require('xrx.shape.Polyline');
goog.require('xrx.shape.Stylable');
goog.require('xrx.shape.VertexDragger');



/**
 * A class representing an engine-independent polygon shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Polygon = function(canvas, engineElement) {

  goog.base(this, canvas,
      canvas.getEngine().createPolygon(canvas.getEngineElement()),
      new xrx.geometry.Path());
};
goog.inherits(xrx.shape.Polygon, xrx.shape.Stylable);



/**
 * Draws this polygon shape.
 */
xrx.shape.Polygon.prototype.draw = function() {
  this.startDrawing_();
  this.engineElement_.draw(this.getCoords(), this.getFillColor(),
      this.getFillOpacity(), this.getStrokeColor(), this.getStrokeWidth());
  this.finishDrawing_();
};



/**
 * Creates a new polygon shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.Polygon.create = function(canvas) {
  return new xrx.shape.Polygon(canvas);
};



/**
 * Returns a modifiable polygon shape. Create it lazily if not existent.
 * @return {xrx.shape.PolygonModifiable} The modifiable polygon shape.
 */
xrx.shape.Polygon.prototype.getModifiable = function() {
  if (!this.modifiable_) this.modifiable_ = xrx.shape.PolygonModifiable.create(this);
  return this.modifiable_;
};



/**
 * Returns a creatable polygon shape. Create it lazily if not existent.
 * @return {xrx.shape.PolygonCreatable} The creatable polygon shape.
 */
xrx.shape.Polygon.prototype.getCreatable = function() {
  if (!this.creatable_) this.creatable_ = xrx.shape.PolygonCreatable.create(this);
  return this.creatable_;
};



/**
 * A class representing a modifiable polygon shape.
 * @constructor
 */
xrx.shape.PolygonModifiable = function(polygon, helper) {

  goog.base(this, polygon, helper);
};
goog.inherits(xrx.shape.PolygonModifiable, xrx.shape.Modifiable);




xrx.shape.PolygonModifiable.prototype.setCoords = function(coords, position) {
  for(var i = 0, len = this.dragger_.length; i < len; i++) {
    if (i !== position) {
      this.dragger_[i].setCoordX(coords[i][0]);
      this.dragger_[i].setCoordY(coords[i][1]);
    }
  }
  this.shape_.setCoords(coords);
};



xrx.shape.PolygonModifiable.prototype.setCoordAt = function(pos, coord) {
  this.dragger_[pos].setCoordX(coord[0]);
  this.dragger_[pos].setCoordY(coord[1]);
  this.shape_.setCoordXAt(pos, coord[0]);
  this.shape_.setCoordYAt(pos, coord[1]);
};



/**
 * Creates a new modifiable polygon shape.
 * @param {xrx.shape.Polygon} polygon The related polygon shape.
 */
xrx.shape.PolygonModifiable.create = function(polygon) {
  var coords = polygon.getCoords();
  var draggers = [];
  var dragger;
  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.VertexDragger.create(polygon.getCanvas());
    dragger.setCoords([coords[i]]);
    dragger.setPosition(i);
    draggers.push(dragger);
  }
  return new xrx.shape.PolygonModifiable(polygon, draggers);
};



/**
 * A class representing a creatable polygon shape.
 * @param {xrx.shape.Polygon} polygon A styled polygon to be drawn.
 * @constructor
 */
xrx.shape.PolygonCreatable = function(polygon) {

  goog.base(this, polygon, xrx.shape.Polyline.create(polygon.getCanvas()));

  /**
   * The first vertex created by the user, which at the same time
   * closes the polygon when clicked.
   * @type {xrx.shape.VertexDragger}
   * @private
   */
  this.close_;

  /**
   * Number of vertexes the user has created so far.
   * @type {number}
   * @private
   */
  this.count_ = 0;
};
goog.inherits(xrx.shape.PolygonCreatable, xrx.shape.Creatable);



/**
 * Returns the coordinates of the poly-line currently creating a
 * polygon.
 * @return Array<Array<number>> The coordinates.
 */
xrx.shape.PolygonCreatable.prototype.getCoords = function() {
  return this.helper_.getCoords();
};



/**
 * Handles click events for a creatable polygon shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.PolygonCreatable.prototype.handleClick = function(e, point, shape) {
  if (this.count_ === 0) { // user creates the first point
    // update the poly-line preview
    this.helper_.setCoords([point, goog.array.clone(point)]);
    // create the closing dragger
    this.close_ = xrx.shape.VertexDragger.create(this.target_.getCanvas());
    this.close_.setCoords([point]);
    this.count_ += 1;
    this.eventHandler_.eventShapeCreate([this.helper_, this.close_]);
  } else if (this.close_ && shape === this.close_ && this.count_ === 1) {
    // Do nothing if the user tries to close the path at the time
    // when there is only one point yet
  } else if (this.close_ && shape === this.close_) { // user closes the polygon
    // create a polygon
    var polygon = xrx.shape.Polygon.create(this.target_.getCanvas());
    polygon.setStylable(this.target_);
    polygon.setCoords(this.helper_.getCoordsCopy());
    this.eventHandler_.eventShapeCreated(polygon);
    // reset for next drawing
    this.close_ = null;
    this.count_ = 0;
  } else { // user creates another point
    // extend the poly-line preview
    this.helper_.setLastCoord(point);
    this.helper_.appendCoord(point);
    this.count_ += 1;
  } 
};



xrx.shape.PolygonCreatable.prototype.handleMove = function(e, point, shape) {
  if (this.count_ === 0) {
    return;
  } else {
    this.helper_.setLastCoord(point);
  }
  if (shape === this.close_) {
    this.close_.setStrokeColor('red');
    this.close_.setStrokeWidth(3);
  } else {
    this.close_.setStrokeColor('black');
    this.close_.setStrokeWidth(1);
  }
};



xrx.shape.PolygonCreatable.create = function(polygon) {
  return new xrx.shape.PolygonCreatable(polygon);
};
