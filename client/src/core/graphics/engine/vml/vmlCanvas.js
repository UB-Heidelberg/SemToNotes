/**
 * @fileoverview VML rendering class representing a canvas.
 */

goog.provide('xrx.vml.Canvas');



goog.require('goog.dom.DomHelper');
goog.require('goog.style');
goog.require('xrx.vml.Raphael');
goog.require('xrx.vml.Container');



/**
 * VML rendering class representing a canvas.
 * @param
 * @constructor
 * @extends xrx.vml.Element
 */
xrx.vml.Canvas = function(element) {

  goog.base(this, element);

  /**
   * The canvas width.
   * @type {number}
   */
  this.width_ = 0;

  /**
   * The canvas height.
   * @type {number}
   */
  this.height_ = 0;
};
goog.inherits(xrx.vml.Canvas, xrx.vml.Container);



/**
 * Returns the root element of this canvas to be used as
 * the event target.
 * @return {Object} The event target element.
 */
xrx.vml.Canvas.prototype.getEventTarget = function() {
  return this.element_;
};



/**
 * Returns the width of the canvas.
 * @return {number} The width.
 */
xrx.vml.Canvas.prototype.getWidth = function() {
  return this.width_;
};



/**
 * Sets the width of the canvas.
 * @param {number} width the width.
 */
xrx.vml.Canvas.prototype.setWidth = function(width) {
  this.width_ = width;
  goog.style.setSize(this.element_, width, this.height_);
};



/**
 * Returns the height of the canvas.
 * @return {number} The height.
 */
xrx.vml.Canvas.prototype.getHeight = function() {
  return this.height_;
};



/**
 * Sets the height of the canvas.
 * @param {number} width the height.
 */
xrx.vml.Canvas.prototype.setHeight = function(height) {
  this.height_ = height;
  goog.style.setSize(this.element_, this.width_, height);
};


xrx.vml.Canvas.prototype.startDrawing = function() {
};



xrx.vml.Canvas.prototype.finishDrawing = function() {
};



/**
 * Creates a new canvas.
 * @param {HTMLElement} parent The parent HTML element to which the canvas
 *     shall be appended.
 */
xrx.vml.Canvas.create = function(parent) {
  var element = goog.dom.createElement('div');
  var canvas = new xrx.vml.Canvas(element);
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
};
