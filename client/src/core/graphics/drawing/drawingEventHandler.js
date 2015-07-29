/**
 * @fileoverview
 */

goog.provide('xrx.drawing.EventHandler');



goog.require('goog.style');
goog.require('xrx.drawing');
goog.require('xrx.event.HandlerTarget');



/**
 * @constructor
 */
xrx.drawing.EventHandler = function() {

  goog.base(this);
};
goog.inherits(xrx.drawing.EventHandler, xrx.event.HandlerTarget);



/**
 *
 */
xrx.drawing.EventHandler.prototype.getOffsetPoint = function(clientPoint) {
  var pos = goog.style.getClientPosition(this.canvas_.getEventTarget());
  var offset = [clientPoint[0] - pos.x, clientPoint[1] - pos.y];
  var transformed = new Array(2);
  this.getViewbox().getCTM().getInverse().transform(offset, 0, transformed, 0, 1);
  return transformed;
};



/**
 *
 */
xrx.drawing.EventHandler.prototype.getEventPoint = function(e) {
  var touches = e.getBrowserEvent().changedTouches;
  var x;
  var y;
  if (touches) {
    x = touches[0].clientX;
    y = touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }
  return this.getOffsetPoint([x, y]);
};



/**
 * Returns the shape currently selected by the user.
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
