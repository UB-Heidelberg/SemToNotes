***REMOVED***
***REMOVED*** @fileoverview A class representing operations on filter expressions.
***REMOVED***

goog.provide('xrx.xpath.FilterExpr');

goog.require('xrx.xpath.Expr');



***REMOVED***
***REMOVED*** Constructor for FilterExpr.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Expr} primary The primary expression.
***REMOVED*** @param {!xrx.xpath.Predicates} predicates The predicates.
***REMOVED*** @extends {xrx.xpath.Expr}
***REMOVED***
***REMOVED***
xrx.xpath.FilterExpr = function(primary, predicates) {
  if (predicates.getLength() && primary.getDataType() !=
      xrx.xpath.DataType.NODESET) {
    throw Error('Primary expression must evaluate to nodeset ' +
        'if filter has predicate(s).');
  }
  xrx.xpath.Expr.call(this, primary.getDataType());

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!xrx.xpath.Expr}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.primary_ = primary;


 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!xrx.xpath.Predicates}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.predicates_ = predicates;

  this.setNeedContextPosition(primary.doesNeedContextPosition());
  this.setNeedContextNode(primary.doesNeedContextNode());
***REMOVED***
goog.inherits(xrx.xpath.FilterExpr, xrx.xpath.Expr);


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {!xrx.xpath.NodeSet} The nodeset result.
***REMOVED***
xrx.xpath.FilterExpr.prototype.evaluate = function(ctx) {
  var result = this.primary_.evaluate(ctx);
  return this.predicates_.evaluatePredicates(
     ***REMOVED*****REMOVED*** @type {!xrx.xpath.NodeSet}***REMOVED*** (result));
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.FilterExpr.prototype.toString = function() {
  var text = 'Filter:';
  text += xrx.xpath.Expr.indent(this.primary_);
  text += xrx.xpath.Expr.indent(this.predicates_);
  return text;
***REMOVED***
