***REMOVED***
***REMOVED*** @fileoverview A recursive descent Parser.
***REMOVED***

goog.provide('xrx.xpath.Parser');



goog.require('xrx.xpath.BinaryExpr');
goog.require('xrx.xpath.FilterExpr');
goog.require('xrx.xpath.FunctionCall');
goog.require('xrx.xpath.KindTest');
goog.require('xrx.xpath.Literal');
goog.require('xrx.xpath.NameTest');
goog.require('xrx.xpath.Number');
goog.require('xrx.xpath.PathExpr');
goog.require('xrx.xpath.Predicates');
goog.require('xrx.xpath.Step');
goog.require('xrx.xpath.UnaryExpr');
goog.require('xrx.xpath.UnionExpr');



***REMOVED***
***REMOVED*** The recursive descent parser.
***REMOVED***
***REMOVED***
***REMOVED*** @param {!xrx.xpath.Lexer} lexer The lexer.
***REMOVED*** @param {function(string): ?string} nsResolver Namespace resolver.
***REMOVED***
xrx.xpath.Parser = function(lexer) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private {!xrx.xpath.Lexer}
 ***REMOVED*****REMOVED***
  this.lexer_ = lexer;
***REMOVED***


***REMOVED***
***REMOVED*** Apply recursive descent parsing on the input to construct an
***REMOVED*** abstract syntax tree.
***REMOVED***
***REMOVED*** @return {!xrx.xpath.Expr} The root of the constructed tree.
***REMOVED***
xrx.xpath.Parser.prototype.parseExpr = function() {
  var expr, stack = [];
  while (true) {
    this.checkNotEmpty_('Missing right hand side of binary expression.');
    expr = this.parseUnaryExpr_(); // See if it's just a UnaryExpr.
    var opString = this.lexer_.next();
    if (!opString) {
      break; // Done, we have only a UnaryExpr.
    }

    var op = xrx.xpath.BinaryExpr.getOp(opString);
    var precedence = op && op.getPrecedence();
    if (!precedence) {
      this.lexer_.back();
      break;
    }
    // Precedence climbing
    while (stack.length &&
        precedence <= stack[stack.length - 1].getPrecedence()) {
      expr = new xrx.xpath.BinaryExpr(stack.pop(), stack.pop(), expr);
    }
    stack.push(expr, op);
  }
  while (stack.length) {
    expr = new xrx.xpath.BinaryExpr(stack.pop(), stack.pop(),
       ***REMOVED*****REMOVED*** @type {!xrx.xpath.Expr}***REMOVED*** (expr));
  }
  return***REMOVED*****REMOVED*** @type {!xrx.xpath.Expr}***REMOVED*** (expr);
***REMOVED***


***REMOVED***
***REMOVED*** Checks that the lexer is not empty,
***REMOVED***     displays the given error message if it is.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {string} msg The error message to display.
***REMOVED***
xrx.xpath.Parser.prototype.checkNotEmpty_ = function(msg) {
  if (this.lexer_.empty()) {
    throw Error(msg);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks that the next token of the error message is the expected token.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {string} expected The expected token.
***REMOVED***
xrx.xpath.Parser.prototype.checkNextEquals_ = function(expected) {
  var got = this.lexer_.next();
  if (got != expected) {
    throw Error('Bad token, expected: ' + expected + ' got: ' + got);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks that the next token of the error message is not the given token.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {string} token The token.
***REMOVED***
xrx.xpath.Parser.prototype.checkNextNotEquals_ = function(token) {
  var next = this.lexer_.next();
  if (next != token) {
    throw Error('Bad token: ' + next);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to parse the input as a FilterExpr.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {xrx.xpath.Expr} The root of the constructed tree.
***REMOVED***
xrx.xpath.Parser.prototype.parseFilterExpr_ = function() {
  var expr;
  var token = this.lexer_.peek();
  var ch = token.charAt(0);
  switch (ch) {
    case '$':
      throw Error('Variable reference not allowed in HTML XPath');
    case '(':
      this.lexer_.next();
      expr = this.parseExpr();
      this.checkNotEmpty_('unclosed "("');
      this.checkNextEquals_(')');
      break;
    case '"':
    case "'":
      expr = this.parseLiteral_();
      break;
    default:
      if (!isNaN(+token)) {
        expr = this.parseNumber_();
      } else if (xrx.xpath.KindTest.isValidType(token)) {
        return null;
      } else if (/(?![0-9])[\w]/.test(ch) && this.lexer_.peek(1) == '(') {
        expr = this.parseFunctionCall_();
      } else {
        return null;
      }
  }
  if (this.lexer_.peek() != '[') {
    return expr;
  }
  var predicates = new xrx.xpath.Predicates(this.parsePredicates_());
  return new xrx.xpath.FilterExpr(expr, predicates);
***REMOVED***


***REMOVED***
***REMOVED*** Parses FunctionCall.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {!xrx.xpath.FunctionCall} The parsed expression.
***REMOVED***
xrx.xpath.Parser.prototype.parseFunctionCall_ = function() {
  var funcName = this.lexer_.next();
  var func = xrx.xpath.FunctionCall.getFunc(funcName);
  this.lexer_.next();

  var args = [];
  while (this.lexer_.peek() != ')') {
    this.checkNotEmpty_('Missing function argument list.');
    args.push(this.parseExpr());
    if (this.lexer_.peek() != ',') {
      break;
    }
    this.lexer_.next();
  }
  this.checkNotEmpty_('Unclosed function argument list.');
  this.checkNextNotEquals_(')');

  return new xrx.xpath.FunctionCall(func, args);
***REMOVED***


***REMOVED***
***REMOVED*** Parses the input to construct a KindTest.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {!xrx.xpath.KindTest} The KindTest constructed.
***REMOVED***
xrx.xpath.Parser.prototype.parseKindTest_ = function() {
  var typeName = this.lexer_.next();
  if (!xrx.xpath.KindTest.isValidType(typeName)) {
    throw Error('Invalid type name: ' + typeName);
  }
  this.checkNextEquals_('(');
  this.checkNotEmpty_('Bad nodetype');
  var ch = this.lexer_.peek().charAt(0);

  var literal = null;
  if (ch == '"' || ch == "'") {
    literal = this.parseLiteral_();
  }
  this.checkNotEmpty_('Bad nodetype');
  this.checkNextNotEquals_(')');
  return new xrx.xpath.KindTest(typeName, literal);
***REMOVED***


***REMOVED***
***REMOVED*** Parses the input to construct a Literal.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {!xrx.xpath.Literal} The Literal constructed.
***REMOVED***
xrx.xpath.Parser.prototype.parseLiteral_ = function() {
  var token = this.lexer_.next();
  if (token.length < 2) {
    throw Error('Unclosed literal string');
  }
  return new xrx.xpath.Literal(token);
***REMOVED***


***REMOVED***
***REMOVED*** Parses the input to construct a NameTest.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {!xrx.xpath.NameTest} The NameTest constructed.
***REMOVED***
xrx.xpath.Parser.prototype.parseNameTest_ = function() {
  var name = this.lexer_.next();

  // Check whether there's a namespace prefix.
  var colonIndex = name.indexOf(':');
  if (colonIndex == -1) {
    return new xrx.xpath.NameTest(name);
  } else {
    var namespacePrefix = name.substring(0, colonIndex);
    var namespaceUri = xrx.xpath.XPathNSResolver['xmlns:' + namespacePrefix];
    if (!namespaceUri) {
      throw Error('Namespace prefix not declared: ' + namespacePrefix);
    }
    name = name.substr(colonIndex + 1);
    return new xrx.xpath.NameTest(name, namespaceUri);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Parses the input to construct a Number.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {!xrx.xpath.Number} The Number constructed.
***REMOVED***
xrx.xpath.Parser.prototype.parseNumber_ = function() {
  return new xrx.xpath.Number(+this.lexer_.next());
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to parse the input as a PathExpr.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {!xrx.xpath.Expr} The root of the constructed tree.
***REMOVED***
xrx.xpath.Parser.prototype.parsePathExpr_ = function() {
  var op, expr;
  var steps = [];
  var filterExpr;
  if (xrx.xpath.PathExpr.isValidOp(this.lexer_.peek())) {
    op = this.lexer_.next();
    var token = this.lexer_.peek();
    if (op == '/' && (this.lexer_.empty() ||
        (token != '.' && token != '..' && token != '@' && token != '*' &&
        !/(?![0-9])[\w]/.test(token)))) {
      return new xrx.xpath.PathExpr.RootHelperExpr();
    }
    filterExpr = new xrx.xpath.PathExpr.RootHelperExpr();

    this.checkNotEmpty_('Missing next location step.');
    expr = this.parseStep_(op);
    steps.push(expr);
  } else {
    expr = this.parseFilterExpr_();
    if (!expr) {
      expr = this.parseStep_('/');
      filterExpr = new xrx.xpath.PathExpr.ContextHelperExpr();
      steps.push(expr);
    } else if (!xrx.xpath.PathExpr.isValidOp(this.lexer_.peek())) {
      return expr; // Done.
    } else {
      filterExpr = expr;
    }
  }
  while (true) {
    if (!xrx.xpath.PathExpr.isValidOp(this.lexer_.peek())) {
      break;
    }
    op = this.lexer_.next();
    this.checkNotEmpty_('Missing next location step.');
    expr = this.parseStep_(op);
    steps.push(expr);
  }
  return new xrx.xpath.PathExpr(filterExpr, steps);
***REMOVED***


***REMOVED***
***REMOVED*** Parses Step.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {string} op The op for this step.
***REMOVED*** @return {!xrx.xpath.Step} The parsed expression.
***REMOVED***
xrx.xpath.Parser.prototype.parseStep_ = function(op) {
  var test, step, token, predicates;
  if (op != '/' && op != '//') {
    throw Error('Step op should be "/" or "//"');
  }
  if (this.lexer_.peek() == '.') {
    step = new xrx.xpath.Step(xrx.xpath.Step.Axis.SELF,
        new xrx.xpath.KindTest('node'));
    this.lexer_.next();
    return step;
  }
  else if (this.lexer_.peek() == '..') {
    step = new xrx.xpath.Step(xrx.xpath.Step.Axis.PARENT,
        new xrx.xpath.KindTest('node'));
    this.lexer_.next();
    return step;
  } else {
    // Grab the axis.
    var axis;
    if (this.lexer_.peek() == '@') {
      axis = xrx.xpath.Step.Axis.ATTRIBUTE;
      this.lexer_.next();
      this.checkNotEmpty_('Missing attribute name');
    } else {
      if (this.lexer_.peek(1) == '::') {
        if (!/(?![0-9])[\w]/.test(this.lexer_.peek().charAt(0))) {
          throw Error('Bad token: ' + this.lexer_.next());
        }
        var axisName = this.lexer_.next();
        axis = xrx.xpath.Step.getAxis(axisName);
        if (!axis) {
          throw Error('No axis with name: ' + axisName);
        }
        this.lexer_.next();
        this.checkNotEmpty_('Missing node name');
      } else {
        axis = xrx.xpath.Step.Axis.CHILD;
      }
    }

    // Grab the test.
    token = this.lexer_.peek();
    if (!/(?![0-9])[\w]/.test(token.charAt(0))) {
      if (token == '*') {
        test = this.parseNameTest_();
      } else {
        throw Error('Bad token: ' + this.lexer_.next());
      }
    } else {
      if (this.lexer_.peek(1) == '(') {
        if (!xrx.xpath.KindTest.isValidType(token)) {
          throw Error('Invalid node type: ' + token);
        }
        test = this.parseKindTest_();
      } else {
        test = this.parseNameTest_();
      }
    }
    predicates = new xrx.xpath.Predicates(this.parsePredicates_(),
        axis.isReverse());
    return step || new xrx.xpath.Step(axis, test, predicates, op == '//');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Parses and returns the predicates from the this.lexer_.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {!Array.<!xrx.xpath.Expr>} An array of the predicates.
***REMOVED***
xrx.xpath.Parser.prototype.parsePredicates_ = function() {
  var predicates = [];
  while (this.lexer_.peek() == '[') {
    this.lexer_.next();
    this.checkNotEmpty_('Missing predicate expression.');
    var predicate = this.parseExpr();
    predicates.push(predicate);
    this.checkNotEmpty_('Unclosed predicate expression.');
    this.checkNextEquals_(']');
  }
  return predicates;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to parse the input as a unary expression with
***REMOVED*** recursive descent parsing.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {!xrx.xpath.Expr} The root of the constructed tree.
***REMOVED***
xrx.xpath.Parser.prototype.parseUnaryExpr_ = function() {
  if (this.lexer_.peek() == '-') {
    this.lexer_.next();
    return new xrx.xpath.UnaryExpr(this.parseUnaryExpr_());
  } else {
    return this.parseUnionExpr_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to parse the input as a union expression with
***REMOVED*** recursive descent parsing.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @return {!xrx.xpath.Expr} The root of the constructed tree.
***REMOVED***
xrx.xpath.Parser.prototype.parseUnionExpr_ = function() {
  var expr = this.parsePathExpr_();
  if (!(this.lexer_.peek() == '|')) {
    return expr;  // Not a UnionExpr, returning as is.
  }
  var paths = [expr];
  while (this.lexer_.next() == '|') {
    this.checkNotEmpty_('Missing next union location path.');
    paths.push(this.parsePathExpr_());
  }
  this.lexer_.back();
  return new xrx.xpath.UnionExpr(paths);
***REMOVED***
