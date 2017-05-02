/**
 * @fileoverview A class representing operations on filter expressions.
 */

goog.provide('xrx.xpath.FilterExpr');

goog.require('xrx.xpath.Expr');



/**
 * Constructor for FilterExpr.
 *
 * @param {!xrx.xpath.Expr} primary The primary expression.
 * @param {!xrx.xpath.Predicates} predicates The predicates.
 * @extends {xrx.xpath.Expr}
 * @constructor
 */
xrx.xpath.FilterExpr = function(primary, predicates) {
  if (predicates.getLength() && primary.getDataType() !=
      xrx.xpath.DataType.NODESET) {
    throw Error('Primary expression must evaluate to nodeset ' +
        'if filter has predicate(s).');
  }
  xrx.xpath.Expr.call(this, primary.getDataType());

  /**
   * @type {!xrx.xpath.Expr}
   * @private
   */
  this.primary_ = primary;


  /**
   * @type {!xrx.xpath.Predicates}
   * @private
   */
  this.predicates_ = predicates;

  this.setNeedContextPosition(primary.doesNeedContextPosition());
  this.setNeedContextNode(primary.doesNeedContextNode());
};
goog.inherits(xrx.xpath.FilterExpr, xrx.xpath.Expr);



/**
 * Returns the primary expression of this filter expression.
 * @return {?xrx.xpath.Expr} The primary expression.
 */
xrx.xpath.FilterExpr.prototype.getPrimary = function() {
  return this.primary_;
};



/**
 * Returns the predicate expressions of this filter expression.
 * @return {Array<xrx.xpath.Expr>} The primary expressions.
 */
xrx.xpath.FilterExpr.prototype.getPredicates = function() {
  return this.predicates_;
};



/**
 * @override
 * @return {!xrx.xpath.NodeSet} The nodeset result.
 */
xrx.xpath.FilterExpr.prototype.evaluate = function(ctx) {
  var result = this.primary_.evaluate(ctx);
  return this.predicates_.evaluatePredicates(
      /** @type {!xrx.xpath.NodeSet} */ (result));
};


/**
 * @override
 */
xrx.xpath.FilterExpr.prototype.toString = function() {
  var text = 'Filter:';
  text += xrx.xpath.Expr.indent(this.primary_);
  text += xrx.xpath.Expr.indent(this.predicates_);
  return text;
};
