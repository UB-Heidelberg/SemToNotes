/**
 * @fileoverview VML super class.
 */

goog.provide('xrx.vml.Element');



goog.require('xrx.vml');



/**
 * VML super class.
 * @param {Object} raphael A Raphael object.
 * @constructor
 */
xrx.vml.Element = function(raphael) {

  /**
   * The Raphael object.
   * @type {Object}
   */
  this.raphael_ = raphael;
};



/**
 * Returns the Raphael object.
 * @return {Object} The Raphael object.
 */
xrx.vml.Element.prototype.getRaphael = function() {
  return this.raphael_;
};



/**
 * Returns the HTML element held by the Raphael object.
 * @return {Element} The HTML element.
 */
xrx.vml.Element.prototype.getElement = function() {
  return this.raphael_.canvas || this.raphael_.node;
};
