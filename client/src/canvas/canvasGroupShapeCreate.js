/**
 * @fileoverview A class representing a canvas group where new shapes
 * can be created.
 */

goog.provide('xrx.canvas.GroupShapeCreate');



goog.require('goog.dom.DomHelper');
goog.require('xrx.canvas.Group');
goog.require('xrx.canvas.GroupBackground');
goog.require('xrx.canvas.GroupHandler');



/**
 * A class representing a canvas group where new shapes can be created.
 * @param {xrx.canvas.Canvas} canvas A canvas object.
 * @constructor
 * @extends xrx.canvas.Group
 */
xrx.canvas.GroupShapeCreate = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.canvas.GroupShapeCreate, xrx.canvas.Group);



/**
 * @private
 */
xrx.canvas.GroupShapeCreate.prototype.registerEvents_ = function() {
  this.registerMouseZoom(this.element_, xrx.canvas.GroupHandler);
  this.registerMouseRotate(this.element_, xrx.canvas.GroupHandler);
};
