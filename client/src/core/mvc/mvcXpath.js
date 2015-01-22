/**
 * @fileoverview
 */

goog.provide('xrx.mvc.Xpath');



goog.require('xrx.xpath');
goog.require('xrx.xpath.BinaryExpr');
goog.require('xrx.xpath.FilterExpr');
goog.require('xrx.xpath.FunctionCall');
goog.require('xrx.xpath.PathExpr');



xrx.mvc.Xpath = function(expression) {

  this.expression_ = xrx.xpath.compile(expression);

  this.analyse_(this.expression_.gexpr);

  this.instances_ = [];

  this.hasValue_ = false;

  this.hasTextValue_ = false;

  this.hasAttrValue_ = false;
};



xrx.mvc.Xpath.prototype.binaryExpr = function(expr) {
  this.analyse_(expr.getLeft());
  this.analyse_(expr.getRight());
};



xrx.mvc.Xpath.prototype.filterExpr = function(expr) {
  console.log(expr);
};



xrx.mvc.Xpath.prototype.functionCall = function(expr) {
  console.log(expr);
};



xrx.mvc.Xpath.prototype.pathExpr = function(expr) {
  var steps = expr.getSteps();
  this.analyse_(expr.getFilter());
  for (var i = 0, len = steps.length; i < len; i++) {
    this.analyse_(steps[i]);
  }
};



xrx.mvc.Xpath.prototype.analyse_ = function(expr) {
  if (expr instanceof xrx.xpath.PathExpr) {
    this.pathExpr(expr);
  } else if (expr instanceof xrx.xpath.FunctionCall) {
    this.functionCall(expr);
  } else if (expr instanceof xrx.xpath.FilterExpr) {
    this.filterExpr(expr);
  } else if (expr instanceof xrx.xpath.BinaryExpr) {
    this.binaryExpr(expr);
  } else if (expr instanceof xrx.xpath.PathExpr.ContextHelperExpr) {
    // do nothing
  } else {
    console.log(expr);
    throw Error('Unknown expression type.');
  }
};



xrx.mvc.Xpath.prototype.evaluate = function(context, type) {
  return xrx.xpath.evaluateCompiled(this.expression_, context, type);
};
