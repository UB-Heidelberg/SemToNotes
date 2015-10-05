/**
 * @fileoverview A class representing an engine-independent
 * hoverable, selectable, modifiable and creatable circle shape.
 */

goog.provide('xrx.shape.Circle');
goog.provide('xrx.shape.CircleCreatable');
goog.provide('xrx.shape.CircleHoverable');
goog.provide('xrx.shape.CircleModifiable');
goog.provide('xrx.shape.CircleSelectable');



goog.require('xrx.geometry.Circle');
goog.require('xrx.shape.Creatable');
goog.require('xrx.shape.Geometry');
goog.require('xrx.shape.Hoverable');
goog.require('xrx.shape.Modifiable');
goog.require('xrx.shape.Selectable');



/**
 * A class representing an engine-independent creatable, hoverable,
 * modifiable and selectable circle shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @constructor
 */
xrx.shape.Circle = function(drawing, engineElement) {

  goog.base(this, drawing, engineElement, new xrx.geometry.Circle());
};
goog.inherits(xrx.shape.Circle, xrx.shape.Geometry);



/**
 * Returns the center point of this circle.
 * @return {Array<number>}
 */
xrx.shape.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
};



/**
 * Sets the center point of this circle.
 * @param {number} cx The X coordinate of the center point.
 * @param {number} cy The Y coordinate of the center point.
 */
xrx.shape.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
};



/**
 * Returns the radius of this circle.
 * @return {number} The radius.
 */
xrx.shape.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
};



/**
 * Sets the radius of this circle.
 * @param {number} r The radius.
 */
xrx.shape.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
};



/**
 * Returns the coordinates of this circle. We assume the center point.
 * @return {Array<Array<<number>>} The coordinates.
 */
xrx.shape.Circle.prototype.getCoords = function() {
  return [this.getCenter()];
};



/**
 * Sets the coordinates of this circle. We assume the center point.
 * @param {Array<Array<<number>>} coords The coordinate.
 */
xrx.shape.Circle.prototype.setCoords = function(coords) {
  this.setCenter(coords[0][0], coords[0][1]);
};



/**
 * Sets the x coordinate of this circle. We assume the center point.
 * @param {number} coords The x coordinate.
 */
xrx.shape.Circle.prototype.setCoordX = function(x) {
  this.geometry_.cx = x;
};



/**
 * Sets the y coordinate of this circle. We assume the center point.
 * @param {number} coords The y coordinate.
 */
xrx.shape.Circle.prototype.setCoordY = function(y) {
  this.geometry_.cy = y;
};



/**
 * Draws this circle shape.
 */
xrx.shape.Circle.prototype.draw = function() {
  this.startDrawing_();
  var center = this.getCenter();
  this.engineElement_.draw(center[0], center[1], this.getRadius(),
      this.getFillColor(), this.getFillOpacity(), this.getStrokeColor(),
      this.getRenderingStrokeWidth());
  this.finishDrawing_();
};



xrx.shape.Circle.prototype.getHoverable = function() {
  if (!this.hoverable_) this.hoverable_ = xrx.shape.CircleHoverable.create(this);
  return this.hoverable_;
};



xrx.shape.Circle.prototype.setHoverable = function(hoverable) {
  if (!hoverable instanceof xrx.shape.CircleHoverable)
      throw Error('Instance of xrx.shape.CircleHoverable expected.');
  this.hoverable_ = hoverable;
};



xrx.shape.Circle.prototype.getSelectable = function() {
  if (!this.selectable_) this.selectable_ = xrx.shape.CircleSelectable.create(this);
  return this.selectable_;
};



xrx.shape.Circle.prototype.setSelectable = function(selectable) {
  if (!selectable instanceof xrx.shape.CircleSelectable)
      throw Error('Instance of xrx.shape.CircleSelectable expected.');
  this.selectable_ = selectable;
};



/**
 * Returns a modifiable circle shape. Create it lazily if not existent.
 * @return {xrx.shape.CircleModifiable} The modifiable circle shape.
 */
xrx.shape.Circle.prototype.getModifiable = function() {
  if (!this.modifiable_) this.modifiable_ = xrx.shape.CircleModifiable.create(this);
  return this.modifiable_;
};



xrx.shape.Circle.prototype.setModifiable = function(modifiable) {
  if (!modifiable instanceof xrx.shape.CircleModifiable)
      throw Error('Instance of xrx.shape.CircleModifiable expected.');
  this.modifiable_ = modifiable;
};



/**
 * Returns a creatable circle shape. Create it lazily if not existent.
 * @return {xrx.shape.CircleCreatable} The creatable circle shape.
 */
xrx.shape.Circle.prototype.getCreatable = function() {
  if (!this.creatable_) this.creatable_ = xrx.shape.CircleCreatable.create(this);
  return this.creatable_;
};



xrx.shape.Circle.prototype.setCreatable = function(creatable) {
  if (!creatable instanceof xrx.shape.CircleCreatable)
      throw Error('Instance of xrx.shape.CircleCreatable expected.');
  this.creatable_ = creatable;
};



/**
 * Creates a new circle shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 */
xrx.shape.Circle.create = function(drawing) {
  var shapeCanvas = drawing.getCanvas();
  var engine = shapeCanvas.getEngine();
  var engineCanvas = shapeCanvas.getEngineElement();
  var engineElement = engine.createCircle(engineCanvas);
  return new xrx.shape.Circle(drawing, engineElement);
};



/**
 * @constructor
 */
xrx.shape.CircleHoverable = function(circle) {

  goog.base(this, circle);
};
goog.inherits(xrx.shape.CircleHoverable, xrx.shape.Hoverable);



xrx.shape.CircleHoverable.create = function(circle) {
  return new xrx.shape.CircleHoverable(circle);
};




/**
 * @constructor
 */
xrx.shape.CircleSelectable = function(circle) {

  goog.base(this, circle);
};
goog.inherits(xrx.shape.CircleSelectable, xrx.shape.Selectable);



xrx.shape.CircleSelectable.create = function(circle) {
  return new xrx.shape.CircleSelectable(circle);
};



/**
 * @constructor
 */
xrx.shape.CircleModifiable = function(circle) {

  goog.base(this, circle);
};
goog.inherits(xrx.shape.CircleModifiable, xrx.shape.Modifiable);



xrx.shape.CircleModifiable.prototype.setCoords = function(coords) {
  this.shape_.setCoords(coords);
  this.dragger_[0].setCoordX(coords[0][0] + this.shape_.getRadius());
  this.dragger_[0].setCoordY(coords[0][1]);
};



xrx.shape.CircleModifiable.prototype.setCoordAt = function(pos, coord) {
  this.shape_.setRadius(Math.abs(coord[0] - this.shape_.getCenter()[0]));
  this.dragger_[0].setCoordX(coord[0]);
};



xrx.shape.CircleModifiable.prototype.move = function(distX, distY) {
  var coords = this.shape_.getCoordsCopy();
  coords[0][0] += distX;
  coords[0][1] += distY;
  this.setCoords(coords);
};



xrx.shape.CircleModifiable.create = function(circle) {
  var center = circle.getCenter();
  var radius = circle.getRadius();
  var modifiable = new xrx.shape.CircleModifiable(circle);
  var dragger = xrx.shape.Dragger.create(modifiable, 0);
  dragger.setCoords([[center[0] + radius, center[1]]]);
  modifiable.setDragger([dragger]);
  return modifiable;
};



/**
 * A class representing a creatable circle shape.
 * @param
 * @constructor
 */
xrx.shape.CircleCreatable = function(circle) {

  goog.base(this, circle, xrx.shape.Circle.create(circle.getDrawing()));

  this.point_ = new Array(2);
};
goog.inherits(xrx.shape.CircleCreatable, xrx.shape.Creatable);



/**
 * Returns the coordinates of the circle currently created.
 * @return Array<Array<number>> The coordinates.
 */
xrx.shape.CircleCreatable.prototype.getCoords = function() {
  return this.preview_.getCoords();
};



/**
 *
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.CircleCreatable.prototype.handleDown = function(e, cursor) {
  var point = cursor.getPointTransformed();
  this.point_[0] = point[0];
  this.point_[1] = point[1];
  this.preview_.setCenter(point[0], point[1]);
  this.preview_.setRadius(0);
  this.target_.getDrawing().eventShapeCreate([this.preview_]);
};



/**
 *
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.CircleCreatable.prototype.handleMove = function(e, cursor) {
  var point = cursor.getPointTransformed();
  if (this.count_ === 0) return;
  var distX = point[0] - this.point_[0];
  var distY = point[1] - this.point_[1];
  this.preview_.setCenter(point[0] - distX / 2, point[1] - distY / 2);
  this.preview_.setRadius(Math.sqrt(distX * distX + distY * distY) / 2);
};



/**
 *
 * @param {goog.events.BrowserEvent} e The browser event.
 */
xrx.shape.CircleCreatable.prototype.handleUp = function(e, cursor) {
  var point = cursor.getPointTransformed();
  var circle = xrx.shape.Circle.create(this.target_.getDrawing());
  var center = this.preview_.getCenter();
  circle.setStyle(this.target_);
  circle.setCenter(center[0], center[1]);
  circle.setRadius(this.preview_.getRadius());
  this.target_.getDrawing().eventShapeCreated(circle);
};



xrx.shape.CircleCreatable.create = function(circle) {
  return new xrx.shape.CircleCreatable(circle);
};
