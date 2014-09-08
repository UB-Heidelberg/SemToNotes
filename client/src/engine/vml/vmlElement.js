/**
 * @fileoverview
 */

goog.provide('xrx.vml.Element');



goog.require('goog.math.AffineTransform');
goog.require('goog.style');
goog.require('xrx.vml');



/**
 * @constructor
 */
xrx.vml.Element = function(raphael) {

  this.raphael_ = raphael;

  this.transform_ = new goog.math.AffineTransform();
};



xrx.vml.Element.prototype.getRaphael = function() {
  return this.raphael_;
};



xrx.vml.Element.prototype.getGraphic = function() {
  return this.graphic_;
};



xrx.vml.Element.prototype.getElement = function() {
  return this.raphael_.canvas || this.raphael_.node;
};
