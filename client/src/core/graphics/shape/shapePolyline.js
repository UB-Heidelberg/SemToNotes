***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.shape.Polyline');



goog.require('xrx.shape.Shape');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.shape.Polyline = function(drawing) {

  goog.base(this, drawing);
***REMOVED***
goog.inherits(xrx.shape.Polyline, xrx.shape.Shape);



xrx.shape.Polyline.prototype.primitiveClass_ = 'Polyline';



xrx.shape.Polyline.prototype.appendCoord = function(coord) {
  this.primitiveShape_.appendCoord(coord);
***REMOVED***



xrx.shape.Polyline.create = function(drawing) {
  return new xrx.shape.Polyline(drawing);
***REMOVED***
