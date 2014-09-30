***REMOVED***
***REMOVED*** @fileoverview An abstract class representing a XML node.
***REMOVED***

goog.provide('xrx.node');



goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



***REMOVED***
***REMOVED*** Base class for all XML nodes.
***REMOVED*** 
***REMOVED*** @param {!integer} type The node type.
***REMOVED*** @param {!xrx.instance} instance The XML instance.
***REMOVED***
***REMOVED***
xrx.node = function(type, instance) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.node}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.type_ = type;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.instance}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.instance_ = instance;
***REMOVED***



// numbers are important to compute document order!
***REMOVED*** @const***REMOVED*** xrx.node.DOCUMENT = 0;
***REMOVED*** @const***REMOVED*** xrx.node.ELEMENT = 4;
***REMOVED*** @const***REMOVED*** xrx.node.ATTRIBUTE = 3;
***REMOVED*** @const***REMOVED*** xrx.node.NAMESPACE = 2;
***REMOVED*** @const***REMOVED*** xrx.node.PI = 1;
***REMOVED*** @const***REMOVED*** xrx.node.COMMENT = 5;
***REMOVED*** @const***REMOVED*** xrx.node.TEXT = 6;



***REMOVED***
***REMOVED*** Returns the the node's instance.
***REMOVED*** @return {!integer} The type number.
***REMOVED***
xrx.node.prototype.getInstance = function() {
  return this.instance_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns type of the node.
***REMOVED*** @return {!integer} The type number.
***REMOVED***
xrx.node.prototype.getType = function() {
  return this.type_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the string-value of the required type from a node.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to get value from.
***REMOVED*** @return {string} The value required.
***REMOVED***
xrx.node.prototype.getValueAsString = function() {
  return this.getStringValue();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the string-value of the required type from a node, casted to number.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to get value from.
***REMOVED*** @return {number} The value required.
***REMOVED***
xrx.node.prototype.getValueAsNumber = function() {
  return +this.getValueAsString();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the string-value of the required type from a node, casted to boolean.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to get value from.
***REMOVED*** @return {boolean} The value required.
***REMOVED***
xrx.node.prototype.getValueAsBool = function() {
  return !!this.getValueAsString();
***REMOVED***



***REMOVED***
***REMOVED*** return {!string}
***REMOVED***
xrx.node.getNameLocal = function(name) {
  return goog.string.contains(name, ':') ? 
      name.substr(name.indexOf(':') + 1) : name;
***REMOVED***



***REMOVED***
***REMOVED*** return {!string}
***REMOVED***
xrx.node.getNamePrefix = function(name) {
  return goog.string.contains(name, ':') ? 
      'xmlns:' + name.substr(0, name.indexOf(':')) : 'xmlns';
***REMOVED***



***REMOVED***
***REMOVED*** return {!string}
***REMOVED***
xrx.node.getNameExpanded = function(namespace, localName) {
  return namespace + '#' + localName;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.node.prototype.find = function(test, axisTest, reverse, stop) {
***REMOVED***
  var selfLabel = self.getLabel();
  var nodeset = new xrx.xpath.NodeSet();

  this.eventNode = function(node) {
    if (self.instance_ === node.getInstance() && axisTest.call(self, node) &&
        test.matches(node)) {
      reverse ? nodeset.unshift(node) : nodeset.add(node);
    }
 ***REMOVED*****REMOVED***
  
  reverse ? this.backward(stop, test.needsTextNode()) : 
      this.forward(stop, test.needsTextNode());
  return nodeset;
***REMOVED***



***REMOVED***
***REMOVED*** Interface.
***REMOVED*** Each node implementation and each node type must implement 
***REMOVED*** the functions below.
***REMOVED***



***REMOVED***
***REMOVED*** Identity and positional functions
***REMOVED***
xrx.node.prototype.isSameAs = goog.abstractMethod;
xrx.node.prototype.isBefore = goog.abstractMethod;
xrx.node.prototype.isAfter = goog.abstractMethod;



***REMOVED***
***REMOVED*** Axis functions
***REMOVED***
xrx.node.prototype.isAncestorOf = goog.abstractMethod;
xrx.node.prototype.isAttributeOf = goog.abstractMethod;
xrx.node.prototype.isChildOf = goog.abstractMethod;
xrx.node.prototype.isDescendantOf = goog.abstractMethod;
xrx.node.prototype.isFollowingOf = goog.abstractMethod;
xrx.node.prototype.isFollowingSiblingOf = goog.abstractMethod;
xrx.node.prototype.isParentOf = goog.abstractMethod;
xrx.node.prototype.isPrecedingOf = goog.abstractMethod;
xrx.node.prototype.isPrecedingSiblingOf = goog.abstractMethod;



***REMOVED***
***REMOVED*** Name functions
***REMOVED***
xrx.node.prototype.getName = goog.abstractMethod;
xrx.node.prototype.getNamespaceUri = goog.abstractMethod;



***REMOVED***
***REMOVED*** Content functions
***REMOVED***
xrx.node.prototype.getStringValue = goog.abstractMethod;
xrx.node.prototype.getXml = goog.abstractMethod;



***REMOVED***
***REMOVED*** Node access functions
***REMOVED***
xrx.node.prototype.getNodeAncestor = goog.abstractMethod;
xrx.node.prototype.getNodeAttribute = goog.abstractMethod;
xrx.node.prototype.getNodeChild = goog.abstractMethod;
xrx.node.prototype.getNodeDescendant = goog.abstractMethod;
xrx.node.prototype.getNodeFollowing = goog.abstractMethod;
xrx.node.prototype.getNodeFollowingSibling = goog.abstractMethod;
xrx.node.prototype.getNodeParent = goog.abstractMethod;
xrx.node.prototype.getNodePreceding = goog.abstractMethod;
xrx.node.prototype.getNodePrecedingSibling = goog.abstractMethod;

