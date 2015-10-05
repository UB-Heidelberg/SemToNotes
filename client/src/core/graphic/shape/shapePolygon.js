/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent polygon shape.
 */

goog.provide('xrx.shape.Polygon');
goog.provide('xrx.shape.PolygonCreatable');
goog.provide('xrx.shape.PolygonHoverable');
goog.provide('xrx.shape.PolygonModifiable');
goog.provide('xrx.shape.PolygonSelectable');



goog.require('goog.array');
goog.require('xrx.geometry.Path');
goog.require('xrx.shape.Creatable');
goog.require('xrx.shape.Dragger');
goog.require('xrx.shape.Hoverable');
goog.require('xrx.shape.Modifiable');
goog.require('xrx.shape.PathLike');
goog.require('xrx.shape.Polyline');
goog.require('xrx.shape.Selectable');



/**
 * A class representing an engine-independent polygon shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @constructor
 */
xrx.shape.Polygon = function(drawing, engineElement) {

  goog.base(this, drawing, engineElement,
      new xrx.geometry.Path());
};
goog.inherits(xrx.shape.Polygon, xrx.shape.PathLike);



/**
 * Draws this polygon shape.
 */
xrx.shape.Polygon.prototype.draw = function() {
  this.startDrawing_();
  this.engineElement_.draw(this.getCoords(), this.getFillColor(),
      this.getFillOpacity(), this.getStrokeColor(), this.getRenderingStrokeWidth());
  this.finishDrawing_();
};



xrx.shape.Polygon.prototype.getHoverable = function() {
  if (!this.hoverable_) this.hoverable_ = xrx.shape.PolygonHoverable.create(this);
  return this.hoverable_;
};



xrx.shape.Polygon.prototype.setHoverable = function(hoverable) {
  if (!hoverable instanceof xrx.shape.PolygonHoverable)
      throw Error('Instance of xrx.shape.PolygonHoverable expected.');
  this.hoverable_ = hoverable;
};



xrx.shape.Polygon.prototype.getSelectable = function() {
  if (!this.selectable_) this.selectable_ = xrx.shape.PolygonSelectable.create(this);
  return this.selectable_;
};



xrx.shape.Polygon.prototype.setSelectable = function(selectable) {
  if (!selectable instanceof xrx.shape.PolygonSelectable)
      throw Error('Instance of xrx.shape.PolygonSelectable expected.');
  this.selectable_ = selectable;
};



/**
 * Returns a modifiable polygon shape. Create it lazily if not existent.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @return {xrx.shape.LineModifiable} The modifiable polygon shape.
 */
xrx.shape.Polygon.prototype.getModifiable = function(drawing) {
  if (!this.modifiable_) this.modifiable_ = xrx.shape.PolygonModifiable.create(this);
  return this.modifiable_;
};



xrx.shape.Polygon.prototype.setModifiable = function(modifiable) {
  if (!modifiable instanceof xrx.shape.PolygonModifiable)
      throw Error('Instance of xrx.shape.PolygonModifiable expected.');
  this.modifiable_ = modifiable;
};



/**
 * Returns a creatable polygon shape. Create it lazily if not existent.
 * @return {xrx.shape.PolygonCreatable} The creatable polygon shape.
 */
xrx.shape.Polygon.prototype.getCreatable = function() {
  if (!this.creatable_) this.creatable_ = xrx.shape.PolygonCreatable.create(this);
  return this.creatable_;
};



xrx.shape.Polygon.prototype.setCreatable = function(creatable) {
  if (!creatable instanceof xrx.shape.PolygonCreatable)
      throw Error('Instance of xrx.shape.PolygonCreatable expected.');
  this.creatable_ = creatable;
};



/**
 * Creates a new polygon shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 */
xrx.shape.Polygon.create = function(drawing) {
  var shapeCanvas = drawing.getCanvas();
  var engine = shapeCanvas.getEngine();
  var engineCanvas = shapeCanvas.getEngineElement();
  var engineElement = engine.createPolygon(engineCanvas);
  return new xrx.shape.Polygon(drawing, engineElement);
};



/**
 * @constructor
 */
xrx.shape.PolygonHoverable = function(polygon) {

  goog.base(this, polygon);
};
goog.inherits(xrx.shape.PolygonHoverable, xrx.shape.Hoverable);



xrx.shape.PolygonHoverable.create = function(polygon) {
  return new xrx.shape.PolygonHoverable(polygon);
};




/**
 * @constructor
 */
xrx.shape.PolygonSelectable = function(polygon) {

  goog.base(this, polygon);
};
goog.inherits(xrx.shape.PolygonSelectable, xrx.shape.Selectable);



xrx.shape.PolygonSelectable.create = function(polygon) {
  return new xrx.shape.PolygonSelectable(polygon);
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



xrx.shape.PolygonModifiable.prototype.move = function(distX, distY) {
  var coords = this.shape_.getCoordsCopy();
  for (var i = 0, len = coords.length; i < len; i++) {
    coords[i][0] += distX;
    coords[i][1] += distY;
  }
  this.setCoords(coords);
};



/**
 * Creates a new modifiable polygon shape.
 * @param {xrx.shape.Polygon} polygon The related polygon shape.
 */
xrx.shape.PolygonModifiable.create = function(polygon) {
  var coords = polygon.getCoords();
  var modifiable = new xrx.shape.PolygonModifiable(polygon);
  var draggers = [];
  var dragger;
  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.Dragger.create(modifiable, i);
    dragger.setCoords([coords[i]]);
    draggers.push(dragger);
  }
  modifiable.setDragger(draggers);
  return modifiable;
};



/**
 * A class representing a creatable polygon shape.
 * @param {xrx.shape.Polygon} polygon A styled polygon to be drawn.
 * @constructor
 */
xrx.shape.PolygonCreatable = function(polygon) {

  goog.base(this, polygon, xrx.shape.Polyline.create(polygon.getDrawing()));

  /**
   * The first vertex created by the user, which at the same time
   * closes the polygon when clicked.
   * @type {xrx.shape.Dragger}
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
  return this.preview_.getCoords();
};



/**
 * Handles click events for a creatable polygon shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.PolygonCreatable.prototype.handleDown = function(e, cursor) {
  var shape = cursor.getShape();
  var point = cursor.getPointTransformed();
  if (this.count_ === 0) { // user creates the first point
    // update the poly-line preview
    this.preview_.setCoords([point, goog.array.clone(point)]);
    // create the closing dragger
    this.close_ = xrx.shape.Dragger.create(this.target_.getModifiable(), 0);
    this.close_.setCoords([point]);
    this.count_ += 1;
    this.target_.getDrawing().eventShapeCreate([this.preview_, this.close_]);
  } else if (this.close_ && shape === this.close_ && this.count_ === 1) {
    // Do nothing if the user tries to close the path at the time
    // when there is only one point yet
  } else if (this.close_ && shape === this.close_) { // user closes the polygon
    // create a polygon
    var polygon = xrx.shape.Polygon.create(this.target_.getDrawing());
    polygon.setStyle(this.target_);
    polygon.setCoords(this.preview_.getCoordsCopy().splice(0, this.count_));
    this.target_.getDrawing().eventShapeCreated(polygon);
    // reset for next drawing
    this.close_ = null;
    this.count_ = 0;
  } else { // user creates another point
    // extend the poly-line preview
    this.preview_.setLastCoord(point);
    this.preview_.appendCoord(point);
    this.count_ += 1;
  } 
};



xrx.shape.PolygonCreatable.prototype.handleMove = function(e, cursor) {
  var shape = cursor.getShape();
  var point = cursor.getPointTransformed();
  if (this.count_ === 0) {
    return;
  } else {
    this.preview_.setLastCoord(point);
  }
  if (shape === this.close_) {
    this.close_.setStrokeColor('red');
    this.close_.setStrokeWidth(3);
  } else {
    this.close_.setStrokeColor('black');
    this.close_.setStrokeWidth(1);
  }
};



xrx.shape.PolygonCreatable.prototype.handleUp = function() {
};



xrx.shape.PolygonCreatable.create = function(polygon) {
  return new xrx.shape.PolygonCreatable(polygon);
};
