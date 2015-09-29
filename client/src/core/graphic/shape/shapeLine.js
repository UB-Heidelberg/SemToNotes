/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent line shape.
 */

goog.provide('xrx.shape.Line');
goog.provide('xrx.shape.LineCreatable');
goog.provide('xrx.shape.LineModifiable');



goog.require('xrx.geometry.Line');
goog.require('xrx.shape.Geometry');
goog.require('xrx.shape.Modifiable');



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
      this.geometry_.y2, this.getStrokeColor(), this.getStrokeWidth());
  this.finishDrawing_();
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
 * Returns a modifiable line shape. Create it lazily if not existent.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @return {xrx.shape.LineModifiable} The modifiable line shape.
 */
xrx.shape.Line.prototype.getModifiable = function(drawing) {
  if (!this.modifiable_) this.modifiable_ = xrx.shape.LineModifiable.create(this);
  return this.modifiable_;
};



/**
 * Returns a creatable line shape. Create it lazily if not existent.
 * @return {xrx.shape.EllipseCreatable} The creatable line shape.
 */
xrx.shape.Line.prototype.getCreatable = function() {
  if (!this.creatable_) this.creatable_ = xrx.shape.LineCreatable.create(this);
  return this.creatable_;
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



/**
 * @constructor
 */
xrx.shape.LineModifiable.create = function(line) {
  var dragger1 = xrx.shape.Dragger.create(line.getCanvas());
  dragger1.setCoords([[line.getX1(), line.getY1()]]);
  dragger1.setPosition(0);
  var dragger2 = xrx.shape.Dragger.create(line.getCanvas());
  dragger2.setCoords([[line.getX2(), line.getY2()]]);
  dragger2.setPosition(1);
  return new xrx.shape.LineModifiable(line, [dragger1, dragger2]);
};



/**
 * A class representing a creatable line shape.
 * @param
 * @constructor
 */
xrx.shape.LineCreatable = function(line) {

  goog.base(this, line, xrx.shape.Line.create(line.getCanvas()));

  /**
   * Number of vertexes the user has created so far.
   * @type {number}
   * @private
   */
  this.count_ = 0;
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
 * Handles click events for a creatable ellipse shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.LineCreatable.prototype.handleClick = function(e, point, shape) {
  if (this.count_ === 1) { // The user touches the second time
                           // in that creates the line
    // insert a line
    var line = xrx.shape.Line.create(this.target_.getCanvas());
    line.setStylable(this.target_);
    line.setX1(this.helper_.getX1());
    line.setY1(this.helper_.getY1());
    line.setX2(point[0]);
    line.setY2(point[1]);
    this.eventHandler_.eventShapeCreated(line);
    // reset for next drawing
    this.count_ = 0;
  } else { // The user touches the first time
    // initialize helper coordinates
    this.helper_.setX1(point[0]);
    this.helper_.setY1(point[1]);
    this.count_ += 1;
    this.eventHandler_.eventShapeCreate([this.helper_]);
  }
};



xrx.shape.LineCreatable.prototype.handleMove = function(e, point, shape) {
  if (this.count_ === 0) return;
  this.helper_.setX2(point[0]);
  this.helper_.setY2(point[1]);
};



xrx.shape.LineCreatable.create = function(ellipse) {
  return new xrx.shape.LineCreatable(ellipse);
};
