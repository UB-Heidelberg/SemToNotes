***REMOVED***
***REMOVED*** @fileoverview A class providing functions that can be
***REMOVED*** shared by text node implementations.
***REMOVED***


goog.provide('xrx.node.Text');



goog.require('xrx.node');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



***REMOVED*** 
***REMOVED*** A class providing functions that can be
***REMOVED*** shared by element node implementations.
***REMOVED***
xrx.node.Text = function(token) {***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isSameAs = function(node) {
  return this.getType() === node.getType() && 
      this.getLabel().sameAs(node.getLabel());
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isBefore = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isBefore(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() < node.getType() );
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isAfter = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isAfter(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) &&
          this.getType() > node.getType() );
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isAncestorOf = function(node) {
  return false;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isAttributeOf = function(node) {
  return false;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isChildOf = function(node) {
  return node.getType() === xrx.node.ELEMENT &&
      this.getLabel().isChildOf(node.getLabel());
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isDescendantOf = function(node) {
  return ( node.getType() === xrx.node.ELEMENT || 
      node.getType() === xrx.node.DOCUMENT ) &&
          this.getLabel().isDescendantOf(node.getLabel());
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isFollowingOf = function(node) {
  return this.isAfter(node) && !this.isDescendantOf(node);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isFollowingSiblingOf = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isFollowingSiblingOf(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) && 
          this.getType() > node.getType() );
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isParentOf = function(node) {
  return false;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isPrecedingOf = function(node) {
  return this.isBefore(node) && !this.getLabel().isAncestorOf(node.getLabel());
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.isPrecedingSiblingOf = function(node) {
  var selfLabel = this.getLabel();
  var nodeLabel = node.getLabel();

  return selfLabel.isPrecedingSiblingOf(nodeLabel) ||
      ( selfLabel.sameAs(nodeLabel) && 
          this.getType() < node.getType() );
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getName = function() {
  return '';
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getNamespaceUri = function(prefix) {
  return '';
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getStringValue = function() {
  return this.instance_.xml().substr(this.getOffset(), this.getLength());
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getXml = function() {
  return this.getStringValue();
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getNodeAncestor = function(test) {
  var nodeset = this.find(test, xrx.node[this.impl_.Text].prototype.isDescendantOf,
      true, new xrx.label());

  // TODO: not sure if this is correct?
  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node[this.impl_.Document](this.instance_));
  return nodeset;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getNodeAttribute = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getNodeChild = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getNodeDescendant = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getNodeFollowing = function(test) {

  return this.find(test, xrx.node[this.impl_.Text].prototype.isPrecedingOf, false,
      new xrx.label());
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getNodePreceding = function(test) {
  var nodeset = this.find(test, xrx.node[this.impl_.Text].prototype.isFollowingOf, true,
      new xrx.label());

  // TODO: not sure if this is correct?
  if (test.getName() === 'node') 
      nodeset.unshift(new xrx.node[this.impl_.Document](this.instance_));

  return nodeset;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Text.prototype.getNodePrecedingSibling = function(test) {
  var stop = this.getLabel().clone();
  stop.parent();

  return this.find(test, xrx.node[this.impl_.Text].prototype.isFollowingSiblingOf, true,
      stop);
***REMOVED***

