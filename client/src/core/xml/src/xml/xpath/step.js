***REMOVED***
***REMOVED*** @fileoverview Class for a step in a path expression.
***REMOVED***

goog.provide('xrx.xpath.Step');

goog.require('goog.array');
goog.require('xrx.xpath.DataType');
goog.require('xrx.xpath.Expr');
goog.require('xrx.xpath.KindTest');
goog.require('xrx.node');
goog.require('xrx.xpath.Predicates');



***REMOVED***
***REMOVED*** Class for a step in a path expression
***REMOVED*** http://www.w3.org/TR/xpath20/#id-steps.
***REMOVED***
***REMOVED*** @extends {xrx.xpath.Expr}
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Step.Axis} axis The axis for this Step.
***REMOVED*** @param {!xrx.xpath.NodeTest} test The test for this Step.
***REMOVED*** @param {!xrx.xpath.Predicates=} opt_predicates The predicates for this
***REMOVED***     Step.
***REMOVED*** @param {boolean=} opt_descendants Whether descendants are to be included in
***REMOVED***     this step ('//' vs '/').
***REMOVED***
xrx.xpath.Step = function(axis, test, opt_predicates, opt_descendants) {
  var axisCast =***REMOVED*****REMOVED*** @type {!xrx.xpath.Step.Axis_}***REMOVED*** (axis);
  xrx.xpath.Expr.call(this, xrx.xpath.DataType.NODESET);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!xrx.xpath.Step.Axis_}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.axis_ = axisCast;


 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!xrx.xpath.NodeTest}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.test_ = test;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!xrx.xpath.Predicates}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.predicates_ = opt_predicates || new xrx.xpath.Predicates([]);


 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether decendants are included in this step
  ***REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.descendants_ = !!opt_descendants;

  var quickAttrInfo = this.predicates_.getQuickAttr();
  if (axis.supportsQuickAttr_ && quickAttrInfo) {
    var attrName = quickAttrInfo.name;
    var attrValueExpr = quickAttrInfo.valueExpr;
    this.setQuickAttr({
      name: attrName,
      valueExpr: attrValueExpr
    });
  }
  this.setNeedContextPosition(this.predicates_.doesNeedContextPosition());
***REMOVED***
goog.inherits(xrx.xpath.Step, xrx.xpath.Expr);


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {!xrx.xpath.NodeSet} The nodeset result.
***REMOVED***
xrx.xpath.Step.prototype.evaluate = function(ctx) {
  var node = ctx.getNode();
  var nodeset = null;
  var quickAttr = this.getQuickAttr();
  var attrName = null;
  var attrValue = null;
  var pstart = 0;
  if (quickAttr) {
    attrName = quickAttr.name;
    attrValue = quickAttr.valueExpr ?
        quickAttr.valueExpr.asString(ctx) : null;
    pstart = 1;
  }
  if (this.descendants_) {
    if (!this.doesNeedContextPosition() &&
        this.axis_ == xrx.xpath.Step.Axis.CHILD) {
      nodeset = node.getNodeDescendant(this.test_);
      nodeset = this.predicates_.evaluatePredicates(nodeset, pstart);
    } else {
      var step = new xrx.xpath.Step(xrx.xpath.Step.Axis.DESCENDANT_OR_SELF,
          new xrx.xpath.KindTest('node'));
      var iter = step.evaluate(ctx).iterator();
      var n = iter.next();
      if (!n) {
        nodeset = new xrx.xpath.NodeSet();
      } else {
        nodeset = this.evaluate_(***REMOVED*** @type {!xrx.node}***REMOVED*** (n),
            attrName, attrValue, pstart);
        while ((n = iter.next()) != null) {
          nodeset = xrx.xpath.NodeSet.merge(nodeset,
              this.evaluate_(***REMOVED*** @type {!xrx.node}***REMOVED*** (n), attrName,
              attrValue, pstart));
        }
      }
    }
  } else {
    nodeset = this.evaluate_(ctx.getNode(), attrName, attrValue, pstart);
  }
  return nodeset;
***REMOVED***


***REMOVED***
***REMOVED*** Evaluates this step on the given context to a node-set.
***REMOVED***     (assumes this.descendants_ = false)
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {!xrx.node} node The context node.
***REMOVED*** @param {?string} attrName The name of the attribute.
***REMOVED*** @param {?string} attrValue The value of the attribute.
***REMOVED*** @param {number} pstart The first predicate to evaluate.
***REMOVED*** @return {!xrx.xpath.NodeSet} The node-set from evaluating this Step.
***REMOVED***
xrx.xpath.Step.prototype.evaluate_ = function(
    node, attrName, attrValue, pstart) {
  var nodeset = this.axis_.func_(this.test_, node, attrName, attrValue);
  nodeset = this.predicates_.evaluatePredicates(nodeset, pstart);
  return nodeset;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the step evaluation should include descendants.
***REMOVED***
***REMOVED*** @return {boolean} Whether descendants are included.
***REMOVED***
xrx.xpath.Step.prototype.doesIncludeDescendants = function() {
  return this.descendants_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the step's axis.
***REMOVED***
***REMOVED*** @return {!xrx.xpath.Step.Axis} The axis.
***REMOVED***
xrx.xpath.Step.prototype.getAxis = function() {
  return***REMOVED*****REMOVED*** @type {!xrx.xpath.Step.Axis}***REMOVED*** (this.axis_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the test for this step.
***REMOVED***
***REMOVED*** @return {!xrx.xpath.NodeTest} The test for this step.
***REMOVED***
xrx.xpath.Step.prototype.getTest = function() {
  return this.test_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.Step.prototype.toString = function() {
  var text = 'Step:';
  text += xrx.xpath.Expr.indent('Operator: ' + (this.descendants_ ? '//' : '/'));
  if (this.axis_.name_) {
    text += xrx.xpath.Expr.indent('Axis: ' + this.axis_);
  }
  text += xrx.xpath.Expr.indent(this.test_);
  if (this.predicates_.getLength()) {
    var predicates = goog.array.reduce(this.predicates_.getPredicates(),
        function(prev, curr) {
          return prev + xrx.xpath.Expr.indent(curr);
        }, 'Predicates:');
    text += xrx.xpath.Expr.indent(predicates);
  }
  return text;
***REMOVED***



***REMOVED***
***REMOVED*** A step axis.
***REMOVED***
***REMOVED***
***REMOVED*** @param {string} name The axis name.
***REMOVED*** @param {function(!xrx.xpath.NodeTest, xrx.node, ?string, ?string):
***REMOVED***     !xrx.xpath.NodeSet} func The function for this axis.
***REMOVED*** @param {boolean} reverse Whether to iterate over the node-set in reverse.
***REMOVED*** @param {boolean} supportsQuickAttr Whether quickAttr should be enabled for
***REMOVED***     this axis.
***REMOVED*** @private
***REMOVED***
xrx.xpath.Step.Axis_ = function(name, func, reverse, supportsQuickAttr) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.name_ = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {function(!xrx.xpath.NodeTest, xrx.node, ?string, ?string):
  ***REMOVED***     !xrx.xpath.NodeSet}
 ***REMOVED*****REMOVED***
  this.func_ = func;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.reverse_ = reverse;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.supportsQuickAttr_ = supportsQuickAttr;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the nodes in the step should be iterated over in reverse.
***REMOVED***
***REMOVED*** @return {boolean} Whether the nodes should be iterated over in reverse.
***REMOVED***
xrx.xpath.Step.Axis_.prototype.isReverse = function() {
  return this.reverse_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.Step.Axis_.prototype.toString = function() {
  return this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** A map from axis name to Axis.
***REMOVED***
***REMOVED*** @type {!Object.<string, !xrx.xpath.Step.Axis>}
***REMOVED*** @private
***REMOVED***
xrx.xpath.Step.nameToAxisMap_ = {***REMOVED***


***REMOVED***
***REMOVED*** Creates an axis and maps the axis's name to that axis.
***REMOVED***
***REMOVED*** @param {string} name The axis name.
***REMOVED*** @param {function(!xrx.xpath.NodeTest, xrx.node, ?string, ?string):
***REMOVED***     !xrx.xpath.NodeSet} func The function for this axis.
***REMOVED*** @param {boolean} reverse Whether to iterate over nodesets in reverse.
***REMOVED*** @param {boolean=} opt_supportsQuickAttr Whether quickAttr can be enabled
***REMOVED***     for this axis.
***REMOVED*** @return {!xrx.xpath.Step.Axis} The axis.
***REMOVED*** @private
***REMOVED***
xrx.xpath.Step.createAxis_ =
    function(name, func, reverse, opt_supportsQuickAttr) {
  if (name in xrx.xpath.Step.nameToAxisMap_) {
    throw Error('Axis already created: ' + name);
  }
  // The upcast and then downcast for the JSCompiler.
  var axis =***REMOVED*****REMOVED*** @type {!Object}***REMOVED*** (new xrx.xpath.Step.Axis_(
      name, func));
  axis =***REMOVED*****REMOVED*** @type {!xrx.xpath.Step.Axis}***REMOVED*** (axis);
  xrx.xpath.Step.nameToAxisMap_[name] = axis;
  return axis;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the axis for this axisname or null if none.
***REMOVED***
***REMOVED*** @param {string} name The axis name.
***REMOVED*** @return {xrx.xpath.Step.Axis} The axis.
***REMOVED***
xrx.xpath.Step.getAxis = function(name) {
  return xrx.xpath.Step.nameToAxisMap_[name] || null;
***REMOVED***


***REMOVED***
***REMOVED*** Axis enumeration.
***REMOVED***
xrx.xpath.Step.Axis = {
  ANCESTOR: xrx.xpath.Step.createAxis_('ancestor',
      function(test, node) {
        return node.getNodeAncestor(test);
      }),
  ANCESTOR_OR_SELF: xrx.xpath.Step.createAxis_('ancestor-or-self',
      function(test, node) {
        var nodeset = node.getNodeAncestor(test);
        if (test.matches(node)) nodeset.add(node);
        return nodeset;
      }),
  ATTRIBUTE: xrx.xpath.Step.createAxis_('attribute',
      function(test, node) {
        return node.getNodeAttribute(test);
      }),
  CHILD: xrx.xpath.Step.createAxis_('child',
      function(test, node) {
        return node.getNodeChild(test);
      }),
  DESCENDANT: xrx.xpath.Step.createAxis_('descendant',
      function(test, node) {
        return node.getNodeDescendant(test);
      }),
  DESCENDANT_OR_SELF: xrx.xpath.Step.createAxis_('descendant-or-self',
      function(test, node) {
        var nodeset = node.getNodeDescendant(test);
        if (test.matches(node)) nodeset.unshift(node);
        return nodeset;
      }),
  FOLLOWING: xrx.xpath.Step.createAxis_('following',
      function(test, node) {
        return node.getNodeFollowing(test);
      }),
  FOLLOWING_SIBLING: xrx.xpath.Step.createAxis_('following-sibling',
      function(test, node) {
        return node.getNodeFollowingSibling(test);
      }),
  NAMESPACE: xrx.xpath.Step.createAxis_('namespace',
      function(test, node) {
        // not implemented
        return new xrx.xpath.NodeSet();
      }),
  PARENT: xrx.xpath.Step.createAxis_('parent',
      function(test, node) {
        return node.getNodeParent(test);
      }),
  PRECEDING: xrx.xpath.Step.createAxis_('preceding',
      function(test, node) {
        return node.getNodePreceding(test);
      }),
  PRECEDING_SIBLING: xrx.xpath.Step.createAxis_('preceding-sibling',
      function(test, node) {
        return node.getNodePrecedingSibling(test);
      }),
  SELF: xrx.xpath.Step.createAxis_('self',
      function(test, node) {
        var nodeset = new xrx.xpath.NodeSet();
        if (test.matches(node)) nodeset.add(node);
        return nodeset;
      })
***REMOVED***
