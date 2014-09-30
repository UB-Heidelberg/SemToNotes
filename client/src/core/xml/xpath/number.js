***REMOVED***
***REMOVED*** @fileoverview A class representing number literals.
***REMOVED***

goog.provide('xrx.xpath.Number');

goog.require('xrx.xpath.Expr');



***REMOVED***
***REMOVED*** Constructs a number expression.
***REMOVED***
***REMOVED*** @param {number} value The number value.
***REMOVED***
***REMOVED*** @extends {xrx.xpath.Expr}
***REMOVED***
xrx.xpath.Number = function(value) {
  xrx.xpath.Expr.call(this, xrx.xpath.DataType.NUMBER);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***
goog.inherits(xrx.xpath.Number, xrx.xpath.Expr);


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {number} The number result.
***REMOVED***
xrx.xpath.Number.prototype.evaluate = function(ctx) {
  return this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.Number.prototype.toString = function() {
  return 'Number: ' + this.value_;
***REMOVED***
