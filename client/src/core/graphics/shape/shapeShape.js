/**
 * @fileoverview Super-class representing an engine-independent
 * shape.
 */

goog.provide('xrx.shape.Shape');



goog.require('xrx.engine.Engines');
goog.require('xrx.EventTarget');
goog.require('xrx.shape');



/**
 * Super-class representing an engine-independent shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.Shape = function(canvas, engineElement) {

  goog.base(this);

  /**
   * The parent canvas object.
   * @type {xrx.shape.Canvas}
   */
  this.canvas_ = canvas;

  /**
   * Pointer to the underlying engine shape.
   * @type {xrx.engine.Element}
   */
  this.engineElement_ = engineElement;

  /**
   * Whether this shape is set modifiable. Defaults to true.
   * @type {boolean}
   */
  this.isModifiable_ = true;

  /**
   *
   */
  this.hoverable_;

  /**
   *
   */
  this.selectable_;

  /**
   *
   */
  this.modifiable_;

  /**
   *
   */
  this.creatable_;

  /**
   * The current transformation matrix of this shape.
   * @type {goog.math.AffineTransform}
   */
  this.ctm_;
};
goog.inherits(xrx.shape.Shape, xrx.EventTarget);



xrx.shape.Shape.prototype.getHoverable = goog.abstractMethod;



xrx.shape.Shape.prototype.setHoverable = goog.abstractMethod;



xrx.shape.Shape.prototype.getSelectable = goog.abstractMethod;



xrx.shape.Shape.prototype.setSelectable = goog.abstractMethod;



/**
 * Abstract function to be implemented by each shape class. Returns
 * a modifiable shape.
 * @return {xrx.shape.Modifiable} A modifiable shape.
 */
xrx.shape.Shape.prototype.getModifiable = goog.abstractMethod;



xrx.shape.Shape.prototype.setModifiable = goog.abstractMethod;



/**
 * Abstract function to be implemented by each shape class. Returns
 * a creatable shape.
 * @return {xrx.shape.Creatable} A creatable shape.
 */
xrx.shape.Shape.prototype.getCreatable = goog.abstractMethod;



xrx.shape.Shape.prototype.setCreatable = goog.abstractMethod;



/**
 * Returns the parent canvas object of this shape.
 * @return {xrx.shape.Canvas} The canvas object.
 */ 
xrx.shape.Shape.prototype.getCanvas = function() {
  return this.canvas_;
};



/**
 * Returns the underlying engine element.
 * @return {xrx.engine.Element} The engine element.
 */
xrx.shape.Shape.prototype.getEngineElement = function() {
  return this.engineElement_;
};



/**
 * Sets whether the shape shall be modifiable or not. Defaults
 * to true.
 * @param {boolean} modifiable Whether modifiable or not.
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
 * Returns a copy of the shape's coordinate array.
 * @return {Array<Array<number>>} A new coordinate array.
 */
xrx.shape.Shape.prototype.getCoordsCopy = function() {
  var coords = this.getCoords();
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
 * Returns an array of vertex dragging elements according to the number of 
 * vertexes of this shape.
 * @return {Array<xrx.shape.Dragger>} The vertex dragging elements.
 */
xrx.shape.Shape.prototype.getVertexDraggers = function() {
  var coords = this.getCoords();
  var draggers = [];
  var dragger;
  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.Dragger.create(this.canvas_);
    dragger.setCoords([coords[i]]);
    draggers.push(dragger);
  }
  return draggers;
};



/**
 * Sets a transformation matrix for this shape.
 * @param {goog.math.AffineTransform} matrix The matrix.
 */
xrx.shape.Shape.prototype.setCTM = function(matrix) {
  this.ctm_ = matrix;
};



xrx.shape.Shape.prototype.startDrawing_ = function() {
  this.dispatchExternal(xrx.shape.EventType.SHAPE_BEFORE_DRAW,
      this.canvas_.getEventHandler(), this);
  this.engineElement_.applyTransform(this.ctm_);
  this.engineElement_.startDrawing();
};



xrx.shape.Shape.prototype.finishDrawing_ = function() {
  this.engineElement_.finishDrawing();
};
