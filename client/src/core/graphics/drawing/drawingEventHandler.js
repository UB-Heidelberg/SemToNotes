/**
 * @fileoverview
 */

goog.provide('xrx.drawing.EventHandler');



goog.require('goog.style');
goog.require('xrx.drawing');
goog.require('xrx.drawing.EventTarget');



/**
 * @constructor
 */
xrx.drawing.EventHandler = function() {

  goog.base(this);
};
goog.inherits(xrx.drawing.EventHandler, xrx.drawing.EventTarget);



/**
 *
 */
xrx.drawing.EventHandler.prototype.getEventPoint = function(e) {
  var pos = goog.style.getPosition(this.getCanvas().getElement());
  var eventPoint = [e.clientX - pos.x, e.clientY - pos.y];
  var point = new Array(2);
  this.getViewbox().getCTM().createInverse().transform(eventPoint, 0, point, 0, 1);
  return point;
};



/**
 * Returns the shape which the user currently selected with the mouse.
 * @return {xrx.shape.Shape}
 */
xrx.drawing.EventHandler.prototype.getShapeSelected = function(point) {
  var layer;
  var shapes;
  var shape;
  var coords;
  var coord;
  var found = false;
  for (var i = this.layer_.length - 1; i >= 0; i--) {
    layer = this.layer_[i];
    if (!layer.isLocked()) {
      shapes = layer.getShapes() || [];
      for (var j = shapes.length - 1; j >= 0; j--) {
        shape = shapes[j];
        if (shape.getEngineShape().getGeometry().containsPoint(point)) {
          found = true;
          break;
        }
      }
    }
    if (found === true) break;
  }
  return found ? shape : undefined;
};
