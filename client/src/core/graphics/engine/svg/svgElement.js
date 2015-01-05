/**
 * @fileoverview SVG super class.
 */

goog.provide('xrx.svg.Element');



/**
 * SVG super class.
 * @param {Element} element A SVG element.
 * @constructor
 */
xrx.svg.Element = function(element) {

  /**
   * The SVG element.
   * @type {Element}
   */
  this.element_ = element;
};



/**
 * Returns the SVG element.
 * @return {Element} The SVG element.
 */
xrx.svg.Element.prototype.getElement = function() {
  return this.element_;
};
