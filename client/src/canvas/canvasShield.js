/**
 * @fileoverview A class representing a canvas shield.
 */

goog.provide('xrx.canvas.Shield');



goog.require('xrx.graphics.Graphics');



/**
 * A class representing a canvas shield. A canvas shield keeps
 * the different canvas groups separated, useful for sane mouse
 * event handling.
 * @see xrx.canvas.GroupBackground
 * @see xrx.canvas.GroupShape
 * @see xrx.canvas.GroupShapeModify
 * @see xrx.canvas.GroupShapeCreate
 * @constructor
 */
xrx.canvas.Shield = function(canvas) {

  /**
   * The DOM element acting as a shield.
   * @type {DOMElement}
   * @private
   */
  this.element_;

  /**
   * The canvas.
   * @type {xrx.canvas.Canvas}
   * @private
   */
  this.canvas_ = canvas;

  this.create_();
};



/**
 * Returns the DOM element of the shield.
 * @return {DOMElement} The DOM element.
 */
xrx.canvas.Shield.prototype.getElement = function() {
  return this.element_;
};



/**
 * Activates a shield. All other shields of the canvas are
 * deactivated beforehand.
 */
xrx.canvas.Shield.prototype.activate = function() {
  this.canvas_.shieldsDeactivate();
  this.element_.setAttribute('width', '100%');
  this.element_.setAttribute('height', '100%');
};



/**
 * Deactivates a shield.
 */
xrx.canvas.Shield.prototype.deactivate = function() {
  this.element_.setAttribute('width', '0px');
  this.element_.setAttribute('height', '0px');
};



/**
 * @private
 */
xrx.canvas.Shield.prototype.create_ = function() {
  var graphics = this.canvas_.getGraphics();
  var shield = graphics.Element.createNS('rect');
  graphics.Element.setProperties(shield, {
    'width': '0px',
    'height': '0px',
    'style': 'fill-opacity:0.0',
    'class': 'xrx-canvas-shield'
  });
  this.element_ = shield;
};

