/**
 * @fileoverview Super-class representing an engine-independent
 * shape.
 */

goog.provide('xrx.shape.Shape');



goog.require('xrx.engine.Engines');



/**
 * Super-class representing an engine-independent
 * shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Shape = function(canvas) {

  /**
   * The parent canvas object.
   * @type {xrx.shape.Canvas}
   */
  this.canvas_ = canvas;

  /**
   * Pointer to the underlying engine shape.
   * @type {(xrx.canvas.Element|xrx.svg.Element|xrx.vml.Element)}
   */
  this.engineElement_;

  /**
   * Whether this shape is set modifiable. Defaults to true.
   * @type {boolean}
   */
  this.isModifiable_ = true;

  this.create_();
};



/**
 * Returns the underlying engine element.
 * @return {(xrx.canvas.Element|xrx.svg.Element|xrx.vml.Element)}
 * The engine element.
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
  var coords = this.engineElement_.getCoords();
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
 * @return {Array<xrx.shape.VertexDragger>} The vertex dragging elements.
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
  var primitiveShape = xrx[this.canvas_.getEngine()][this.engineClass_];
  this.engineElement_ = primitiveShape.create(this.canvas_.getEngineElement());
};
