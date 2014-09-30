***REMOVED***
***REMOVED*** @fileoverview A class representing operations on binary expressions.
***REMOVED***

goog.provide('xrx.xpath.BinaryExpr');

goog.require('xrx.xpath.DataType');
goog.require('xrx.xpath.Expr');
goog.require('xrx.node');



xrx.xpath.BinaryExpr = function(op, left, right) {
  var opCast =***REMOVED*****REMOVED*** @type {!xrx.xpath.BinaryExpr.Op_}***REMOVED*** (op);
  xrx.xpath.Expr.call(this, opCast.dataType_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {!xrx.xpath.BinaryExpr.Op_}
 ***REMOVED*****REMOVED***
  this.op_ = opCast;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {!xrx.xpath.Expr}
 ***REMOVED*****REMOVED***
  this.left_ = left;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {!xrx.xpath.Expr}
 ***REMOVED*****REMOVED***
  this.right_ = right;

  this.setNeedContextPosition(left.doesNeedContextPosition() ||
      right.doesNeedContextPosition());
  this.setNeedContextNode(left.doesNeedContextNode() ||
      right.doesNeedContextNode());

  // Optimize [@id="foo"] and [@name="bar"]
  if (this.op_ == xrx.xpath.BinaryExpr.Op.EQUAL) {
    if (!right.doesNeedContextNode() && !right.doesNeedContextPosition() &&
        right.getDataType() != xrx.xpath.DataType.NODESET &&
        right.getDataType() != xrx.xpath.DataType.VOID && left.getQuickAttr()) {
      this.setQuickAttr({
        name: left.getQuickAttr().name,
        valueExpr: right});
    } else if (!left.doesNeedContextNode() && !left.doesNeedContextPosition() &&
        left.getDataType() != xrx.xpath.DataType.NODESET &&
        left.getDataType() != xrx.xpath.DataType.VOID && right.getQuickAttr()) {
      this.setQuickAttr({
        name: right.getQuickAttr().name,
        valueExpr: left});
    }
  }
***REMOVED***
goog.inherits(xrx.xpath.BinaryExpr, xrx.xpath.Expr);


***REMOVED***
***REMOVED*** Performs comparison between the left hand side and the right hand side.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {function((string|number|boolean), (string|number|boolean))}
***REMOVED***        comp A comparison function that takes two parameters.
***REMOVED*** @param {!xrx.xpath.Expr} lhs The left hand side of the expression.
***REMOVED*** @param {!xrx.xpath.Expr} rhs The right hand side of the expression.
***REMOVED*** @param {!xrx.xpath.Context} ctx The context to perform the comparison in.
***REMOVED*** @param {boolean=} opt_equChk Whether the comparison checks for equality.
***REMOVED*** @return {boolean} True if comp returns true, false otherwise.
***REMOVED***
xrx.xpath.BinaryExpr.compare_ = function(comp, lhs, rhs, ctx, opt_equChk) {
  var left = lhs.evaluate(ctx);
  var right = rhs.evaluate(ctx);
  var lIter, rIter, lNode, rNode;
  if (left instanceof xrx.xpath.NodeSet && right instanceof xrx.xpath.NodeSet) {
    lIter = left.iterator();
    for (lNode = lIter.next(); lNode; lNode = lIter.next()) {
      rIter = right.iterator();
      for (rNode = rIter.next(); rNode; rNode = rIter.next()) {
        if (comp(lNode.getValueAsString(),
            rNode.getValueAsString())) {
          return true;
        }
      }
    }
    return false;
  }
  if ((left instanceof xrx.xpath.NodeSet) ||
      (right instanceof xrx.xpath.NodeSet)) {
    var nodeset, primitive;
    if ((left instanceof xrx.xpath.NodeSet)) {
      nodeset = left, primitive = right;
    } else {
      nodeset = right, primitive = left;
    }
    var iter = nodeset.iterator();
    var type = typeof primitive;
    for (var node = iter.next(); node; node = iter.next()) {
      var stringValue;
      switch (type) {
        case 'number':
          stringValue = node.getValueAsNumber();
          break;
        case 'boolean':
          stringValue = node.getValueAsBool();
          break;
        case 'string':
          stringValue = node.getValueAsString();
          break;
        default:
          throw Error('Illegal primitive type for comparison.');
      }
      if (comp(stringValue,
         ***REMOVED*****REMOVED*** @type {(string|number|boolean)}***REMOVED*** (primitive))) {
        return true;
      }
    }
    return false;
  }
  if (opt_equChk) {
    if (typeof left == 'boolean' || typeof right == 'boolean') {
      return comp(!!left, !!right);
    }
    if (typeof left == 'number' || typeof right == 'number') {
      return comp(+left, +right);
    }
    return comp(left, right);
  }
  return comp(+left, +right);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {(boolean|number)} The boolean or number result.
***REMOVED***
xrx.xpath.BinaryExpr.prototype.evaluate = function(ctx) {
  return this.op_.evaluate_(this.left_, this.right_, ctx);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.BinaryExpr.prototype.toString = function() {
  var text = 'Binary Expression: ' + this.op_;
  text += xrx.xpath.Expr.indent(this.left_);
  text += xrx.xpath.Expr.indent(this.right_);
  return text;
***REMOVED***



***REMOVED***
***REMOVED*** A binary operator.
***REMOVED***
***REMOVED*** @param {string} opString The operator string.
***REMOVED*** @param {number} precedence The precedence when evaluated.
***REMOVED*** @param {!xrx.xpath.DataType} dataType The dataType to return when evaluated.
***REMOVED*** @param {function(!xrx.xpath.Expr, !xrx.xpath.Expr, !xrx.xpath.Context)}
***REMOVED***         evaluate An evaluation function.
***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.xpath.BinaryExpr.Op_ = function(opString, precedence, dataType, evaluate) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.opString_ = opString;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.precedence_ = precedence;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {!xrx.xpath.DataType}
 ***REMOVED*****REMOVED***
  this.dataType_ = dataType;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {function(!xrx.xpath.Expr, !xrx.xpath.Expr, !xrx.xpath.Context)}
 ***REMOVED*****REMOVED***
  this.evaluate_ = evaluate;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the precedence for the operator.
***REMOVED***
***REMOVED*** @return {number} The precedence.
***REMOVED***
xrx.xpath.BinaryExpr.Op_.prototype.getPrecedence = function() {
  return this.precedence_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.BinaryExpr.Op_.prototype.toString = function() {
  return this.opString_;
***REMOVED***


***REMOVED***
***REMOVED*** A mapping from operator strings to operator objects.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @type {!Object.<string, !xrx.xpath.BinaryExpr.Op>}
***REMOVED***
xrx.xpath.BinaryExpr.stringToOpMap_ = {***REMOVED***


***REMOVED***
***REMOVED*** Creates a binary operator.
***REMOVED***
***REMOVED*** @param {string} opString The operator string.
***REMOVED*** @param {number} precedence The precedence when evaluated.
***REMOVED*** @param {!xrx.xpath.DataType} dataType The dataType to return when evaluated.
***REMOVED*** @param {function(!xrx.xpath.Expr, !xrx.xpath.Expr, !xrx.xpath.Context)}
***REMOVED***         evaluate An evaluation function.
***REMOVED*** @return {!xrx.xpath.BinaryExpr.Op} A binary expression operator.
***REMOVED*** @private
***REMOVED***
xrx.xpath.BinaryExpr.createOp_ = function(opString, precedence, dataType,
    evaluate) {
  if (opString in xrx.xpath.BinaryExpr.stringToOpMap_) {
    throw new Error('Binary operator already created: ' + opString);
  }
  // The upcast and then downcast for the JSCompiler.
  var op =***REMOVED*****REMOVED*** @type {!Object}***REMOVED*** (new xrx.xpath.BinaryExpr.Op_(
      opString, precedence, dataType, evaluate));
  op =***REMOVED*****REMOVED*** @type {!xrx.xpath.BinaryExpr.Op}***REMOVED*** (op);
  xrx.xpath.BinaryExpr.stringToOpMap_[op.toString()] = op;
  return op;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the operator with this opString or null if none.
***REMOVED***
***REMOVED*** @param {string} opString The opString.
***REMOVED*** @return {!xrx.xpath.BinaryExpr.Op} The operator.
***REMOVED***
xrx.xpath.BinaryExpr.getOp = function(opString) {
  return xrx.xpath.BinaryExpr.stringToOpMap_[opString] || null;
***REMOVED***


***REMOVED***
***REMOVED*** Binary operator enumeration.
***REMOVED***
***REMOVED*** @enum {{getPrecedence: function(): number}}
***REMOVED***
xrx.xpath.BinaryExpr.Op = {
  DIV: xrx.xpath.BinaryExpr.createOp_('div', 6, xrx.xpath.DataType.NUMBER,
      function(left, right, ctx) {
        return left.asNumber(ctx) / right.asNumber(ctx);
      }),
  MOD: xrx.xpath.BinaryExpr.createOp_('mod', 6, xrx.xpath.DataType.NUMBER,
      function(left, right, ctx) {
        return left.asNumber(ctx) % right.asNumber(ctx);
      }),
  MULT: xrx.xpath.BinaryExpr.createOp_('*', 6, xrx.xpath.DataType.NUMBER,
      function(left, right, ctx) {
        return left.asNumber(ctx)***REMOVED*** right.asNumber(ctx);
      }),
  PLUS: xrx.xpath.BinaryExpr.createOp_('+', 5, xrx.xpath.DataType.NUMBER,
      function(left, right, ctx) {
        return left.asNumber(ctx) + right.asNumber(ctx);
      }),
  MINUS: xrx.xpath.BinaryExpr.createOp_('-', 5, xrx.xpath.DataType.NUMBER,
      function(left, right, ctx) {
        return left.asNumber(ctx) - right.asNumber(ctx);
      }),
  LESSTHAN: xrx.xpath.BinaryExpr.createOp_('<', 4, xrx.xpath.DataType.BOOLEAN,
      function(left, right, ctx) {
        return xrx.xpath.BinaryExpr.compare_(function(a, b) {return a < b;},
            left, right, ctx);
      }),
  GREATERTHAN: xrx.xpath.BinaryExpr.createOp_('>', 4, xrx.xpath.DataType.BOOLEAN,
      function(left, right, ctx) {
        return xrx.xpath.BinaryExpr.compare_(function(a, b) {return a > b;},
            left, right, ctx);
      }),
  LESSTHAN_EQUAL: xrx.xpath.BinaryExpr.createOp_(
      '<=', 4, xrx.xpath.DataType.BOOLEAN,
      function(left, right, ctx) {
        return xrx.xpath.BinaryExpr.compare_(function(a, b) {return a <= b;},
            left, right, ctx);
      }),
  GREATERTHAN_EQUAL: xrx.xpath.BinaryExpr.createOp_('>=', 4,
      xrx.xpath.DataType.BOOLEAN, function(left, right, ctx) {
        return xrx.xpath.BinaryExpr.compare_(function(a, b) {return a >= b;},
            left, right, ctx);
      }),
  EQUAL: xrx.xpath.BinaryExpr.createOp_('=', 3, xrx.xpath.DataType.BOOLEAN,
      function(left, right, ctx) {
        return xrx.xpath.BinaryExpr.compare_(function(a, b) {return a == b;},
            left, right, ctx, true);
      }),
  NOT_EQUAL: xrx.xpath.BinaryExpr.createOp_('!=', 3, xrx.xpath.DataType.BOOLEAN,
      function(left, right, ctx) {
        return xrx.xpath.BinaryExpr.compare_(function(a, b) {return a != b},
            left, right, ctx, true);
      }),
  AND: xrx.xpath.BinaryExpr.createOp_('and', 2, xrx.xpath.DataType.BOOLEAN,
      function(left, right, ctx) {
        return left.asBool(ctx) && right.asBool(ctx);
      }),
  OR: xrx.xpath.BinaryExpr.createOp_('or', 1, xrx.xpath.DataType.BOOLEAN,
      function(left, right, ctx) {
        return left.asBool(ctx) || right.asBool(ctx);
      })
***REMOVED***
