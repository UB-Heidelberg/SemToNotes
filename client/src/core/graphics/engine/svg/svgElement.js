/**
 * @fileoverview SVG super class.
 */

goog.provide('xrx.svg.Element');



/**
 * SVG super class.
 * @param {SVGElement} element An SVG element.
 * @constructor
 */
xrx.svg.Element = function(element) {

  /**
   * The SVG element.
   * @type {SVGElement}
   */
  this.element_ = element;
};



/**
 * Returns the SVG element.
 * @return {SVGElement} The SVG element.
 */
xrx.svg.Element.prototype.getElement = function() {
  return this.element_;
};
