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
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.Line = function(canvas, engineElement) {

  goog.base(this, canvas, engineElement, new xrx.geometry.Path());
};
goog.inherits(xrx.shape.Line, xrx.shape.Stylable);



/**
 * Draws this line shape.
 */
xrx.shape.Line.prototype.draw = function() {
  this.startDrawing_();
  this.engineElement_.draw(this.getCoords(), this.getStrokeColor(),
      this.getStrokeWidth());
  this.finishDrawing_();
};



/**
 * Creates a new line shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.Line.create = function(canvas) {
  var line;
  var engineElement;
  var engine = canvas.getEngine();
  var canvasElement = canvas.getEngineElement();
  if (engine.typeOf(xrx.engine.CANVAS)) {
    engineElement = xrx.canvas.Line.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.SVG)) {
    engineElement = xrx.svg.Line.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.VML)) {
    engineElement = xrx.vml.Line.create(canvasElement);
  } else {
    throw Error('Unknown engine.');
  }
  line = new xrx.shape.Line(canvas, engineElement);
  line.setCoords([[0, 0]]);
  return line;
};
