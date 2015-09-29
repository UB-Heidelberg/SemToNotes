/**
 * @fileoverview A class representing a vertex dragging element to
 *   modify the vertexes of a shape.
 */

goog.provide('xrx.shape.Dragger');



goog.require('xrx.shape.Circle');



/**
 * A class representing a dragger to modify the size or the vertexes
 * of a shape.
 * @param {xrx.shape.Modifiable} shape The parent modifiable shape.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.Dragger = function(modifiable, pos) {

  var drawing = modifiable.getShape().getDrawing();
  goog.base(this, drawing,
      drawing.getEngine().createCircle(drawing.getCanvas().getEngineElement()));

  this.modifiable_ = modifiable;

  /**
   * The nth dragger of a shape.
   * @type {number}
   * @private
   */
  this.pos_ = pos;
};
goog.inherits(xrx.shape.Dragger, xrx.shape.Circle);



xrx.shape.Dragger.prototype.setCoord = function(coord) {
  this.modifiable_.setCoordAt(this.pos_, coord)
};



/**
 * Returns the position n of the vertex dragging element in the list
 * of dragging elements.
 * @return {number} The position.
 */
xrx.shape.Dragger.prototype.getPosition = function() {
  return this.pos_;
};



xrx.shape.Dragger.prototype.getRadius = function() {
  return this.geometry_.r / this.zoomFactor_;
};



/**
 * Creates a new dragger.
 * @param {xrx.shape.Modifiable} shape The parent modifiable shape.
 */
xrx.shape.Dragger.create = function(modifiable, pos) {
  var dragger = new xrx.shape.Dragger(modifiable, pos);
  dragger.setRadius(5);
  dragger.setStrokeColor('black');
  dragger.setStrokeWidth(1);
  dragger.setFillColor('white');
  dragger.setFillOpacity(1.0);
  return dragger;
};
