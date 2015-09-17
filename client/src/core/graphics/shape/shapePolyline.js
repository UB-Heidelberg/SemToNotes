/**
 * @fileoverview Classes representing a modifiable and creatable
 *     engine-independent poly-line shape.
 */

goog.provide('xrx.shape.Polyline');



goog.require('xrx.geometry.Path');
goog.require('xrx.shape.Stylable');



/**
 * Classes representing an engine-independent poly-line shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Polyline = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Path());
};
goog.inherits(xrx.shape.Polyline, xrx.shape.Stylable);



/**
 * The engine class used to render this shape.
 * @type {string}
 * @const
 */
xrx.shape.Polyline.prototype.engineClass_ = 'Polyline';



/**
 * Draws this poly-line shape.
 */
xrx.shape.Polyline.prototype.draw = function() {
  this.engineElement_.draw(this.getCoords(), this.getFillColor(),
      this.getFillOpacity(), this.getStrokeColor(),
      this.getStrokeWidth());
};



/**
 * Creates a new poly-line shape.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 */
xrx.shape.Polyline.create = function(canvas) {
  return new xrx.shape.Polyline(canvas);
};
