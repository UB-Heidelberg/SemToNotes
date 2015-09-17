/**
 * @fileoverview A class representing an engine-independent
 * graphic canvas.
 */

goog.provide('xrx.shape.Canvas');



goog.require('xrx.engine');
goog.require('xrx.shape.Container');
goog.require('xrx.engine.Engines');



/**
 * A class representing an engine-independent graphic canvas.
 * @param {HTMLElement} element The HTML element to create
 *   the canvas.
 * @param {(xrx.engine.CANVAS|xrx.engine.SVG|xrx.engine.VML)} engine
 *   Enumeration value representing the engine.
 * @constructor
 */
xrx.shape.Canvas = function(element, engine) {

  /**
   * HTML element to create the canvas.
   * @type {HTMLElement}
   */
  this.element_ = element;

  /**
   * Enumeration value representing the engine.
   */
  this.engine_ = engine;

  goog.base(this, this);
};
goog.inherits(xrx.shape.Canvas, xrx.shape.Container);



/**
 * Returns the HTML element on which the canvas was created.
 * @return {HTMLElement} The HTML element.
 */
xrx.shape.Canvas.prototype.getElement = function() {
  return this.element_;
};



/**
 * Returns the name of the rendering engine.
 * @return (xrx.engine.CANVAS|xrx.engine.SVG|xrx.engine.VML) The name.
 */
xrx.shape.Canvas.prototype.getEngine = function() {
  return this.engine_;
};



/**
 * Sets the height of the canvas.
 * @param {number} The height.
 */
xrx.shape.Canvas.prototype.setHeight = function(height) {
  this.engineElement_.setHeight(height);
};



/**
 * Sets the width of the canvas.
 * @param {number} The width.
 */
xrx.shape.Canvas.prototype.setWidth = function(width) {
  this.engineElement_.setWidth(width);
};



/**
 * Draws this canvas and all its containers and shapes contained.
 */
xrx.shape.Canvas.prototype.draw = function() {
  var children = this.childs_;
  for (var i = 0, len = children.length; i < len; i++) {
    children[i].draw();
  }
};



/**
 * @private
 */
xrx.shape.Canvas.prototype.create_ = function() {
  this.engineElement_ = xrx[this.engine_].Canvas.create(this.element_);
};



/**
 * Creates a new canvas element.
 * @param {HTMLElement} element The HTML element on which the canvas
 *   shall be created.
 * @param {(xrx.engine.CANVAS|xrx.engine.SVG|xrx.engine.VML)} The
 *   name of the rendering engine.
 */
xrx.shape.Canvas.create = function(element, engine) {
  return new xrx.shape.Canvas(element, engine);
};
