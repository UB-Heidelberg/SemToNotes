/**
 * @fileoverview
 */

goog.provide('xrx.mvc.Xpath');



goog.require('xrx.mvc');
goog.require('xrx.xpath');
goog.require('xrx.xpath.BinaryExpr');
goog.require('xrx.xpath.FilterExpr');
goog.require('xrx.xpath.FunctionCall');
goog.require('xrx.xpath.KindTest');
goog.require('xrx.xpath.Literal');
goog.require('xrx.xpath.NameTest');
goog.require('xrx.xpath.Number');
goog.require('xrx.xpath.PathExpr');
goog.require('xrx.xpath.PathExpr.ContextHelperExpr');
goog.require('xrx.xpath.Predicates');
goog.require('xrx.xpath.Step');



xrx.mvc.Xpath = function(expression) {

  this.expression_ = xrx.xpath.compile(expression);

  this.instances_ = [];

  this.hasValue_ = false;

  this.hasTextValue_ = false;

  this.hasAttrValue_ = false;

  this.analyse_(this.expression_.gexpr);

  console.log(this.instances_);
};



xrx.mvc.Xpath.prototype.getExpression = function() {
  return this.expression_;
};



xrx.mvc.Xpath.prototype.binaryExpr = function(expr) {
  this.analyse_(expr.getLeft());
  this.analyse_(expr.getRight());
};



xrx.mvc.Xpath.prototype.filterExpr = function(expr) {
};



xrx.mvc.Xpath.prototype.functionCall = function(expr) {
  switch(expr.getFunction().name) {
  case 'xrx:instance':
    this.instances_.push(expr.getArg(0).getString());
    break;
  case 'xrx:bind':
    var bindId = expr.getArg(0).getString();
    console.log(expr);
    break;
  default:
    break;
  }
};



xrx.mvc.Xpath.prototype.pathExpr = function(expr) {
  var steps = expr.getSteps();
  this.analyse_(expr.getFilter());
  for (var i = 0, len = steps.length; i < len; i++) {
    this.analyse_(steps[i]);
  }
};



xrx.mvc.Xpath.prototype.step = function(expr) {
  this.analyse_(expr.getTest());
  this.analyse_(expr.getPredicates());
};



xrx.mvc.Xpath.prototype.nameTest = function(expr) {
};



xrx.mvc.Xpath.prototype.predicates = function(expr) {
};



xrx.mvc.Xpath.prototype.kindTest = function(expr) {
};



xrx.mvc.Xpath.prototype.number = function(expr) {
};



xrx.mvc.Xpath.prototype.literal = function(expr) {
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
  } else if (expr instanceof xrx.xpath.Step) {
    this.step(expr);
  } else if (expr instanceof xrx.xpath.NameTest) {
    this.nameTest(expr);
  } else if (expr instanceof xrx.xpath.Predicates) {
    this.predicates(expr);
  } else if (expr instanceof xrx.xpath.KindTest) {
    this.kindTest(expr);
  } else if (expr instanceof xrx.xpath.Number) {
    this.number(expr);
  } else if (expr instanceof xrx.xpath.Literal) {
    this.literal(expr);
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
