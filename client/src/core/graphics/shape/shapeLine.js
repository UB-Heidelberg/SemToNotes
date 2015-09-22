/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent line shape.
 */

goog.provide('xrx.shape.Line');



goog.require('xrx.geometry.Path');
goog.require('xrx.shape.Stylable');



/**
 * Classes representing an engine-independent line shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Line = function(canvas) {

  goog.base(this, canvas,
      canvas.getEngine().createLine(canvas.getEngineElement()),
      new xrx.geometry.Path());
};
goog.inherits(xrx.shape.Line, xrx.shape.Stylable);



/**
 * Draws this line shape.
 */
xrx.shape.Line.prototype.draw = function() {
  var coords = this.getCoords();
  this.startDrawing_();
  this.engineElement_.draw(coords[0][0], coords[0][1], coords[1][0],
      coords[1][1], this.getStrokeColor(), this.getStrokeWidth());
  this.finishDrawing_();
};



/**
 * Creates a new line shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.Line.create = function(canvas) {
  return new xrx.shape.Line(canvas);
};
