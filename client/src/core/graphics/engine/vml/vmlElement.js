/**
 * @fileoverview VML super class.
 */

goog.provide('xrx.vml.Element');



goog.require('xrx.engine.Element');
goog.require('xrx.vml');



/**
 * VML super class.
 * @param {Raphael} raphael A Raphael object.
 * @constructor
 */
xrx.vml.Element = function(raphael) {

  goog.base(this);

  /**
   * The Raphael object.
   * @type {Raphael}
   */
  this.raphael_ = raphael;
};
goog.inherits(xrx.vml.Element, xrx.engine.Element);



/**
 * Returns the Raphael object.
 * @return {Raphael} The Raphael object.
 */
xrx.vml.Element.prototype.getRaphael = function() {
  return this.raphael_;
};



/**
 * Returns the HTML element held by the Raphael object.
 * @return {HTMLElement} The HTML element.
 */
xrx.vml.Element.prototype.getElement = function() {
  return this.raphael_.canvas || this.raphael_.node;
};



xrx.vml.Element.prototype.applyTransform = function(matrix) {
  if (!matrix) return;
  this.raphael_.transform(['m', matrix.m00_, matrix.m10_, matrix.m01_,
        matrix.m11_, matrix.m02_, matrix.m12_]);
};
