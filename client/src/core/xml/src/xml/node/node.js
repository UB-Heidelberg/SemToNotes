/**
 * @fileoverview An abstract class representing a XML node.
 */

goog.provide('xrx.node');



goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



/**
 * Base class for all XML nodes.
 * 
 * @param {!integer} type The node type.
 * @param {!xrx.instance} instance The XML instance.
 * @constructor
 */
xrx.node = function(type, instance) {

  /**
   * @type {xrx.node}
   * @private
   */
  this.type_ = type;

  /**
   * @type {xrx.instance}
   * @private
   */
  this.instance_ = instance;
};



// numbers are important to compute document order!
/** @const */ xrx.node.DOCUMENT = 0;
/** @const */ xrx.node.ELEMENT = 4;
/** @const */ xrx.node.ATTRIBUTE = 3;
/** @const */ xrx.node.NAMESPACE = 2;
/** @const */ xrx.node.PI = 1;
/** @const */ xrx.node.COMMENT = 5;
/** @const */ xrx.node.TEXT = 6;



/**
 * Returns the the node's instance.
 * @return {!integer} The type number.
 */
xrx.node.prototype.getInstance = function() {
  return this.instance_;
};



/**
 * Returns type of the node.
 * @return {!integer} The type number.
 */
xrx.node.prototype.getType = function() {
  return this.type_;
};



/**
 * Returns the string-value of the required type from a node.
 *
 * @param {!xrx.node} node The node to get value from.
 * @return {string} The value required.
 */
xrx.node.prototype.getValueAsString = function() {
  return this.getStringValue();
};



/**
 * Returns the string-value of the required type from a node, casted to number.
 *
 * @param {!xrx.node} node The node to get value from.
 * @return {number} The value required.
 */
xrx.node.prototype.getValueAsNumber = function() {
  return +this.getValueAsString();
};



/**
 * Returns the string-value of the required type from a node, casted to boolean.
 *
 * @param {!xrx.node} node The node to get value from.
 * @return {boolean} The value required.
 */
xrx.node.prototype.getValueAsBool = function() {
  return !!this.getValueAsString();
};



/**
 * return {!string}
 */
xrx.node.getNameLocal = function(name) {
  return goog.string.contains(name, ':') ? 
      name.substr(name.indexOf(':') + 1) : name;
};



/**
 * return {!string}
 */
xrx.node.getNamePrefix = function(name) {
  return goog.string.contains(name, ':') ? 
      'xmlns:' + name.substr(0, name.indexOf(':')) : 'xmlns';
};



/**
 * return {!string}
 */
xrx.node.getNameExpanded = function(namespace, localName) {
  return namespace + '#' + localName;
};



/**
 * @private
 */
xrx.node.prototype.find = function(test, axisTest, reverse, stop) {
  var self = this;
  var selfLabel = self.getLabel();
  var nodeset = new xrx.xpath.NodeSet();

  this.eventNode = function(node) {
    if (self.instance_ === node.getInstance() && axisTest.call(self, node) &&
        test.matches(node)) {
      reverse ? nodeset.unshift(node) : nodeset.add(node);
    }
  };
  
  reverse ? this.backward(stop, test.needsTextNode()) : 
      this.forward(stop, test.needsTextNode());
  return nodeset;
};



/**
 * Interface.
 * Each node implementation and each node type must implement 
 * the functions below.
 */



/**
 * Identity and positional functions
 */
xrx.node.prototype.isSameAs = goog.abstractMethod;
xrx.node.prototype.isBefore = goog.abstractMethod;
xrx.node.prototype.isAfter = goog.abstractMethod;



/**
 * Axis functions
 */
xrx.node.prototype.isAncestorOf = goog.abstractMethod;
xrx.node.prototype.isAttributeOf = goog.abstractMethod;
xrx.node.prototype.isChildOf = goog.abstractMethod;
xrx.node.prototype.isDescendantOf = goog.abstractMethod;
xrx.node.prototype.isFollowingOf = goog.abstractMethod;
xrx.node.prototype.isFollowingSiblingOf = goog.abstractMethod;
xrx.node.prototype.isParentOf = goog.abstractMethod;
xrx.node.prototype.isPrecedingOf = goog.abstractMethod;
xrx.node.prototype.isPrecedingSiblingOf = goog.abstractMethod;



/**
 * Name functions
 */
xrx.node.prototype.getName = goog.abstractMethod;
xrx.node.prototype.getNamespaceUri = goog.abstractMethod;



/**
 * Content functions
 */
xrx.node.prototype.getStringValue = goog.abstractMethod;
xrx.node.prototype.getXml = goog.abstractMethod;



/**
 * Node access functions
 */
xrx.node.prototype.getNodeAncestor = goog.abstractMethod;
xrx.node.prototype.getNodeAttribute = goog.abstractMethod;
xrx.node.prototype.getNodeChild = goog.abstractMethod;
xrx.node.prototype.getNodeDescendant = goog.abstractMethod;
xrx.node.prototype.getNodeFollowing = goog.abstractMethod;
xrx.node.prototype.getNodeFollowingSibling = goog.abstractMethod;
xrx.node.prototype.getNodeParent = goog.abstractMethod;
xrx.node.prototype.getNodePreceding = goog.abstractMethod;
xrx.node.prototype.getNodePrecedingSibling = goog.abstractMethod;

