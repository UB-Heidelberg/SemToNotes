***REMOVED***
***REMOVED*** @fileoverview An abstract class representing expressions with predicates.
***REMOVED***     baseExprWithPredictes are immutable objects that evaluate their
***REMOVED***     predicates against nodesets and return the modified nodesets.
***REMOVED***
***REMOVED***


goog.provide('xrx.xpath.Predicates');

goog.require('goog.array');
goog.require('xrx.xpath.Context');
goog.require('xrx.xpath.Expr');



***REMOVED***
***REMOVED*** An abstract class for expressions with predicates.
***REMOVED***
***REMOVED***
***REMOVED*** @param {!Array.<!xrx.xpath.Expr>} predicates The array of predicates.
***REMOVED*** @param {boolean=} opt_reverse Whether to iterate over the nodeset in reverse.
***REMOVED***
xrx.xpath.Predicates = function(predicates, opt_reverse) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of predicates
  ***REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {!Array.<!xrx.xpath.Expr>}
 ***REMOVED*****REMOVED***
  this.predicates_ = predicates;


 ***REMOVED*****REMOVED***
  ***REMOVED*** Which direction to iterate over the predicates
  ***REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.reverse_ = !!opt_reverse;
***REMOVED***


***REMOVED***
***REMOVED*** Evaluates the predicates against the given nodeset.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.NodeSet} nodeset The nodes against which to evaluate
***REMOVED***     the predicates.
***REMOVED*** @param {number=} opt_start The index of the first predicate to evaluate,
***REMOVED***     defaults to 0.
***REMOVED*** @return {!xrx.xpath.NodeSet} nodeset The filtered nodeset.
***REMOVED***
xrx.xpath.Predicates.prototype.evaluatePredicates =
    function(nodeset, opt_start) {
  for (var i = opt_start || 0; i < this.predicates_.length; i++) {
    var predicate = this.predicates_[i];
    var iter = nodeset.iterator();
    var l = nodeset.getLength();
    var node;
    for (var j = 0; node = iter.next(); j++) {
      var position = this.reverse_ ? (l - j) : (j + 1);
      var exrs = predicate.evaluate(new
          xrx.xpath.Context(***REMOVED*** @type {xrx.node}***REMOVED*** (node), position, l));
      var keep;
      if (typeof exrs == 'number') {
        keep = (position == exrs);
      } else if (typeof exrs == 'string' || typeof exrs == 'boolean') {
        keep = !!exrs;
      } else if (exrs instanceof xrx.xpath.NodeSet) {
        keep = (exrs.getLength() > 0);
      } else {
        throw Error('Predicate.evaluate returned an unexpected type.');
      }
      if (!keep) {
        iter.remove();
      }
    }
  }
  return nodeset;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the quickAttr info.
***REMOVED***
***REMOVED*** @return {?{name: string, valueExpr: xrx.xpath.Expr}}
***REMOVED***
xrx.xpath.Predicates.prototype.getQuickAttr = function() {
  return this.predicates_.length > 0 ?
      this.predicates_[0].getQuickAttr() : null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether this set of predicates needs context position.
***REMOVED***
***REMOVED*** @return {boolean} Whether something needs context position.
***REMOVED***
xrx.xpath.Predicates.prototype.doesNeedContextPosition = function() {
  for (var i = 0; i < this.predicates_.length; i++) {
    var predicate = this.predicates_[i];
    if (predicate.doesNeedContextPosition() ||
        predicate.getDataType() == xrx.xpath.DataType.NUMBER ||
        predicate.getDataType() == xrx.xpath.DataType.VOID) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the length of this set of predicates.
***REMOVED***
***REMOVED*** @return {number} The number of expressions.
***REMOVED***
xrx.xpath.Predicates.prototype.getLength = function() {
  return this.predicates_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the set of predicates.
***REMOVED***
***REMOVED*** @return {!Array.<!xrx.xpath.Expr>} The predicates.
***REMOVED***
xrx.xpath.Predicates.prototype.getPredicates = function() {
  return this.predicates_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.Predicates.prototype.toString = function() {
  return goog.array.reduce(this.predicates_, function(prev, curr) {
    return prev + xrx.xpath.Expr.indent(curr);
  }, 'Predicates:');
***REMOVED***
