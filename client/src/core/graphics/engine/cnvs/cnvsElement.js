/**
 * @fileoverview Canvas super class.
 */

goog.provide('xrx.canvas.Element');



goog.require('xrx.cnvs');



/**
 * Canvas super class.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.canvas.Element = function(canvas) {

  /**
   * The parent canvas object.
   * @type {xrx.canvas.Canvas}
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
 * @return {xrx.canvas.Canvas} The parent canvas object.
 */
xrx.canvas.Element.prototype.getCanvas = function() {
  return this.canvas_;
};



/**
 * Returns the HTML canvas rendering context.
 * @return {CanvasRenderingContext2D} The rendering context.
 */
xrx.canvas.Element.prototype.getContext = function() {
  return this.context_;
};
