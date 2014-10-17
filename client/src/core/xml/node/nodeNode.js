***REMOVED*****REMOVED***
***REMOVED*** @fileoverview An abstract class representing a XML node.
***REMOVED***

goog.provide('xrx.node.Node');



goog.require('xrx.node.Document');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



***REMOVED***
***REMOVED*** Base class for all XML nodes.
***REMOVED*** 
***REMOVED*** @param {!integer} type The node type.
***REMOVED*** @param {!xrx.node.Document} document The document node.
***REMOVED***
***REMOVED***
xrx.node.Node = function(type, document) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.node}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.type_ = type;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.node.Document}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.document_ = document;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the the node's document.
***REMOVED*** @return {!xrx.node.Document} The document.
***REMOVED***
xrx.node.Node.prototype.getInstance = function() {
  return this.document_.getInstance();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the the node's document.
***REMOVED*** @return {!xrx.node.Document} The document.
***REMOVED***
xrx.node.Node.prototype.getDocument = function() {
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** Returns type of the node.
***REMOVED*** @return {!integer} The type number.
***REMOVED***
xrx.node.Node.prototype.getType = function() {
  return this.type_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the string-value of the required type from a node.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to get value from.
***REMOVED*** @return {string} The value required.
***REMOVED***
xrx.node.Node.prototype.getValueAsString = function() {
  return this.getStringValue();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the string-value of the required type from a node, casted to number.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to get value from.
***REMOVED*** @return {number} The value required.
***REMOVED***
xrx.node.Node.prototype.getValueAsNumber = function() {
  return +this.getValueAsString();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the string-value of the required type from a node, casted to boolean.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to get value from.
***REMOVED*** @return {boolean} The value required.
***REMOVED***
xrx.node.Node.prototype.getValueAsBool = function() {
  return !!this.getValueAsString();
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.node.Node.prototype.find = function(test, axisTest, reverse, stop) {
***REMOVED***
  var selfLabel = self.getLabel();
  var nodeset = new xrx.xpath.NodeSet();

  this.eventNode = function(node) {
    if (self.getDocument().getInstance() === node.getDocument().getInstance() && axisTest.call(self, node) &&
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
xrx.node.Node.prototype.isSameAs = goog.abstractMethod;
xrx.node.Node.prototype.isBefore = goog.abstractMethod;
xrx.node.Node.prototype.isAfter = goog.abstractMethod;



***REMOVED***
***REMOVED*** Axis functions
***REMOVED***
xrx.node.Node.prototype.isAncestorOf = goog.abstractMethod;
xrx.node.Node.prototype.isAttributeOf = goog.abstractMethod;
xrx.node.Node.prototype.isChildOf = goog.abstractMethod;
xrx.node.Node.prototype.isDescendantOf = goog.abstractMethod;
xrx.node.Node.prototype.isFollowingOf = goog.abstractMethod;
xrx.node.Node.prototype.isFollowingSiblingOf = goog.abstractMethod;
xrx.node.Node.prototype.isParentOf = goog.abstractMethod;
xrx.node.Node.prototype.isPrecedingOf = goog.abstractMethod;
xrx.node.Node.prototype.isPrecedingSiblingOf = goog.abstractMethod;



***REMOVED***
***REMOVED*** Name functions
***REMOVED***
xrx.node.Node.prototype.getName = goog.abstractMethod;
xrx.node.Node.prototype.getNamespaceUri = goog.abstractMethod;



***REMOVED***
***REMOVED*** Content functions
***REMOVED***
xrx.node.Node.prototype.getStringValue = goog.abstractMethod;
xrx.node.Node.prototype.getXml = goog.abstractMethod;



***REMOVED***
***REMOVED*** Node access functions
***REMOVED***
xrx.node.Node.prototype.getNodeAncestor = goog.abstractMethod;
xrx.node.Node.prototype.getNodeAttribute = goog.abstractMethod;
xrx.node.Node.prototype.getNodeChild = goog.abstractMethod;
xrx.node.Node.prototype.getNodeDescendant = goog.abstractMethod;
xrx.node.Node.prototype.getNodeFollowing = goog.abstractMethod;
xrx.node.Node.prototype.getNodeFollowingSibling = goog.abstractMethod;
xrx.node.Node.prototype.getNodeParent = goog.abstractMethod;
xrx.node.Node.prototype.getNodePreceding = goog.abstractMethod;
xrx.node.Node.prototype.getNodePrecedingSibling = goog.abstractMethod;
