/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent line shape.
 */

goog.provide('xrx.shape.Line');
goog.provide('xrx.shape.LineCreatable');
goog.provide('xrx.shape.LineHoverable');
goog.provide('xrx.shape.LineModifiable');
goog.provide('xrx.shape.LineSelectable');



goog.require('xrx.geometry.Line');
goog.require('xrx.shape.Creatable');
goog.require('xrx.shape.Geometry');
goog.require('xrx.shape.Hoverable');
goog.require('xrx.shape.Modifiable');
goog.require('xrx.shape.Selectable');



/**
 * Classes representing an engine-independent line shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @constructor
 */
xrx.shape.Line = function(drawing, engineElement) {

  goog.base(this, drawing, engineElement,
      new xrx.geometry.Line());
};
goog.inherits(xrx.shape.Line, xrx.shape.Geometry);



/**
 * Returns the x coordinate of the line's start point.
 * @return {number} The x coordinate of the line's start point.
 */
xrx.shape.Line.prototype.getX1 = function() {
  return this.geometry_.x1;
};



/**
 * Sets the x coordinate of the line's start point.
 * @param {number} x1 The x coordinate.
 */
xrx.shape.Line.prototype.setX1 = function(x1) {
  this.geometry_.x1 = x1;
};



/**
 * Returns the y coordinate of the line's start point.
 * @return {number} The y coordinate of the line's start point.
 */
xrx.shape.Line.prototype.getY1 = function() {
  return this.geometry_.y1;
};



/**
 * Sets the y coordinate of the line's start point.
 * @param {number} y1 The y coordinate.
 */
xrx.shape.Line.prototype.setY1 = function(y1) {
  this.geometry_.y1 = y1;
};



/**
 * Returns the x coordinate of the line's end point.
 * @return {number} The x coordinate of the line's end point.
 */
xrx.shape.Line.prototype.getX2 = function() {
  return this.geometry_.x2;
};



/**
 * Sets the x coordinate of the line's end point.
 * @param {number} x2 The x coordinate.
 */
xrx.shape.Line.prototype.setX2 = function(x2) {
  this.geometry_.x2 = x2;
};



/**
 * Returns the x coordinate of the line's end point.
 * @return {number} The x coordinate of the line's end point.
 */
xrx.shape.Line.prototype.getY2 = function() {
  return this.geometry_.y2;
};



/**
 * Sets the y coordinate of the line's end point.
 * @param {number} y2 The y coordinate.
 */
xrx.shape.Line.prototype.setY2 = function(y2) {
  this.geometry_.y2 = y2;
};



/**
 * Returns the coordinates of this line.
 * @return {Array<Array<<number>>} The coordinates.
 */
xrx.shape.Line.prototype.getCoords = function() {
  return [[this.geometry_.x1, this.geometry_.y1], [this.geometry_.x2,
      this.geometry_.y2]];
};



/**
 * Sets the coordinates of this line.
 * @param {Array<Array<<number>>} coords The coordinates.
 */
xrx.shape.Line.prototype.setCoords = function(coords) {
  this.geometry_.x1 = coords[0][0];
  this.geometry_.y1 = coords[0][1];
  this.geometry_.x2 = coords[1][0];
  this.geometry_.y2 = coords[1][1];
};



/**
 * Draws this line shape.
 */
xrx.shape.Line.prototype.draw = function() {
  this.startDrawing_();
  this.engineElement_.draw(this.geometry_.x1, this.geometry_.y1, this.geometry_.x2,
      this.geometry_.y2, this.getStrokeColor(), this.getRenderingStrokeWidth());
  this.finishDrawing_();
};



xrx.shape.Line.prototype.getHoverable = function() {
  if (!this.hoverable_) this.hoverable_ = xrx.shape.LineHoverable.create(this);
  return this.hoverable_;
};



xrx.shape.Line.prototype.setHoverable = function(hoverable) {
  if (!hoverable instanceof xrx.shape.LineHoverable)
      throw Error('Instance of xrx.shape.LineHoverable expected.');
  this.hoverable_ = hoverable;
};



xrx.shape.Line.prototype.getSelectable = function() {
  if (!this.selectable_) this.selectable_ = xrx.shape.LineSelectable.create(this);
  return this.selectable_;
};



xrx.shape.Line.prototype.setSelectable = function(selectable) {
  if (!selectable instanceof xrx.shape.LineSelectable)
      throw Error('Instance of xrx.shape.LineSelectable expected.');
  this.selectable_ = selectable;
};



/**
 * Returns a modifiable line shape. Create it lazily if not existent.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @return {xrx.shape.LineModifiable} The modifiable line shape.
 */
xrx.shape.Line.prototype.getModifiable = function(drawing) {
  if (!this.modifiable_) this.modifiable_ = xrx.shape.LineModifiable.create(this);
  return this.modifiable_;
};



xrx.shape.Line.prototype.setModifiable = function(modifiable) {
  if (!modifiable instanceof xrx.shape.LineModifiable)
      throw Error('Instance of xrx.shape.LineModifiable expected.');
  this.modifiable_ = modifiable;
};



/**
 * Returns a creatable line shape. Create it lazily if not existent.
 * @return {xrx.shape.EllipseCreatable} The creatable line shape.
 */
xrx.shape.Line.prototype.getCreatable = function() {
  if (!this.creatable_) this.creatable_ = xrx.shape.LineCreatable.create(this);
  return this.creatable_;
};



xrx.shape.Line.prototype.setCreatable = function(creatable) {
  if (!creatable instanceof xrx.shape.LineCreatable)
      throw Error('Instance of xrx.shape.LineCreatable expected.');
  this.creatable_ = creatable;
};



/**
 * Creates a new line shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 */
xrx.shape.Line.create = function(drawing) {
  var shapeCanvas = drawing.getCanvas();
  var engine = shapeCanvas.getEngine();
  var engineCanvas = shapeCanvas.getEngineElement();
  var engineElement = engine.createLine(engineCanvas);
  return new xrx.shape.Line(drawing, engineElement);
};



/**
 * @constructor
 */
xrx.shape.LineHoverable = function(line) {

  goog.base(this, line);
};
goog.inherits(xrx.shape.LineHoverable, xrx.shape.Hoverable);



xrx.shape.LineHoverable.create = function(line) {
  return new xrx.shape.LineHoverable(line);
};




/**
 * @constructor
 */
xrx.shape.LineSelectable = function(line) {

  goog.base(this, line);
};
goog.inherits(xrx.shape.LineSelectable, xrx.shape.Selectable);



xrx.shape.LineSelectable.create = function(line) {
  return new xrx.shape.LineSelectable(line);
};



/**
 * @constructor
 */
xrx.shape.LineModifiable = function(line, dragger) {

  goog.base(this, line, dragger);
};
goog.inherits(xrx.shape.LineModifiable, xrx.shape.Modifiable);



xrx.shape.LineModifiable.prototype.setCoords = function(coords) {
  this.shape_.setCoords(coords);
  this.dragger_[0].setCoordX(coords[0][0]);
  this.dragger_[0].setCoordY(coords[0][1]);
  this.dragger_[1].setCoordX(coords[1][0]);
  this.dragger_[1].setCoordY(coords[1][1]);
};



xrx.shape.LineModifiable.prototype.setCoordAt = function(pos, coord) {
  if (pos === 0) {
    this.dragger_[0].setCoordX(coord[0]);
    this.dragger_[0].setCoordY(coord[1]);
    this.shape_.setX1(coord[0]);
    this.shape_.setY1(coord[1]);
  } else {
    this.dragger_[1].setCoordX(coord[0]);
    this.dragger_[1].setCoordY(coord[1]);
    this.shape_.setX2(coord[0]);
    this.shape_.setY2(coord[1]);
  }
};



xrx.shape.LineModifiable.prototype.move = function(distX, distY) {
  var coords = this.shape_.getCoordsCopy();
  coords[0][0] += distX;
  coords[0][1] += distY;
  coords[1][0] += distX;
  coords[1][1] += distY;
  this.setCoords(coords);
};



/**
 * @constructor
 */
xrx.shape.LineModifiable.create = function(line) {
  var modifiable = new xrx.shape.LineModifiable(line)
  var dragger1 = xrx.shape.Dragger.create(modifiable, 0);
  dragger1.setCoords([[line.getX1(), line.getY1()]]);
  var dragger2 = xrx.shape.Dragger.create(modifiable, 1);
  dragger2.setCoords([[line.getX2(), line.getY2()]]);
  modifiable.setDragger([dragger1, dragger2]);
  return modifiable;
};



/**
 * A class representing a creatable line shape.
 * @param
 * @constructor
 */
xrx.shape.LineCreatable = function(line) {

  goog.base(this, line, xrx.shape.Line.create(line.getDrawing()));
};
goog.inherits(xrx.shape.LineCreatable, xrx.shape.Creatable);



/**
 * Returns the coordinates of the line currently created.
 * @return Array<Array<number>> The coordinates.
 */
xrx.shape.LineCreatable.prototype.getCoords = function() {
  return this.helper_.getCoords();
};



/**
 * Handles down events for a creatable line shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.LineCreatable.prototype.handleDown = function(e, cursor) {
  var point = cursor.getPointTransformed();
  this.preview_.setX1(point[0]);
  this.preview_.setY1(point[1]);
  this.target_.getDrawing().eventShapeCreate([this.preview_]);
};



xrx.shape.LineCreatable.prototype.handleMove = function(e, cursor) {
  var point = cursor.getPointTransformed();
  this.preview_.setX2(point[0]);
  this.preview_.setY2(point[1]);
};



xrx.shape.LineCreatable.prototype.handleUp = function(e, cursor) {
  var point = cursor.getPointTransformed();
  var line = xrx.shape.Line.create(this.target_.getDrawing());
  line.setStyle(this.target_);
  line.setX1(this.preview_.getX1());
  line.setY1(this.preview_.getY1());
  line.setX2(point[0]);
  line.setY2(point[1]);
  this.target_.getDrawing().eventShapeCreated(line);
};



xrx.shape.LineCreatable.create = function(ellipse) {
  return new xrx.shape.LineCreatable(ellipse);
};
