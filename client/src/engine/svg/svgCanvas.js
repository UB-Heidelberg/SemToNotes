/**
 * @fileoverview SVG rendering class representing a canvas.
 */

goog.provide('xrx.svg.Canvas');



goog.require('goog.dom.DomHelper');
goog.require('xrx.svg');
goog.require('xrx.svg.Element');



/**
 * SVG rendering class representing a canvas.
 * @param {SVGElement} element The SVG element.
 * @constructor
 * @extends xrx.svg.Element
 */
xrx.svg.Canvas = function(element) {

  goog.base(this, element);

  /**
   * The child elements of the canvas.
   * @type {xrx.svg.Element}
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
goog.inherits(xrx.svg.Canvas, xrx.svg.Element);



/**
 * Returns the width of the canvas.
 * @return {number} The width.
 */
xrx.svg.Canvas.prototype.getWidth = function() {
  return this.width_;
};



/**
 * Sets the width of the canvas.
 * @param {number} width the width.
 */
xrx.svg.Canvas.prototype.setWidth = function(width) {
  this.width_ = width;
  this.element_.setAttribute('width', width);
};



/**
 * Returns the height of the canvas.
 * @return {number} The height.
 */
xrx.svg.Canvas.prototype.getHeight = function() {
  return this.height_;
};



/**
 * Sets the height of the canvas.
 * @param {number} width the height.
 */
xrx.svg.Canvas.prototype.setHeight = function(height) {
  this.height_ = height;
  this.element_.setAttribute('height', height);
};



/**
 * Adds a child element to the canvas.
 * @param {Object} element The child element.
 */
xrx.svg.Canvas.prototype.addChild = function(element) {
  goog.dom.append(this.element_, element.getElement());
  element.draw();
};



/**
 * Creates a new canvas.
 * @param {Element} parent The parent HTML element to which the canvas
 *     shall be appended.
 */
xrx.svg.Canvas.create = function(parent) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'svg');
  var canvas = new xrx.svg.Canvas(element);
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
};
