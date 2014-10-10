***REMOVED***
***REMOVED*** @fileoverview A class providing functions that can be
***REMOVED*** shared by element node implementations.
***REMOVED***

goog.provide('xrx.node.Element');



***REMOVED*** 
***REMOVED*** A class providing functions that can be
***REMOVED*** shared by element node implementations.
***REMOVED***
xrx.node.Element = function() {***REMOVED***



***REMOVED***
***REMOVED*** Indicates whether two nodes are the same.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to test against.
***REMOVED*** @return {boolean} Whether the nodes are the same.
***REMOVED***
xrx.node.Element.prototype.isSameAs = function(node) {
  return this.getType() === node.getType() && 
      this.getLabel().sameAs(node.getLabel());
***REMOVED***



***REMOVED***
***REMOVED*** Indicates whether a node appears before another node
***REMOVED*** in document order.
***REMOVED*** 
***REMOVED*** @param {!xrx.node} node The node to test against.
***REMOVED*** @return {boolean}
***REMOVED***
xrx.node.Element.prototype.isBefore = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isBefore(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() < node.getType() );
***REMOVED***



***REMOVED***
***REMOVED*** Indicates whether a node appears after another node
***REMOVED*** in document order.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to test against.
***REMOVED*** @return {boolean}
***REMOVED***
xrx.node.Element.prototype.isAfter = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isAfter(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() > node.getType() );
***REMOVED***



xrx.node.Element.prototype.isAncestorOf = function(node) {
  return this.getLabel().isAncestorOf(node.getLabel());
***REMOVED***



xrx.node.Element.prototype.isAttributeOf = function(node) {
  return false;
***REMOVED***



xrx.node.Element.prototype.isChildOf = function(node) {
  return this.getLabel().isChildOf(node.getLabel());
***REMOVED***



xrx.node.Element.prototype.isDescendantOf = function(node) {
  return this.getLabel().isDescendantOf(node.getLabel());
***REMOVED***



xrx.node.Element.prototype.isFollowingOf = function(node) {
  return this.isAfter(node) && !this.getLabel().isDescendantOf(node.getLabel());
***REMOVED***



xrx.node.Element.prototype.isFollowingSiblingOf = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isFollowingSiblingOf(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) && 
          this.getType() > node.getType() );
***REMOVED***



xrx.node.Element.prototype.isParentOf = function(node) {
  return this.getLabel().isParentOf(node.getLabel());
***REMOVED***



xrx.node.Element.prototype.isPrecedingOf = function(node) {
  return this.isBefore(node) && !this.getLabel().isAncestorOf(node.getLabel());
***REMOVED***



xrx.node.Element.prototype.isPrecedingSiblingOf = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isPrecedingSiblingOf(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) && 
          this.getType() < node.getType() );
***REMOVED***



xrx.node.Element.prototype.getNodeAncestor = function(test) {
  var nodeset = this.find(test, xrx.node[this.impl_.Element].prototype.isDescendantOf,
      true, new xrx.xml.Label());

  // TODO: not sure if this is correct?
  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node[this.impl_.Document](this.instance_));
  return nodeset;
***REMOVED***



xrx.node.Element.prototype.getNodeChild = function(test) {

  return this.find(test, xrx.node[this.impl_.Element].prototype.isParentOf, false,
      this.getLabel());
***REMOVED***



xrx.node.Element.prototype.getNodeDescendant = function(test) {

  return this.find(test, xrx.node[this.impl_.Element].prototype.isAncestorOf, false,
      this.getLabel());
***REMOVED***



xrx.node.Element.prototype.getNodeFollowing = function(test) {

  return this.find(test, xrx.node[this.impl_.Element].prototype.isPrecedingOf, false,
      new xrx.xml.Label());
***REMOVED***



xrx.node.Element.prototype.getNodeFollowingSibling = function(test) {
  var stop = this.getLabel().clone();
  stop.parent();

  return this.find(test, xrx.node[this.impl_.Element].prototype.isPrecedingSiblingOf,
      false, stop);
***REMOVED***



xrx.node.Element.prototype.getNodeParent = function(test) {
  var stop = this.getLabel().clone();
  stop.parent();

  return this.find(test, xrx.node[this.impl_.Element].prototype.isChildOf, true, stop);
***REMOVED***



xrx.node.Element.prototype.getNodePreceding = function(test) {
  var nodeset = this.find(test, xrx.node[this.impl_.Element].prototype.isFollowingOf, true,
      new xrx.xml.Label());

  // TODO: not sure if this is correct?
  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node[this.impl_.Document](this.instance_));

  return nodeset;
***REMOVED***



xrx.node.Element.prototype.getNodePrecedingSibling = function(test) {
  var stop = this.getLabel().clone();
  stop.parent();

  return this.find(test, xrx.node[this.impl_.Element].prototype.isFollowingSiblingOf, true,
      stop);
***REMOVED***

