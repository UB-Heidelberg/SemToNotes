// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview
***REMOVED*** Expression evaluation utilities. Expression format is very similar to XPath.
***REMOVED***
***REMOVED*** Expression details:
***REMOVED*** - Of format A/B/C, which will evaluate getChildNode('A').getChildNode('B').
***REMOVED***    getChildNodes('C')|getChildNodeValue('C')|getChildNode('C') depending on
***REMOVED***    call
***REMOVED*** - If expression ends with '/name()', will get the name() of the node
***REMOVED***    referenced by the preceding path.
***REMOVED*** - If expression ends with '/count()', will get the count() of the nodes that
***REMOVED***    match the expression referenced by the preceding path.
***REMOVED*** - If expression ends with '?', the value is OK to evaluate to null. This is
***REMOVED***    not enforced by the expression evaluation functions, instead it is
***REMOVED***    provided as a flag for client code which may ignore depending on usage
***REMOVED*** - If expression has [INDEX], will use getChildNodes().getByIndex(INDEX)
***REMOVED***
***REMOVED***


goog.provide('goog.ds.Expr');

goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.EmptyNodeList');
goog.require('goog.string');



***REMOVED***
***REMOVED*** Create a new expression. An expression uses a string expression language, and
***REMOVED*** from this string and a passed in DataNode can evaluate to a value, DataNode,
***REMOVED*** or a DataNodeList.
***REMOVED***
***REMOVED*** @param {string=} opt_expr The string expression.
***REMOVED***
***REMOVED***
goog.ds.Expr = function(opt_expr) {
  if (opt_expr) {
    this.setSource_(opt_expr);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Set the source expression text & parse
***REMOVED***
***REMOVED*** @param {string} expr The string expression source.
***REMOVED*** @param {Array=} opt_parts Array of the parts of an expression.
***REMOVED*** @param {goog.ds.Expr=} opt_childExpr Optional child of this expression,
***REMOVED***   passed in as a hint for processing.
***REMOVED*** @param {goog.ds.Expr=} opt_prevExpr Optional preceding expression
***REMOVED***   (i.e. $A/B/C is previous expression to B/C) passed in as a hint for
***REMOVED***   processing.
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.setSource_ = function(expr, opt_parts,
    opt_childExpr, opt_prevExpr) {
  this.src_ = expr;

  if (!opt_childExpr && !opt_prevExpr) {
    // Check whether it can be empty
    if (goog.string.endsWith(expr, goog.ds.Expr.String_.CAN_BE_EMPTY)) {
      this.canBeEmpty_ = true;
      expr = expr.substring(0, expr.length - 1);
    }

    // Check whether this is an node function
    if (goog.string.endsWith(expr, '()')) {
      if (goog.string.endsWith(expr, goog.ds.Expr.String_.NAME_EXPR) ||
          goog.string.endsWith(expr, goog.ds.Expr.String_.COUNT_EXPR) ||
          goog.string.endsWith(expr, goog.ds.Expr.String_.POSITION_EXPR)) {
        var lastPos = expr.lastIndexOf(goog.ds.Expr.String_.SEPARATOR);
        if (lastPos != -1) {
          this.exprFn_ = expr.substring(lastPos + 1);
          expr = expr.substring(0, lastPos);
        } else {
          this.exprFn_ = expr;
          expr = goog.ds.Expr.String_.CURRENT_NODE_EXPR;
        }
        if (this.exprFn_ == goog.ds.Expr.String_.COUNT_EXPR) {
          this.isCount_ = true;
        }
      }
    }
  }

  // Split into component parts
  this.parts_ = opt_parts || expr.split('/');
  this.size_ = this.parts_.length;
  this.last_ = this.parts_[this.size_ - 1];
  this.root_ = this.parts_[0];

  if (this.size_ == 1) {
    this.rootExpr_ = this;
    this.isAbsolute_ = goog.string.startsWith(expr, '$');
  } else {
    this.rootExpr_ = goog.ds.Expr.createInternal_(this.root_, null,
        this, null);
    this.isAbsolute_ = this.rootExpr_.isAbsolute_;
    this.root_ = this.rootExpr_.root_;
  }

  if (this.size_ == 1 && !this.isAbsolute_) {
    // Check whether expression maps to current node, for convenience
    this.isCurrent_ = (expr == goog.ds.Expr.String_.CURRENT_NODE_EXPR ||
        expr == goog.ds.Expr.String_.EMPTY_EXPR);

    // Whether this expression is just an attribute (i.e. '@foo')
    this.isJustAttribute_ =
        goog.string.startsWith(expr, goog.ds.Expr.String_.ATTRIBUTE_START);

    // Check whether this is a common node expression
    this.isAllChildNodes_ = expr == goog.ds.Expr.String_.ALL_CHILD_NODES_EXPR;
    this.isAllAttributes_ = expr == goog.ds.Expr.String_.ALL_ATTRIBUTES_EXPR;
    this.isAllElements_ = expr == goog.ds.Expr.String_.ALL_ELEMENTS_EXPR;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the source data path for the expression
***REMOVED*** @return {string} The path.
***REMOVED***
goog.ds.Expr.prototype.getSource = function() {
  return this.src_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last part of the expression.
***REMOVED*** @return {?string} Last part of the expression.
***REMOVED***
goog.ds.Expr.prototype.getLast = function() {
  return this.last_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the parent expression of this expression, or null if this is top level
***REMOVED*** @return {goog.ds.Expr} The parent.
***REMOVED***
goog.ds.Expr.prototype.getParent = function() {
  if (!this.parentExprSet_) {
    if (this.size_ > 1) {
      this.parentExpr_ = goog.ds.Expr.createInternal_(null,
          this.parts_.slice(0, this.parts_.length - 1), this, null);
    }
    this.parentExprSet_ = true;
  }
  return this.parentExpr_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the parent expression of this expression, or null if this is top level
***REMOVED*** @return {goog.ds.Expr} The parent.
***REMOVED***
goog.ds.Expr.prototype.getNext = function() {
  if (!this.nextExprSet_) {
    if (this.size_ > 1) {
      this.nextExpr_ = goog.ds.Expr.createInternal_(null, this.parts_.slice(1),
          null, this);
    }
    this.nextExprSet_ = true;
  }
  return this.nextExpr_;
***REMOVED***


***REMOVED***
***REMOVED*** Evaluate an expression on a data node, and return a value
***REMOVED*** Recursively walks through child nodes to evaluate
***REMOVED*** TODO(user) Support other expression functions
***REMOVED***
***REMOVED*** @param {goog.ds.DataNode=} opt_ds Optional datasource to evaluate against.
***REMOVED***     If not provided, evaluates against DataManager global root.
***REMOVED*** @return {*} Value of the node, or null if doesn't exist.
***REMOVED***
goog.ds.Expr.prototype.getValue = function(opt_ds) {
  if (opt_ds == null) {
    opt_ds = goog.ds.DataManager.getInstance();
  } else if (this.isAbsolute_) {
    opt_ds = opt_ds.getDataRoot ? opt_ds.getDataRoot() :
        goog.ds.DataManager.getInstance();
  }

  if (this.isCount_) {
    var nodes = this.getNodes(opt_ds);
    return nodes.getCount();
  }

  if (this.size_ == 1) {
    return opt_ds.getChildNodeValue(this.root_);
  } else if (this.size_ == 0) {
    return opt_ds.get();
  }

  var nextDs = opt_ds.getChildNode(this.root_);

  if (nextDs == null) {
    return null;
  } else {
    return this.getNext().getValue(nextDs);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Evaluate an expression on a data node, and return matching nodes
***REMOVED*** Recursively walks through child nodes to evaluate
***REMOVED***
***REMOVED*** @param {goog.ds.DataNode=} opt_ds Optional datasource to evaluate against.
***REMOVED***     If not provided, evaluates against data root.
***REMOVED*** @param {boolean=} opt_canCreate If true, will try to create new nodes.
***REMOVED*** @return {goog.ds.DataNodeList} Matching nodes.
***REMOVED***
goog.ds.Expr.prototype.getNodes = function(opt_ds, opt_canCreate) {
  return***REMOVED*****REMOVED*** @type {goog.ds.DataNodeList}***REMOVED***(this.getNodes_(opt_ds,
      false, opt_canCreate));
***REMOVED***


***REMOVED***
***REMOVED*** Evaluate an expression on a data node, and return the first matching node
***REMOVED*** Recursively walks through child nodes to evaluate
***REMOVED***
***REMOVED*** @param {goog.ds.DataNode=} opt_ds Optional datasource to evaluate against.
***REMOVED***     If not provided, evaluates against DataManager global root.
***REMOVED*** @param {boolean=} opt_canCreate If true, will try to create new nodes.
***REMOVED*** @return {goog.ds.DataNode} Matching nodes, or null if doesn't exist.
***REMOVED***
goog.ds.Expr.prototype.getNode = function(opt_ds, opt_canCreate) {
  return***REMOVED*****REMOVED*** @type {goog.ds.DataNode}***REMOVED***(this.getNodes_(opt_ds,
      true, opt_canCreate));
***REMOVED***


***REMOVED***
***REMOVED*** Evaluate an expression on a data node, and return the first matching node
***REMOVED*** Recursively walks through child nodes to evaluate
***REMOVED***
***REMOVED*** @param {goog.ds.DataNode=} opt_ds Optional datasource to evaluate against.
***REMOVED***     If not provided, evaluates against DataManager global root.
***REMOVED*** @param {boolean=} opt_selectOne Whether to return single matching DataNode
***REMOVED***     or matching nodes in DataNodeList.
***REMOVED*** @param {boolean=} opt_canCreate If true, will try to create new nodes.
***REMOVED*** @return {goog.ds.DataNode|goog.ds.DataNodeList} Matching node or nodes,
***REMOVED***     depending on value of opt_selectOne.
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.getNodes_ = function(opt_ds, opt_selectOne,
    opt_canCreate) {
  if (opt_ds == null) {
    opt_ds = goog.ds.DataManager.getInstance();
  } else if (this.isAbsolute_) {
    opt_ds = opt_ds.getDataRoot ? opt_ds.getDataRoot() :
        goog.ds.DataManager.getInstance();
  }

  if (this.size_ == 0 && opt_selectOne) {
      return opt_ds;
  } else if (this.size_ == 0 && !opt_selectOne) {
    return new goog.ds.BasicNodeList([opt_ds]);
  } else if (this.size_ == 1) {
    if (opt_selectOne) {
      return opt_ds.getChildNode(this.root_, opt_canCreate);
    }
    else {
      var possibleListChild = opt_ds.getChildNode(this.root_);
      if (possibleListChild && possibleListChild.isList()) {
        return possibleListChild.getChildNodes();
      } else {
        return opt_ds.getChildNodes(this.root_);
      }
    }
  } else {
    var nextDs = opt_ds.getChildNode(this.root_, opt_canCreate);
    if (nextDs == null && opt_selectOne) {
      return null;
    } else if (nextDs == null && !opt_selectOne) {
      return new goog.ds.EmptyNodeList();
    }
    return this.getNext().getNodes_(nextDs, opt_selectOne, opt_canCreate);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Whether the expression can be null.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.canBeEmpty_ = false;


***REMOVED***
***REMOVED*** The parsed paths in the expression
***REMOVED***
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.parts_ = [];


***REMOVED***
***REMOVED*** Number of paths in the expression
***REMOVED***
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.size_ = null;


***REMOVED***
***REMOVED*** The root node path in the expression
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.root_;


***REMOVED***
***REMOVED*** The last path in the expression
***REMOVED***
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.last_ = null;


***REMOVED***
***REMOVED*** Whether the expression evaluates to current node
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.isCurrent_ = false;


***REMOVED***
***REMOVED*** Whether the expression is just an attribute
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.isJustAttribute_ = false;


***REMOVED***
***REMOVED*** Does this expression select all DOM-style child nodes (element and text)
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.isAllChildNodes_ = false;


***REMOVED***
***REMOVED*** Does this expression select all DOM-style attribute nodes (starts with '@')
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.isAllAttributes_ = false;


***REMOVED***
***REMOVED*** Does this expression select all DOM-style element child nodes
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.isAllElements_ = false;


***REMOVED***
***REMOVED*** The function used by this expression
***REMOVED***
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.exprFn_ = null;


***REMOVED***
***REMOVED*** Cached value for the parent expression.
***REMOVED*** @type {goog.ds.Expr?}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.parentExpr_ = null;


***REMOVED***
***REMOVED*** Cached value for the next expression.
***REMOVED*** @type {goog.ds.Expr?}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.prototype.nextExpr_ = null;


***REMOVED***
***REMOVED*** Create an expression from a string, can use cached values
***REMOVED***
***REMOVED*** @param {string} expr The expression string.
***REMOVED*** @return {goog.ds.Expr} The expression object.
***REMOVED***
goog.ds.Expr.create = function(expr) {
  var result = goog.ds.Expr.cache_[expr];

  if (result == null) {
    result = new goog.ds.Expr(expr);
    goog.ds.Expr.cache_[expr] = result;
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Create an expression from a string, can use cached values
***REMOVED*** Uses hints from related expressions to help in creation
***REMOVED***
***REMOVED*** @param {?string=} opt_expr The string expression source.
***REMOVED*** @param {Array=} opt_parts Array of the parts of an expression.
***REMOVED*** @param {goog.ds.Expr=} opt_childExpr Optional child of this expression,
***REMOVED***   passed in as a hint for processing.
***REMOVED*** @param {goog.ds.Expr=} opt_prevExpr Optional preceding expression
***REMOVED***   (i.e. $A/B/C is previous expression to B/C) passed in as a hint for
***REMOVED***   processing.
***REMOVED*** @return {goog.ds.Expr} The expression object.
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.createInternal_ = function(opt_expr, opt_parts, opt_childExpr,
    opt_prevExpr) {
  var expr = opt_expr || opt_parts.join('/');
  var result = goog.ds.Expr.cache_[expr];

  if (result == null) {
    result = new goog.ds.Expr();
    result.setSource_(expr, opt_parts, opt_childExpr, opt_prevExpr);
    goog.ds.Expr.cache_[expr] = result;
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Cache of pre-parsed expressions
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.cache_ = {***REMOVED***


***REMOVED***
***REMOVED*** Commonly used strings in expressions.
***REMOVED*** @enum {string}
***REMOVED*** @private
***REMOVED***
goog.ds.Expr.String_ = {
  SEPARATOR: '/',
  CURRENT_NODE_EXPR: '.',
  EMPTY_EXPR: '',
  ATTRIBUTE_START: '@',
  ALL_CHILD_NODES_EXPR: '*|text()',
  ALL_ATTRIBUTES_EXPR: '@*',
  ALL_ELEMENTS_EXPR: '*',
  NAME_EXPR: 'name()',
  COUNT_EXPR: 'count()',
  POSITION_EXPR: 'position()',
  INDEX_START: '[',
  INDEX_END: ']',
  CAN_BE_EMPTY: '?'
***REMOVED***


***REMOVED***
***REMOVED*** Standard expressions
***REMOVED***


***REMOVED***
***REMOVED*** The current node
***REMOVED***
goog.ds.Expr.CURRENT = goog.ds.Expr.create(
    goog.ds.Expr.String_.CURRENT_NODE_EXPR);


***REMOVED***
***REMOVED*** For DOM interop - all DOM child nodes (text + element).
***REMOVED*** Text nodes have dataName #text
***REMOVED***
goog.ds.Expr.ALL_CHILD_NODES =
    goog.ds.Expr.create(goog.ds.Expr.String_.ALL_CHILD_NODES_EXPR);


***REMOVED***
***REMOVED*** For DOM interop - all DOM element child nodes
***REMOVED***
goog.ds.Expr.ALL_ELEMENTS =
    goog.ds.Expr.create(goog.ds.Expr.String_.ALL_ELEMENTS_EXPR);


***REMOVED***
***REMOVED*** For DOM interop - all DOM attribute nodes
***REMOVED*** Attribute nodes have dataName starting with "@"
***REMOVED***
goog.ds.Expr.ALL_ATTRIBUTES =
    goog.ds.Expr.create(goog.ds.Expr.String_.ALL_ATTRIBUTES_EXPR);


***REMOVED***
***REMOVED*** Get the dataName of a node
***REMOVED***
goog.ds.Expr.NAME = goog.ds.Expr.create(goog.ds.Expr.String_.NAME_EXPR);


***REMOVED***
***REMOVED*** Get the count of nodes matching an expression
***REMOVED***
goog.ds.Expr.COUNT = goog.ds.Expr.create(goog.ds.Expr.String_.COUNT_EXPR);


***REMOVED***
***REMOVED*** Get the position of the "current" node in the current node list
***REMOVED*** This will only apply for datasources that support the concept of a current
***REMOVED*** node (none exist yet). This is similar to XPath position() and concept of
***REMOVED*** current node
***REMOVED***
goog.ds.Expr.POSITION = goog.ds.Expr.create(goog.ds.Expr.String_.POSITION_EXPR);
