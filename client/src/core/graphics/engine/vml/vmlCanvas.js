/**
 * @fileoverview VML rendering class representing a canvas.
 */

goog.provide('xrx.vml.Canvas');



goog.require('goog.dom.DomHelper');
goog.require('goog.style');
goog.require('xrx.vml.Raphael');
goog.require('xrx.vml.Element');



/**
 * VML rendering class representing a canvas.
 * @param {Raphael} raphael The Raphael object.
 * @constructor
 * @extends xrx.vml.Element
 */
xrx.vml.Canvas = function(raphael) {

  goog.base(this, raphael);

  /**
   * The child elements of the canvas.
   * @type {xrx.vml.Element}
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

  this.shield_;
};
goog.inherits(xrx.vml.Canvas, xrx.vml.Element);



xrx.vml.Canvas.prototype.getEventTarget = function() {
  return goog.dom.getParentElement(this.raphael_.canvas);
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
  this.raphael_.setSize(this.width_, this.height_);
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
  this.raphael_.setSize(this.width_, this.height_);
};



/**
 * Adds a child element to the canvas.
 * @param {Object} element The child element.
 */
xrx.vml.Canvas.prototype.addChild = function(element) {
  goog.dom.append(this.getElement(), element.getElement());
  element.draw();
};



/**
 * Creates a new canvas.
 * @param {Element} parent The parent HTML element to which the canvas
 *     shall be appended.
 */
xrx.vml.Canvas.create = function(parent) {
  var element = goog.dom.createElement('div');
  var raphael = xrx.vml.Raphael(element, 0, 0);
  var canvas = new xrx.vml.Canvas(raphael);
  goog.dom.appendChild(parent, canvas.getElement());
  return canvas;
};
