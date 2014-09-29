***REMOVED***
***REMOVED*** @fileoverview An abstract class representing basic expressions.
***REMOVED***

goog.provide('xrx.xpath.Expr');

goog.require('xrx.xpath.NodeSet');



***REMOVED***
***REMOVED*** Abstract constructor for an XPath expression.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.DataType} dataType The data type that the expression
***REMOVED***                                    will be evaluated into.
***REMOVED***
***REMOVED***
xrx.xpath.Expr = function(dataType) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!xrx.xpath.DataType}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dataType_ = dataType;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.needContextPosition_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.needContextNode_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {?{name: string, valueExpr: xrx.xpath.Expr}}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.quickAttr_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Indentation method for pretty printing.
***REMOVED***
***REMOVED*** @param {*} obj The object to return a string representation for.
***REMOVED*** @return {string} The string prepended with newline and two spaces.
***REMOVED***
xrx.xpath.Expr.indent = function(obj) {
  return '\n  ' + obj.toString().split('\n').join('\n  ');
***REMOVED***


***REMOVED***
***REMOVED*** Evaluates the expression.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Context} ctx The context to evaluate the expression in.
***REMOVED*** @return {!(string|boolean|number|xrx.xpath.NodeSet)} The evaluation result.
***REMOVED***
xrx.xpath.Expr.prototype.evaluate = goog.abstractMethod;


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.Expr.prototype.toString = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the data type of the expression.
***REMOVED***
***REMOVED*** @return {!xrx.xpath.DataType} The data type that the expression
***REMOVED***                            will be evaluated into.
***REMOVED***
xrx.xpath.Expr.prototype.getDataType = function() {
  return this.dataType_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the expression needs context position to be evaluated.
***REMOVED***
***REMOVED*** @return {boolean} Whether context position is needed.
***REMOVED***
xrx.xpath.Expr.prototype.doesNeedContextPosition = function() {
  return this.needContextPosition_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the expression needs context position to be evaluated.
***REMOVED***
***REMOVED*** @param {boolean} flag Whether context position is needed.
***REMOVED***
xrx.xpath.Expr.prototype.setNeedContextPosition = function(flag) {
  this.needContextPosition_ = flag;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the expression needs context node to be evaluated.
***REMOVED***
***REMOVED*** @return {boolean} Whether context node is needed.
***REMOVED***
xrx.xpath.Expr.prototype.doesNeedContextNode = function() {
  return this.needContextNode_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the expression needs context node to be evaluated.
***REMOVED***
***REMOVED*** @param {boolean} flag Whether context node is needed.
***REMOVED***
xrx.xpath.Expr.prototype.setNeedContextNode = function(flag) {
  this.needContextNode_ = flag;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the quick attribute information, if exists.
***REMOVED***
***REMOVED*** @return {?{name: string, valueExpr: xrx.xpath.Expr}} The attribute
***REMOVED***         information.
***REMOVED***
xrx.xpath.Expr.prototype.getQuickAttr = function() {
  return this.quickAttr_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets up the quick attribute info.
***REMOVED***
***REMOVED*** @param {?{name: string, valueExpr: xrx.xpath.Expr}} attrInfo The attribute
***REMOVED***        information.
***REMOVED***
xrx.xpath.Expr.prototype.setQuickAttr = function(attrInfo) {
  this.quickAttr_ = attrInfo;
***REMOVED***


***REMOVED***
***REMOVED*** Evaluate and interpret the result as a number.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Context} ctx The context to evaluate the expression in.
***REMOVED*** @return {number} The evaluated number value.
***REMOVED***
xrx.xpath.Expr.prototype.asNumber = function(ctx) {
  var exrs = this.evaluate(ctx);
  if (exrs instanceof xrx.xpath.NodeSet) {
    return exrs.number();
  }
  return +exrs;
***REMOVED***


***REMOVED***
***REMOVED*** Evaluate and interpret the result as a string.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Context} ctx The context to evaluate the expression in.
***REMOVED*** @return {string} The evaluated string.
***REMOVED***
xrx.xpath.Expr.prototype.asString = function(ctx) {
  var exrs = this.evaluate(ctx);
  if (exrs instanceof xrx.xpath.NodeSet) {
    return exrs.string();
  }
  return '' + exrs;
***REMOVED***


***REMOVED***
***REMOVED*** Evaluate and interpret the result as a boolean value.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Context} ctx The context to evaluate the expression in.
***REMOVED*** @return {boolean} The evaluated boolean value.
***REMOVED***
xrx.xpath.Expr.prototype.asBool = function(ctx) {
  var exrs = this.evaluate(ctx);
  if (exrs instanceof xrx.xpath.NodeSet) {
    return !!exrs.getLength();
  }
  return !!exrs;
***REMOVED***
