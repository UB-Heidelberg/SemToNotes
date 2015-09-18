/**
 * @fileoverview Class representing an engine-independent graphic
 * group.
 */

goog.provide('xrx.shape.Group');



goog.require('xrx.shape.Container');


 
/**
 * A class representing an engine-independent shape group.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.Group = function(canvas, engineElement) {

  goog.base(this, canvas, engineElement);
};
goog.inherits(xrx.shape.Group, xrx.shape.Container);



/**
 * Draws this group and all its groups and shapes contained.
 */
xrx.shape.Group.prototype.draw = function() {
  this.startDrawing_();
  var children = this.getChildren();
  for(var i = 0, len = children.length; i < len; i++) {
    children[i].draw();
  };
  this.finishDrawing_();
};



/**
 * Creates a new graphic group.
 * @param {xrx.shape.Canvas} The parent canvas object.
 */
xrx.shape.Group.create = function(canvas) {
  var engineElement;
  var engine = canvas.getEngine();
  var canvasElement = canvas.getEngineElement();
  if (engine.typeOf(xrx.engine.CANVAS)) {
    engineElement = xrx.canvas.Group.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.SVG)) {
    engineElement = xrx.svg.Group.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.VML)) {
    engineElement = xrx.vml.Group.create(canvasElement);
  } else {
    throw Error('Unknown engine.');
  }
  return new xrx.shape.Group(canvas, engineElement);
};
