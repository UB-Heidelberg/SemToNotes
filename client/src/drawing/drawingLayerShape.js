/**
 * @fileoverview A class representing a canvas group where shapes can be rendered.
 */

goog.provide('xrx.drawing.LayerShape');



goog.require('goog.dom.DomHelper');
goog.require('xrx.drawing.Layer');
goog.require('xrx.drawing.LayerBackground');
goog.require('xrx.graphics.Engine');
goog.require('xrx.graphics.Graphics');
goog.require('xrx.shape.Polygon');
goog.require('xrx.shape.Rect');



/**
 * A class representing a canvas group where shapes can be rendered.
 * @param {xrx.drawing.Drawing} canvas A canvas object.
 * @constructor
 * @extends xrx.drawing.Layer
 */
xrx.drawing.LayerShape = function(drawing) {

  goog.base(this, drawing);
};
goog.inherits(xrx.drawing.LayerShape, xrx.drawing.Layer);



/**
 * Updates the coordinates of the shape currently selected by the user.
 * @param {Array.<Array.<number>>} coords The new coordinates.
 */
xrx.drawing.LayerShape.prototype.update = function(coords, canvas) {
  var selectedShape = this.getCanvas().getSelectedShape();
  var selectedElement = this.getCanvas().getSelectedElement();

  selectedShape.setCoords(selectedElement, coords, canvas);
};
