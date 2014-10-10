***REMOVED***
***REMOVED*** @fileoverview A class representing operations on unary expressions.
***REMOVED***

goog.provide('xrx.xpath.UnaryExpr');

goog.require('xrx.xpath.DataType');
goog.require('xrx.xpath.Expr');



***REMOVED***
***REMOVED*** Constructor for UnaryExpr.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Expr} expr The unary expression.
***REMOVED*** @extends {xrx.xpath.Expr}
***REMOVED***
***REMOVED***
xrx.xpath.UnaryExpr = function(expr) {
  xrx.xpath.Expr.call(this, xrx.xpath.DataType.NUMBER);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {!xrx.xpath.Expr}
 ***REMOVED*****REMOVED***
  this.expr_ = expr;

  this.setNeedContextPosition(expr.doesNeedContextPosition());
  this.setNeedContextNode(expr.doesNeedContextNode());
***REMOVED***
goog.inherits(xrx.xpath.UnaryExpr, xrx.xpath.Expr);


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {number} The number result.
***REMOVED***
xrx.xpath.UnaryExpr.prototype.evaluate = function(ctx) {
  return -this.expr_.asNumber(ctx);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.UnaryExpr.prototype.toString = function() {
  return 'Unary Expression: -' + xrx.xpath.Expr.indent(this.expr_);
***REMOVED***
