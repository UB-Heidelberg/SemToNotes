/**
 * @fileoverview Super-class representing a shape.
 */

goog.provide('xrx.shape.Shape');



/**
 * Super-class representing a shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.shape.Shape = function(drawing) {

  /**
   * The parent drawing object.
   * @type {xrx.drawing.Drawing}
   */
  this.drawing_ = drawing;

  /**
   * Pointer to the underlying engine rendering shape.
   * @type {Object}
   */
  this.engineShape_;

  /**
   * Whether the shape is set modifiable. Deafault is true.
   * @type {boolean}
   */
  this.isModifiable_ = true;

  this.create_();
};



/**
 * Returns the parent drawing object.
 * @return {xrx.drawing.Drawing} The parent drawing object.
 */
xrx.shape.Shape.prototype.getDrawing = function() {
  return this.drawing_;
};



/**
 * Returns the underlying engine rendering shape.
 * @return {Object} The rendering shape.
 */
xrx.shape.Shape.prototype.getEngineShape = function() {
  return this.engineShape_;
};



/**
 * Sets whether the shape shall be modifiable or not. Defaults
 * to true.
 * @param {boolean} Whether modifiable or not, defaults to true.
 */
xrx.shape.Shape.prototype.setModifiable = function(modifiable) {
  modifiable === false ? this.isModifiable_ = false : this.isModifiable_ = true;
};



/**
 * Whether this shape is set modifiable.
 * @return {boolean} Is modifiable.
 */
xrx.shape.Shape.prototype.isModifiable = function() {
  return this.isModifiable_;
};



/**
 * Returns the coordinates of the shape.
 * @return {Array.<Array.<number>>} The coordinates.
 */
xrx.shape.Shape.prototype.getCoords = function() {
  return this.engineShape_.getCoords();
};



/**
 * Returns a copy of the shape's coordinate object.
 * @return {Array.<Array.<number>>} A new coordinate object.
 */
xrx.shape.Shape.prototype.getCoordsCopy = function() {
  var coords = this.engineShape_.getCoords();
  var len = coords.length;
  var newCoords = new Array(len);
  var coord;
  for (var i = 0; i < len; i++) {
    newCoords[i] = new Array(2);
    newCoords[i][0] = coords[i][0];
    newCoords[i][1] = coords[i][1];
  }
  return newCoords;
};



/**
 * Sets the shape's coordinates.
 * @param {Array.<Array.<number>>} The new coordinates.
 */
xrx.shape.Shape.prototype.setCoords = function(coords) {
  this.engineShape_.setCoords(coords);
};



/**
 * Changes one point of the coordinates at a position.
 * @param {number} pos The position.
 * @param {Array.<number>} The new point.
 */
xrx.shape.Shape.prototype.setCoordAt = function(pos, coord) {
  this.engineShape_.setCoordAt(pos, coord);
};



/**
 * Sets the fill-color of the shape.
 * @param {string} color The color.
 */
xrx.shape.Shape.prototype.setFillColor = function(color) {
  this.engineShape_.setFillColor(color);
};



/**
 * Sets the fill-opacity of the shape.
 * @param {number} factor The opacity factor.
 */
xrx.shape.Shape.prototype.setFillOpacity = function(factor) {
  this.engineShape_.setFillOpacity(factor);
};



/**
 * Sets the stroke-width of the shape.
 * @param {number} width The new width.
 */
xrx.shape.Shape.prototype.setStrokeWidth = function(width) {
  this.engineShape_.setStrokeWidth(width);
};



/**
 * Sets the stroke-color of the shape.
 * @param {string} color The new color.
 */
xrx.shape.Shape.prototype.setStrokeColor = function(color) {
  this.engineShape_.setStrokeColor(color);
};



/**
 * Returns an array of vertex dragging elements according to the number of 
 * vertexes of the shape.
 * @return {xrx.shape.VertexDragger} The vertex draggin elements.
 */
xrx.shape.Shape.prototype.getVertexDraggers = function() {
  var coords = this.getCoords();
  var draggers = [];
  var dragger;

  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.VertexDragger.create(this.drawing_);
    dragger.setCoords([coords[i]]);
    draggers.push(dragger);
  }

  return draggers;
};



/**
 * @private
 */
xrx.shape.Shape.prototype.create_ = function() {
  var primitiveShape = this.drawing_.getGraphics()[this.engineClass_];
  this.engineShape_ = primitiveShape.create(this.drawing_.getCanvas());
  this.engineShape_.setStrokeColor('#47D1FF');
  this.engineShape_.setStrokeWidth(3.);
  this.engineShape_.setFillOpacity(0.);
};
