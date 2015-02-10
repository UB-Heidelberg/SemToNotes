/**
 * @fileoverview A class representing a vertex dragging element to
 *     modify the vertexes of a shape.
 */

goog.provide('xrx.shape.VertexDragger');



goog.require('xrx.shape.Shape');



/**
 * A class representing a vertex dragging element to modify the vertexes
 * of a shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.shape.VertexDragger = function(drawing) {

  goog.base(this, drawing);

  /**
   * The nth vertex of a shape.
   * @type {number}
   * @private
   */
  this.pos_;
};
goog.inherits(xrx.shape.VertexDragger, xrx.shape.Shape);



/**
 * The engine class used to render this shape.
 * @type {string}
 * @const
 */
xrx.shape.VertexDragger.prototype.engineClass_ = 'Circle';



/**
 * Returns the position n of the vertex dragging element in the list
 * dragging elements.
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



/**
 * Returns the coordinates of the vertex dragging element.
 * @return {Array.<Array.<number>>} The coordinates.
 */
xrx.shape.VertexDragger.prototype.getCoords = function() {
  return [this.engineShape_.getCenter()];
};



/**
 * Returns a copy of the shape's coordinate object.
 * @return {Array.<Array.<number>>} A new coordinate object.
 */
xrx.shape.VertexDragger.prototype.getCoordsCopy = function() {
  var coords = [this.engineShape_.getCenter()];
  var len = coords.length;
  var newCoords = new Array(len);
  var coord;
  for (var i = 0; i < len; i++) {
    newCoords[i] = [coords[i][0], coords[i][1]];
  }
  return newCoords;
};



/**
 * Sets the shape's coordinates.
 * @param {Array.<Array.<number>>} The new coordinates.
 */
xrx.shape.VertexDragger.prototype.setCoords = function(coords) {
  this.engineShape_.setCenter(coords[0][0], coords[0][1]);
};



/**
 * Returns the radius of the dragging element shape.
 * @return {number} The radius.
 */
xrx.shape.VertexDragger.prototype.getRadius = function() {
  return this.engineShape_.getRadius();
};



/**
 * Sets the radius of the dragging element shape.
 * @param {number} The radius.
 */
xrx.shape.VertexDragger.prototype.setRadius = function(radius) {
  this.engineShape_.setRadius(radius);
};




/**
 * Creates a new vertex dragging shape.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 */
xrx.shape.VertexDragger.create = function(drawing) {
  var dragger = new xrx.shape.VertexDragger(drawing);
  dragger.setRadius(8);
  dragger.setStrokeColor('black');
  dragger.setStrokeWidth(1);
  dragger.setFillColor('white');
  dragger.setFillOpacity(1.0);
  return dragger;
};



goog.exportProperty(xrx.shape, 'VertexDragger', xrx.shape.VertexDragger);
