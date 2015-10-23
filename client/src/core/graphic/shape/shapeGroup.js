/**
 * @fileoverview Class representing an engine-independent graphic
 * group.
 */

goog.provide('xrx.shape.Group');



goog.require('xrx.shape.Container');


 
/**
 * A class representing an engine-independent shape group.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Group = function(drawing, engineElement) {

  goog.base(this, drawing, engineElement);
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
 * @param {xrx.drawing.Drawing} The parent drawing canvas.
 */
xrx.shape.Group.create = function(drawing) {
  var shapeCanvas = drawing.getCanvas();
  var engine = shapeCanvas.getEngine();
  var engineCanvas = shapeCanvas.getEngineElement();
  var engineElement = engine.createGroup(engineCanvas);
  return new xrx.shape.Group(drawing, engineElement);
};



xrx.shape.Group.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
};
