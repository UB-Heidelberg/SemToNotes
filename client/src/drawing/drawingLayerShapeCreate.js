/**
 * @fileoverview A class representing a canvas group where new shapes
 * can be created.
 */

goog.provide('xrx.drawing.LayerShapeCreate');



goog.require('goog.dom.DomHelper');
goog.require('xrx.drawing.Layer');
goog.require('xrx.drawing.LayerBackground');
goog.require('xrx.graphics.Engine');
goog.require('xrx.graphics.Graphics');



/**
 * A class representing a canvas group where new shapes can be created.
 * @param {xrx.drawing.Drawing} canvas A canvas object.
 * @constructor
 * @extends xrx.drawing.Layer
 */
xrx.drawing.LayerShapeCreate = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.drawing.LayerShapeCreate, xrx.drawing.Layer);
