/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent rectangle shape.
 */

goog.provide('xrx.shape.Rect');
goog.provide('xrx.shape.RectCreate');
goog.provide('xrx.shape.RectModify');



goog.require('goog.array');
goog.require('xrx.geometry.Path');
goog.require('xrx.shape.Creatable');
goog.require('xrx.shape.Stylable');
goog.require('xrx.shape.VertexDragger');



/**
 * A class representing an engine-independent rectangle shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Rect = function(canvas) {

  goog.base(this, canvas,
      canvas.getEngine().createRect(canvas.getEngineElement()),
      new xrx.geometry.Path(4));
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
  this.startDrawing_();
  this.engineElement_.draw(this.getCoords(), this.getFillColor(),
      this.getFillOpacity(), this.getStrokeColor(), this.getStrokeWidth());
  this.finishDrawing_();
};



/**
 * Creates a new rectangle shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.Rect.create = function(canvas) {
  return new xrx.shape.Rect(canvas);
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
 * Returns a modifiable rectangle shape. Create it lazily if not existent.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @return {xrx.shape.RectModify} The modifiable rectangle shape.
 */
xrx.shape.Rect.prototype.getModifiable = function(drawing) {
  if (!this.modifiable_) this.modifiable_ = xrx.shape.RectModify.create(this);
  return this.modifiable_;
};



/**
 * Returns a creatable rectangle shape. Create it lazily if not existent.
 * @return {xrx.shape.RectCreate} The creatable rectangle shape.
 */
xrx.shape.Rect.prototype.getCreatable = function() {
  if (!this.creatable_) this.creatable_ = xrx.shape.RectCreate.create(this);
  return this.creatable_;
};



/**
 * A class representing a modifiable rectangle shape.
 * @constructor
 */
xrx.shape.RectModify = function(rect, helper) {

  goog.base(this, rect, helper);
};
goog.inherits(xrx.shape.RectModify, xrx.shape.Modifiable);




xrx.shape.RectModify.prototype.setCoords = function(coords, position) {
  for(var i = 0, len = this.helper_.length; i < len; i++) {
    if (i !== position) this.helper_[i].setCoords([coords[i]]);
  }
  this.shape_.setCoords(coords);
};



xrx.shape.RectModify.prototype.setCoordAt = function(pos, coord) {
  var coords;
  this.shape_.setCoordAt(pos, coord);
  this.shape_.setAffineCoords(pos);
  coords = this.shape_.getCoords();
  this.helper_[0].setCoords([coords[0]]);
  this.helper_[1].setCoords([coords[1]]);
  this.helper_[2].setCoords([coords[2]]);
  this.helper_[3].setCoords([coords[3]]);
};



/**
 * Creates a new modifiable rectangle shape.
 * @param {xrx.shape.Polygon} polygon The related rectangle shape.
 */
xrx.shape.RectModify.create = function(rect) {
  var coords = rect.getCoords();
  var draggers = [];
  var dragger;
  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.VertexDragger.create(rect.getCanvas());
    dragger.setCoords([coords[i]]);
    dragger.setPosition(i);
    draggers.push(dragger);
  }
  return new xrx.shape.RectModify(rect, draggers);
};



/**
 * A class representing a creatable rectangle shape.
 * @param
 * @constructor
 */
xrx.shape.RectCreate = function(rect) {

  goog.base(this, rect, xrx.shape.Rect.create(rect.getCanvas()));

  /**
   * Number of vertexes the user has created so far.
   * @type {number}
   * @private
   */
  this.count_ = 0;
};
goog.inherits(xrx.shape.RectCreate, xrx.shape.Creatable);



/**
 * Returns the coordinates of the rectangle currently created.
 * @return Array<Array<number>> The coordinates.
 */
xrx.shape.RectCreate.prototype.getCoords = function() {
  return this.helper_.getCoords();
};



/**
 * Handles click events for a creatable rectangle shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.RectCreate.prototype.handleClick = function(e, point, shape) {
  var vertex;
  var shape;
  var coords;
  if (this.count_ === 1) { // The user creates the second vertex and
                           // in that the rectangle
    // insert a rectangle
    var rect = xrx.shape.Rect.create(this.target_.getCanvas());
    rect.setStylable(this.target_);
    rect.setCoords(this.helper_.getCoordsCopy());
    this.eventHandler_.eventShapeCreated(rect);
    // reset for next drawing
    this.count_ = 0;
  } else { // The user creates the first vertex
    // initialize helper coordinates
    coords = new Array(4);
    coords[0] = goog.array.clone(point);
    coords[1] = goog.array.clone(point);
    coords[2] = goog.array.clone(point);
    coords[3] = goog.array.clone(point);
    this.helper_.setCoords(coords);
    // insert a new vertex
    vertex = xrx.shape.VertexDragger.create(this.target_.getCanvas());
    vertex.setCoords([point]);
    this.count_ += 1;
    this.eventHandler_.eventShapeCreate([vertex, this.helper_]);
  }
};



xrx.shape.RectCreate.prototype.handleMove = function(e, point, shape) {
  if (this.count_ === 0) return;
  this.helper_.setCoordAt(2, point);
  this.helper_.setAffineCoords(2);
};



xrx.shape.RectCreate.create = function(rect) {
  return new xrx.shape.RectCreate(rect);
};
