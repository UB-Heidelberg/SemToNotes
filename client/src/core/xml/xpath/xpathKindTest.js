***REMOVED***
***REMOVED*** @fileoverview A class implementing the xpath 1.0 subset of the
***REMOVED***               KindTest construct.
***REMOVED***

goog.provide('xrx.xpath.KindTest');

goog.require('xrx.node');
goog.require('xrx.xpath.NodeTest');



***REMOVED***
***REMOVED*** Constructs a subset of KindTest based on the XPath grammar:
***REMOVED*** http://www.w3.org/TR/xpath20/#prod-xpath-KindTest
***REMOVED***
***REMOVED*** @param {string} typeName Type name to be tested.
***REMOVED*** @param {xrx.xpath.Literal=} opt_literal Optional literal for
***REMOVED***        processing-instruction nodes.
***REMOVED***
***REMOVED*** @implements {xrx.xpath.NodeTest}
***REMOVED***
xrx.xpath.KindTest = function(typeName, opt_literal) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.typeName_ = typeName;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.xpath.Literal}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.literal_ = goog.isDef(opt_literal) ? opt_literal : null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {?xrx.node}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.type_ = null;

  switch (typeName) {
    case 'attribute':
      this.type_ = xrx.node.ATTRIBUTE;
      break;
    case 'comment':
      this.type_ = xrx.node.COMMENT;
      break;
    case 'text':
      this.type_ = xrx.node.TEXT;
      break;
    case 'processing-instruction':
      this.type_ = xrx.node.PI;
      break;
    case 'node':
      break;
    default:
      throw Error('Unexpected argument');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a type name is a valid KindTest parameter.
***REMOVED***
***REMOVED*** @param {string} typeName The type name to be checked.
***REMOVED*** @return {boolean} Whether the type name is legal.
***REMOVED***
xrx.xpath.KindTest.isValidType = function(typeName) {
  return typeName == 'comment' || typeName == 'text' ||
      typeName == 'processing-instruction' || typeName == 'node' ||
      typeName == 'attribute';
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.KindTest.prototype.matches = function(node) {
  return goog.isNull(this.type_) || this.type_ == node.getType();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the type of the node.
***REMOVED***
***REMOVED*** @return {?number} The type of the node, or null if any type.
***REMOVED***
xrx.xpath.KindTest.prototype.getType = function() {
  return this.type_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.KindTest.prototype.getName = function() {
  return this.typeName_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.KindTest.prototype.toString = function() {
  var text = 'Kind Test: ' + this.typeName_;
  if (!goog.isNull(this.literal_)) {
    text += xrx.xpath.Expr.indent(this.literal_);
  }
  return text;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the test needs text nodes to match.
***REMOVED*** @return {boolean}
***REMOVED***
xrx.xpath.KindTest.prototype.needsTextNode = function() {
  return this.type_ === null || this.type_ === xrx.node.TEXT;
***REMOVED***
