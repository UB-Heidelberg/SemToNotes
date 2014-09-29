***REMOVED***
***REMOVED*** @fileoverview A class representing the string literals.
***REMOVED***

goog.provide('xrx.xpath.Literal');

goog.require('xrx.xpath.Expr');



***REMOVED***
***REMOVED*** Constructs a string literal expression.
***REMOVED***
***REMOVED*** @param {string} text The text value of the literal.
***REMOVED***
***REMOVED*** @extends {xrx.xpath.Expr}
***REMOVED***
xrx.xpath.Literal = function(text) {
  xrx.xpath.Expr.call(this, xrx.xpath.DataType.STRING);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.text_ = text.substring(1, text.length - 1);
***REMOVED***
goog.inherits(xrx.xpath.Literal, xrx.xpath.Expr);


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {string} The string result.
***REMOVED***
xrx.xpath.Literal.prototype.evaluate = function(context) {
  return this.text_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.Literal.prototype.toString = function() {
  return 'Literal: ' + this.text_;
***REMOVED***
