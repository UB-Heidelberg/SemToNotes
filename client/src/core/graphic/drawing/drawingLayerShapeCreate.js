/**
 * @fileoverview A class representing a drawing layer where new shapes
 * can be created.
 */

goog.provide('xrx.drawing.LayerShapeCreate');



goog.require('xrx.drawing.Layer');



/**
 * A class representing a drawing layer where new shapes can be created.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @constructor
 * @extends xrx.drawing.Layer
 */
xrx.drawing.LayerShapeCreate = function(drawing) {

  goog.base(this, drawing);
};
goog.inherits(xrx.drawing.LayerShapeCreate, xrx.drawing.Layer);
