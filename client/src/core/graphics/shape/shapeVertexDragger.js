/**
 * @fileoverview A class representing a vertex dragging element to
 *   modify the vertexes of a shape.
 */

goog.provide('xrx.shape.VertexDragger');



goog.require('xrx.shape.Circle');



/**
 * A class representing a vertex dragging element to modify the vertexes
 * of a shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.VertexDragger = function(canvas, engineElement) {

  goog.base(this, canvas, engineElement);

  /**
   * The nth vertex of a shape.
   * @type {number}
   * @private
   */
  this.pos_;
};
goog.inherits(xrx.shape.VertexDragger, xrx.shape.Circle);



/**
 * Returns the position n of the vertex dragging element in the list
 * of dragging elements.
 * @return {number} The position.
 */
xrx.shape.VertexDragger.prototype.getPosition = function() {
  return this.pos_;
};



/**
 * Sets the position n of the vertex dragging element in the list
 * dragging elements.
 * @param {number} The position.
 */
xrx.shape.VertexDragger.prototype.setPosition = function(pos) {
  this.pos_ = pos;
};



xrx.shape.VertexDragger.prototype.getRadius = function() {
  return this.geometry_.r / this.zoomFactor_;
};



/**
 * Creates a new vertex dragging shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.VertexDragger.create = function(canvas) {
  var dragger;
  var engineElement;
  var engine = canvas.getEngine();
  var canvasElement = canvas.getEngineElement();
  if (engine.typeOf(xrx.engine.CANVAS)) {
    engineElement = xrx.canvas.Circle.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.SVG)) {
    engineElement = xrx.svg.Circle.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.VML)) {
    engineElement = xrx.vml.Circle.create(canvasElement);
  } else {
    throw Error('Unknown engine.');
  }
  dragger = new xrx.shape.VertexDragger(canvas, engineElement);
  dragger.setRadius(5);
  dragger.setStrokeColor('black');
  dragger.setStrokeWidth(1);
  dragger.setFillColor('white');
  dragger.setFillOpacity(1.0);
  return dragger;
};
