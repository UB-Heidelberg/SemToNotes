/**
 * @fileoverview Canvas super class.
 */

goog.provide('xrx.cnvs.Element');



goog.require('xrx.cnvs');



/**
 * Canvas super class.
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.cnvs.Element = function(canvas) {

  /**
   * The parent canvas object.
   * @type {xrx.cnvs.Canvas}
   */
  this.canvas_ = canvas;

  /**
   * The rendering context.
   * @type {CanvasRenderingContext2D}
   */
  this.context_ = canvas.getElement().getContext('2d');
};



/**
 * Returns the parent canvas object.
 * @return {xrx.cnvs.Canvas} The parent canvas object.
 */
xrx.cnvs.Element.prototype.getCanvas = function() {
  return this.canvas_;
};



/**
 * Returns the HTML canvas rendering context.
 * @return {CanvasRenderingContext2D} The rendering context.
 */
xrx.cnvs.Element.prototype.getContext = function() {
  return this.context_;
};
