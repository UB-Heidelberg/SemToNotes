***REMOVED***
***REMOVED*** @fileoverview VML super class.
***REMOVED***

goog.provide('xrx.vml.Element');



goog.require('xrx.vml');



***REMOVED***
***REMOVED*** VML super class.
***REMOVED*** @param {Object} raphael A Raphael object.
***REMOVED***
***REMOVED***
xrx.vml.Element = function(raphael) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Raphael object.
  ***REMOVED*** @type {Object}
 ***REMOVED*****REMOVED***
  this.raphael_ = raphael;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the Raphael object.
***REMOVED*** @return {Object} The Raphael object.
***REMOVED***
xrx.vml.Element.prototype.getRaphael = function() {
  return this.raphael_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the HTML element held by the Raphael object.
***REMOVED*** @return {Element} The HTML element.
***REMOVED***
xrx.vml.Element.prototype.getElement = function() {
  return this.raphael_.canvas || this.raphael_.node;
***REMOVED***
