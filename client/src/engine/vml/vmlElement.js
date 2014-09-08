***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.vml.Element');



goog.require('goog.math.AffineTransform');
goog.require('goog.style');
goog.require('xrx.vml');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.vml.Element = function(raphael) {

  this.raphael_ = raphael;

  this.transform_ = new goog.math.AffineTransform();
***REMOVED***



xrx.vml.Element.prototype.getRaphael = function() {
  return this.raphael_;
***REMOVED***



xrx.vml.Element.prototype.getGraphic = function() {
  return this.graphic_;
***REMOVED***



xrx.vml.Element.prototype.getElement = function() {
  return this.raphael_.canvas || this.raphael_.node;
***REMOVED***
