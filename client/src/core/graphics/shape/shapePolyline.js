/**
 * @fileoverview
 */

goog.provide('xrx.shape.Polyline');



goog.require('xrx.geometry.Path');
goog.require('xrx.shape.Stylable');



/**
 * @constructor
 */
xrx.shape.Polyline = function(drawing) {

  goog.base(this, drawing, new xrx.geometry.Path());
};
goog.inherits(xrx.shape.Polyline, xrx.shape.Stylable);



xrx.shape.Polyline.prototype.engineClass_ = 'Polyline';



xrx.shape.Polyline.create = function(drawing) {
  return new xrx.shape.Polyline(drawing);
};
