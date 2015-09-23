/**
 * @fileoverview A class representing an engine-independent
 * ellipse graphic.
 */

goog.provide('xrx.shape.Ellipse');
goog.provide('xrx.shape.EllipseModifiable');
goog.provide('xrx.shape.EllipseCreatable');



goog.require('xrx.geometry.Ellipse');
goog.require('xrx.shape.Modifiable');
goog.require('xrx.shape.Stylable');



/**
 * A class representing an engine-independent ellipse graphic.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Ellipse = function(canvas) {

  goog.base(this, canvas,
      canvas.getEngine().createEllipse(canvas.getEngineElement()),
      new xrx.geometry.Ellipse());
};
goog.inherits(xrx.shape.Ellipse, xrx.shape.Stylable);



/**
 * Returns the center point of this ellipse.
 * @return {Array<number>}
 */
xrx.shape.Ellipse.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
};



/**
 * Sets the center point of this ellipse.
 * @param {number} cx The X coordinate of the center point.
 * @param {number} cy The Y coordinate of the center point.
 */
xrx.shape.Ellipse.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
};



/**
 * Returns the major-radius of this ellipse.
 * @return {number} The radius.
 */
xrx.shape.Ellipse.prototype.getRadiusX = function() {
  return this.geometry_.rx;
};



/**
 * Sets the major-radius of this ellipse.
 * @param {number} r The radius.
 */
xrx.shape.Ellipse.prototype.setRadiusX = function(rx) {
  this.geometry_.rx = rx;
};



/**
 * Returns the minor-radius of this ellipse.
 * @return {number} The radius.
 */
xrx.shape.Ellipse.prototype.getRadiusY = function() {
  return this.geometry_.ry;
};



/**
 * Sets the minor-radius of this ellipse.
 * @param {number} ry The radius.
 */
xrx.shape.Ellipse.prototype.setRadiusY = function(ry) {
  this.geometry_.ry = ry;
};



/**
 * Returns the coordinates of this ellipse. We assume the center point.
 * @return {Array<Array<<number>>} The coordinates.
 */
xrx.shape.Ellipse.prototype.getCoords = function() {
  return [this.getCenter()];
};



/**
 * Sets the coordinates of this ellipse. We assume the center point.
 * @param {Array<Array<<number>>} coords The coordinates.
 */
xrx.shape.Ellipse.prototype.setCoords = function(coords) {
  this.setCenter(coords[0][0], coords[0][1]);
};



/**
 * Draws this ellipse.
 */
xrx.shape.Ellipse.prototype.draw = function() {
  this.startDrawing_();
  var center = this.getCenter();
  this.engineElement_.draw(center[0], center[1], this.getRadiusX(),
      this.getRadiusY(), this.getFillColor(), this.getFillOpacity(),
      this.getStrokeColor(), this.getStrokeWidth());
  this.finishDrawing_();
};



/**
 * Creates a new ellipse.
 * @param {xrx.shape.Canvas} The parent canvas object.
 */
xrx.shape.Ellipse.create = function(canvas) {
  return new xrx.shape.Ellipse(canvas);
};



/**
 * Returns a modifiable ellipse shape. Create it lazily if not existent.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @return {xrx.shape.EllipseModifiable} The modifiable ellipse shape.
 */
xrx.shape.Ellipse.prototype.getModifiable = function(drawing) {
  if (!this.modifiable_) this.modifiable_ = xrx.shape.EllipseModifiable.create(this);
  return this.modifiable_;
};



/**
 * Returns a creatable ellipse shape. Create it lazily if not existent.
 * @return {xrx.shape.EllipseCreatable} The creatable ellipse shape.
 */
xrx.shape.Ellipse.prototype.getCreatable = function() {
  if (!this.creatable_) this.creatable_ = xrx.shape.EllipseCreatable.create(this);
  return this.creatable_;
};



/**
 * @constructor
 */
xrx.shape.EllipseModifiable = function(ellipse, dragger) {

  goog.base(this, ellipse, dragger);
};
goog.inherits(xrx.shape.EllipseModifiable, xrx.shape.Modifiable);



xrx.shape.EllipseModifiable.prototype.setCoords = function(coords) {
  this.shape_.setCoords(coords);
  this.dragger_[0].setCoordX(coords[0][0] + this.shape_.getRadiusX());
  this.dragger_[0].setCoordY(coords[0][1]);
  this.dragger_[1].setCoordX(coords[0][0]);
  this.dragger_[1].setCoordY(coords[0][1] + this.shape_.getRadiusY());
};



xrx.shape.EllipseModifiable.prototype.setCoordAt = function(pos, coord) {
  if (pos === 0) {
    this.dragger_[0].setCoordX(coord[0]);
    this.shape_.setRadiusX(Math.abs(coord[0] - this.shape_.getCenter()[0]));
  } else {
    this.dragger_[1].setCoordY(coord[1]);
    this.shape_.setRadiusY(Math.abs(coord[1] - this.shape_.getCenter()[1]));
  }
};



/**
 * @constructor
 */
xrx.shape.EllipseModifiable.create = function(ellipse) {
  var center = ellipse.getCenter();
  var radiusX = ellipse.getRadiusX();
  var radiusY = ellipse.getRadiusY();
  var draggerX = xrx.shape.VertexDragger.create(ellipse.getCanvas());
  draggerX.setCoords([[center[0] + radiusX, center[1]]]);
  draggerX.setPosition(0);
  var draggerY = xrx.shape.VertexDragger.create(ellipse.getCanvas());
  draggerY.setCoords([[center[0], center[1] + radiusY]]);
  draggerY.setPosition(1);
  return new xrx.shape.EllipseModifiable(ellipse, [draggerX, draggerY]);
};



/**
 * A class representing a creatable ellipse shape.
 * @param
 * @constructor
 */
xrx.shape.EllipseCreatable = function(ellipse) {

  goog.base(this, ellipse, xrx.shape.Ellipse.create(ellipse.getCanvas()));

  /**
   * Number of vertexes the user has created so far.
   * @type {number}
   * @private
   */
  this.count_ = 0;

  this.point_ = new Array(2);
};
goog.inherits(xrx.shape.EllipseCreatable, xrx.shape.Creatable);



/**
 * Returns the coordinates of the ellipse currently created.
 * @return Array<Array<number>> The coordinates.
 */
xrx.shape.EllipseCreatable.prototype.getCoords = function() {
  return this.helper_.getCoords();
};



/**
 * Handles click events for a creatable ellipse shape.
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.EllipseCreatable.prototype.handleClick = function(e, point, shape) {
  var vertex;
  var shape;
  var coords;
  if (this.count_ === 1) { // The user touches the second time
                           // in that creates the ellipse
    // insert a ellipse
    var ellipse = xrx.shape.Ellipse.create(this.target_.getCanvas());
    var center = this.helper_.getCenter();
    ellipse.setStylable(this.target_);
    ellipse.setCenter(center[0], center[1]);
    ellipse.setRadiusX(this.helper_.getRadiusX());
    ellipse.setRadiusY(this.helper_.getRadiusY());
    this.eventHandler_.eventShapeCreated(ellipse);
    // reset for next drawing
    this.count_ = 0;
  } else { // The user touches the first time
    // initialize helper coordinates
    this.point_[0] = point[0];
    this.point_[1] = point[1];
    this.helper_.setCenter(point[0], point[1]);
    this.count_ += 1;
    this.eventHandler_.eventShapeCreate([this.helper_]);
  }
};



xrx.shape.EllipseCreatable.prototype.handleMove = function(e, point, shape) {
  if (this.count_ === 0) return;
  var distX = point[0] - this.point_[0];
  var distY = point[1] - this.point_[1];
  this.helper_.setCenter(point[0] - distX / 2, point[1] - distY / 2);
  this.helper_.setRadiusX(distX / 2);
  this.helper_.setRadiusY(distY / 2);
};



xrx.shape.EllipseCreatable.create = function(ellipse) {
  return new xrx.shape.EllipseCreatable(ellipse);
};
