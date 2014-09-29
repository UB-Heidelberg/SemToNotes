***REMOVED***
***REMOVED*** @fileoverview A class representing operations on path expressions.
***REMOVED***

goog.provide('xrx.xpath.PathExpr');


goog.require('goog.array');
goog.require('xrx.node');
goog.require('xrx.xpath.DataType');
goog.require('xrx.xpath.Expr');
goog.require('xrx.xpath.NodeSet');



***REMOVED***
***REMOVED*** Constructor for PathExpr.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Expr} filter A filter expression.
***REMOVED*** @param {!Array.<!xrx.xpath.Step>} steps The steps in the location path.
***REMOVED*** @extends {xrx.xpath.Expr}
***REMOVED***
***REMOVED***
xrx.xpath.PathExpr = function(filter, steps) {
  xrx.xpath.Expr.call(this, filter.getDataType());

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!xrx.xpath.Expr}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.filter_ = filter;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Array.<!xrx.xpath.Step>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.steps_ = steps;

  this.setNeedContextPosition(filter.doesNeedContextPosition());
  this.setNeedContextNode(filter.doesNeedContextNode());
  if (this.steps_.length == 1) {
    var firstStep = this.steps_[0];
    if (!firstStep.doesIncludeDescendants() &&
        firstStep.getAxis() == xrx.xpath.Step.Axis.ATTRIBUTE) {
      var test = firstStep.getTest();
      if (test.getName() != '*') {
        this.setQuickAttr({
          name: test.getName(),
          valueExpr: null
        });
      }
    }
  }
***REMOVED***
goog.inherits(xrx.xpath.PathExpr, xrx.xpath.Expr);



***REMOVED***
***REMOVED*** Constructor for RootHelperExpr.
***REMOVED***
***REMOVED*** @extends {xrx.xpath.Expr}
***REMOVED***
***REMOVED***
xrx.xpath.PathExpr.RootHelperExpr = function() {
  xrx.xpath.Expr.call(this, xrx.xpath.DataType.NODESET);
***REMOVED***
goog.inherits(xrx.xpath.PathExpr.RootHelperExpr, xrx.xpath.Expr);


***REMOVED***
***REMOVED*** Evaluates the root-node helper expression.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Context} ctx The context to evaluate the expression in.
***REMOVED*** @return {!xrx.xpath.NodeSet} The evaluation result.
***REMOVED***
xrx.xpath.PathExpr.RootHelperExpr.prototype.evaluate = function(ctx) {
  var nodeset = new xrx.xpath.NodeSet();
  var node = ctx.getNode();
  if (node.getType() === xrx.node.DOCUMENT) {
    nodeset.add(node);
  } else {
    nodeset.add(***REMOVED*** @type {!Node}***REMOVED*** (node.ownerDocument));
  }
  return nodeset;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.PathExpr.RootHelperExpr.prototype.toString = function() {
  return 'Root Helper Expression';
***REMOVED***



***REMOVED***
***REMOVED*** Constructor for ContextHelperExpr.
***REMOVED***
***REMOVED*** @extends {xrx.xpath.Expr}
***REMOVED***
***REMOVED***
xrx.xpath.PathExpr.ContextHelperExpr = function() {
  xrx.xpath.Expr.call(this, xrx.xpath.DataType.NODESET);
***REMOVED***
goog.inherits(xrx.xpath.PathExpr.ContextHelperExpr, xrx.xpath.Expr);


***REMOVED***
***REMOVED*** Evaluates the context-node helper expression.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Context} ctx The context to evaluate the expression in.
***REMOVED*** @return {!xrx.xpath.NodeSet} The evaluation result.
***REMOVED***
xrx.xpath.PathExpr.ContextHelperExpr.prototype.evaluate = function(ctx) {
  var nodeset = new xrx.xpath.NodeSet();
  nodeset.add(ctx.getNode());
  return nodeset;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.PathExpr.ContextHelperExpr.prototype.toString = function() {
  return 'Context Helper Expression';
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the token is a valid PathExpr operator.
***REMOVED***
***REMOVED*** @param {string} token The token to be checked.
***REMOVED*** @return {boolean} Whether the token is a valid operator.
***REMOVED***
xrx.xpath.PathExpr.isValidOp = function(token) {
  return token == '/' || token == '//';
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {!xrx.xpath.NodeSet} The nodeset result.
***REMOVED***
xrx.xpath.PathExpr.prototype.evaluate = function(ctx) {
  var nodeset = this.filter_.evaluate(ctx);
  if (!(nodeset instanceof xrx.xpath.NodeSet)) {
    throw Error('Filter expression must evaluate to nodeset.');
  }
  var steps = this.steps_;
  for (var i = 0, l0 = steps.length; i < l0 && nodeset.getLength(); i++) {
    var step = steps[i];
    var reverse = step.getAxis().isReverse();
    var iter = nodeset.iterator(reverse);
    nodeset = null;
    var node, next;
    if (!step.doesNeedContextPosition() &&
        step.getAxis() == xrx.xpath.Step.Axis.FOLLOWING) {
      for (node = iter.next(); next = iter.next(); node = next) {
        if (node.contains && !node.contains(next)) {
          break;
        } else {
          if (!(next.compareDocumentPosition(***REMOVED*** @type {!Node}***REMOVED*** (node)) &
              8)) {
            break;
          }
        }
      }
      nodeset = step.evaluate(new
          xrx.xpath.Context(***REMOVED*** @type {xrx.node}***REMOVED*** (node)));
    } else if (!step.doesNeedContextPosition() &&
        step.getAxis() == xrx.xpath.Step.Axis.PRECEDING) {
      node = iter.next();
      nodeset = step.evaluate(new
          xrx.xpath.Context(***REMOVED*** @type {xrx.node}***REMOVED*** (node)));
    } else {
      node = iter.next();
      nodeset = step.evaluate(new
          xrx.xpath.Context(***REMOVED*** @type {xrx.node}***REMOVED*** (node)));
      while ((node = iter.next()) != null) {
        var result = step.evaluate(new
            xrx.xpath.Context(***REMOVED*** @type {xrx.node}***REMOVED*** (node)));
        nodeset = xrx.xpath.NodeSet.merge(nodeset, result);
      }
    }
  }
  return***REMOVED*****REMOVED*** @type {!xrx.xpath.NodeSet}***REMOVED*** (nodeset);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.PathExpr.prototype.toString = function() {
  var text = 'Path Expression:';
  text += xrx.xpath.Expr.indent(this.filter_);
  if (this.steps_.length) {
    var steps = goog.array.reduce(this.steps_, function(prev, curr) {
      return prev + xrx.xpath.Expr.indent(curr);
    }, 'Steps:');
    text += xrx.xpath.Expr.indent(steps);
  }
  return text;
***REMOVED***
