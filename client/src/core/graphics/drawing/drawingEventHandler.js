***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.drawing.EventHandler');



goog.require('xrx.drawing.EventTarget');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.drawing.EventHandler = function() {

  goog.base(this);
***REMOVED***
goog.inherits(xrx.drawing.EventHandler, xrx.drawing.EventTarget);



***REMOVED***
***REMOVED***
***REMOVED***
xrx.drawing.EventHandler.prototype.getEventPoint = function(e) {
  var pos = goog.style.getPosition(this.element_);
  var eventPoint = [e.clientX - pos.x, e.clientY - pos.y];
  var point = new Array(2);
  this.getViewbox().getCTM().createInverse().transform(eventPoint, 0, point, 0, 1);
  return point;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the shape which the user currently selected with the mouse.
***REMOVED*** @return {xrx.shape.Shape}
***REMOVED***
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
***REMOVED***
