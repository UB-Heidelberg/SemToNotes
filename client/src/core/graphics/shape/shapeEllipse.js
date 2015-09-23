/**
 * @fileoverview A class representing an engine-independent
 * ellipse graphic.
 */

goog.provide('xrx.shape.Ellipse');



goog.require('xrx.geometry.Ellipse');
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
  if (!this.creatable_) this.creatable_ = xrx.shape.CircleCreate.create(this);
  return this.creatable_;
};



/**
 * @constructor
 */
xrx.shape.EllipseModifiable = function(ellipse) {

};



/**
 * @constructor
 */
xrx.shape.EllipseCreatable = function(ellipse) {
};
