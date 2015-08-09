/**
 * @fileoverview Canvas rendering class representing a canvas.
 */

goog.provide('xrx.canvas.Canvas');



goog.require('goog.dom.DomHelper');



/**
 * Canvas rendering class representing a canvas.
 * @param {HTMLCanvasElement} element The HTML canvas element.
 * @constructor
 */
xrx.canvas.Canvas = function(element) {

  /**
   * The rendering context.
   * @type {CanvasRenderingContext2D}
   */
  this.context_ = element.getContext('2d');

  /**
   * The HTML canvas element.
   * @type {HTMLCanvasElement}
   */
  this.element_ = element;

  /**
   * The child elements of the canvas.
   * @type {xrx.canvas.Element}
   */
  this.childs_ = [];

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



/**
 * Returns the HTML canvas element.
 * @return {HTMLCanvasElement} The HTML canvas element.
 */
xrx.canvas.Canvas.prototype.getElement = function() {
  return this.element_;
};



xrx.canvas.Canvas.prototype.getEventTarget = function() {
  return this.element_;
};



/**
 * Returns the width of the canvas.
 * @return {number} The width.
 */
xrx.canvas.Canvas.prototype.getWidth = function() {
  return this.width_;
};



/**
 * Sets the width of the canvas.
 * @param {number} width the width.
 */
xrx.canvas.Canvas.prototype.setWidth = function(width) {
  this.width_ = width;
  this.element_.setAttribute('width', width);
};



/**
 * Returns the height of the canvas.
 * @return {number} The height.
 */
xrx.canvas.Canvas.prototype.getHeight = function() {
  return this.height_;
};



/**
 * Sets the height of the canvas.
 * @param {number} width the height.
 */
xrx.canvas.Canvas.prototype.setHeight = function(height) {
  this.height_ = height;
  this.element_.setAttribute('height', height);
};



/**
 * Adds a child element to the canvas.
 * @param {Object} element The child element.
 */
xrx.canvas.Canvas.prototype.addChild = function(element) {
  this.childs_.push(element);
};



/**
 * Creates a new canvas.
 * @param {Element} parent The parent HTML element to which the canvas
 *     shall be appended.
 */
xrx.canvas.Canvas.create = function(parent) {
  var element = goog.dom.createElement('canvas');
  var canvas = new xrx.canvas.Canvas(element);
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
};
