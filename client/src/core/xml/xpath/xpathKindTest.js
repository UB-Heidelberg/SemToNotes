/**
 * @fileoverview A class implementing the xpath 1.0 subset of the
 *               KindTest construct.
 */

goog.provide('xrx.xpath.KindTest');

goog.require('xrx.node');
goog.require('xrx.xpath.NodeTest');



/**
 * Constructs a subset of KindTest based on the XPath grammar:
 * http://www.w3.org/TR/xpath20/#prod-xpath-KindTest
 *
 * @param {string} typeName Type name to be tested.
 * @param {xrx.xpath.Literal=} opt_literal Optional literal for
 *        processing-instruction nodes.
 * @constructor
 * @implements {xrx.xpath.NodeTest}
 */
xrx.xpath.KindTest = function(typeName, opt_literal) {

  /**
   * @type {string}
   * @private
   */
  this.typeName_ = typeName;

  /**
   * @type {xrx.xpath.Literal}
   * @private
   */
  this.literal_ = goog.isDef(opt_literal) ? opt_literal : null;

  /**
   * @type {?xrx.node.Node}
   * @private
   */
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
};



xrx.xpath.KindTest.prototype.getTypeName = function() {
  return this.typeName_;
};



/**
 * Checks if a type name is a valid KindTest parameter.
 *
 * @param {string} typeName The type name to be checked.
 * @return {boolean} Whether the type name is legal.
 */
xrx.xpath.KindTest.isValidType = function(typeName) {
  return typeName == 'comment' || typeName == 'text' ||
      typeName == 'processing-instruction' || typeName == 'node' ||
      typeName == 'attribute';
};


/**
 * @override
 */
xrx.xpath.KindTest.prototype.matches = function(node) {
  return goog.isNull(this.type_) || this.type_ == node.getType();
};


/**
 * Returns the type of the node.
 *
 * @return {?number} The type of the node, or null if any type.
 */
xrx.xpath.KindTest.prototype.getType = function() {
  return this.type_;
};


/**
 * @override
 */
xrx.xpath.KindTest.prototype.getName = function() {
  return this.typeName_;
};


/**
 * @override
 */
xrx.xpath.KindTest.prototype.toString = function() {
  var text = 'Kind Test: ' + this.typeName_;
  if (!goog.isNull(this.literal_)) {
    text += xrx.xpath.Expr.indent(this.literal_);
  }
  return text;
};


/**
 * Returns whether the test needs text nodes to match.
 * @return {boolean}
 */
xrx.xpath.KindTest.prototype.needsTextNode = function() {
  return this.type_ === null || this.type_ === xrx.node.TEXT;
};
