/**
 * @fileoverview A class representing a drawing layer where shapes can be rendered.
 */

goog.provide('xrx.drawing.LayerShape');



goog.require('xrx.drawing.Layer');



/**
 * A class representing a drawing layer where shapes can be rendered.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @constructor
 * @extends xrx.drawing.Layer
 * @private
 */
xrx.drawing.LayerShape = function(drawing) {

  goog.base(this, drawing);
};
goog.inherits(xrx.drawing.LayerShape, xrx.drawing.Layer);
