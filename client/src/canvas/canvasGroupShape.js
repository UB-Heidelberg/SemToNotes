/**
 * @fileoverview A class representing a canvas group where shapes can be rendered.
 */

goog.provide('xrx.canvas.GroupShape');



goog.require('goog.dom.DomHelper');
goog.require('xrx.canvas.Group');
goog.require('xrx.canvas.GroupBackground');
goog.require('xrx.canvas.GroupHandler');
goog.require('xrx.graphics.Graphics');



/**
 * A class representing a canvas group where shapes can be rendered.
 * @param {xrx.canvas.Canvas} canvas A canvas object.
 * @constructor
 * @extends xrx.canvas.Group
 */
xrx.canvas.GroupShape = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.canvas.GroupShape, xrx.canvas.Group);



/**
 * Updates the coordinates of the shape currently selected by the user.
 * @param {Array.<Array.<number>>} coords The new coordinates.
 */
xrx.canvas.GroupShape.prototype.update = function(coords) {
  var selectedShape = this.getCanvas().getSelectedShape();
  var selectedElement = this.getCanvas().getSelectedElement();

  selectedShape.setCoords(selectedElement, coords);
};



/**
 * @private
 */
xrx.canvas.GroupShape.prototype.registerEvents_ = function() {
  var graphics = this.getCanvas().getGraphics();
  this.registerMouseZoom(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseDrag(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseDrag(this.element_, graphics.Rect);
  this.registerMouseDrag(this.element_, graphics.Polygon);
  this.registerMouseRotate(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseDelete(this.element_, graphics.Rect);
  this.registerMouseDelete(this.element_, graphics.Polygon);
};
