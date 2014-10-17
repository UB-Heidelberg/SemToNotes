***REMOVED***
***REMOVED*** @fileoverview An abstract class representing the document node 
***REMOVED*** of the XDM interface.
***REMOVED***

goog.provide('xrx.node.Document');



goog.require('xrx.xml.Label');
goog.require('xrx.mvc');
goog.require('xrx.node');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



***REMOVED*** 
***REMOVED*** 
***REMOVED***
xrx.node.Document = function() {***REMOVED***



xrx.node.Document.prototype.getInstance = function() {
  return xrx.mvc.getModelComponent(this.instanceId_);
***REMOVED***



xrx.node.Document.prototype.getToken = function() {
  // TODO: implement this.
  return undefined;
***REMOVED***



xrx.node.Document.prototype.getLabel = function() {
  return new xrx.xml.Label();
***REMOVED***



xrx.node.Document.prototype.getOffset = function() {
  return 0;
***REMOVED***



xrx.node.Document.prototype.getLength = function() {
  // TODO: implement this.
  return undefined;
***REMOVED***



xrx.node.Document.prototype.isSameAs = function(node) {
  return node.getType() === xrx.node.DOCUMENT;
***REMOVED***



xrx.node.Document.prototype.isBefore = function(node) {
  return true;
***REMOVED***



xrx.node.Document.prototype.isAfter = function(node) {
  return false;
***REMOVED***



xrx.node.Document.prototype.isAncestorOf = function(node) {
  return true;
***REMOVED***



xrx.node.Document.prototype.isAttributeOf = function(node) {
  return false;
***REMOVED***



xrx.node.Document.prototype.isChildOf = function(node) {
 return false;
***REMOVED***



xrx.node.Document.prototype.isDescendantOf = function(node) {
  return false;
***REMOVED***



xrx.node.Document.prototype.isFollowingOf = function(node) {
  return false;
***REMOVED***



xrx.node.Document.prototype.isFollowingSiblingOf = function(node) {
  return false;
***REMOVED***



xrx.node.Document.prototype.isParentOf = function(node) {
  return node.getType() === xrx.node.ELEMENT && node.getLabel().sameAs(
      new xrx.xml.Label([1]));
***REMOVED***



xrx.node.Document.prototype.isPrecedingOf = function(node) {
  return false;
***REMOVED***



xrx.node.Document.prototype.isPrecedingSiblingOf = function(node) {
  return false;
***REMOVED***



xrx.node.Document.prototype.getName = function() {
  return '';
***REMOVED***



xrx.node.Document.prototype.getNamespaceUri = function(prefix) {
  return '';
***REMOVED***



xrx.node.Document.prototype.getXml = function() {
  return this.getInstance().xml();
***REMOVED***


xrx.node.Document.prototype.getNodeAncestor = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***



xrx.node.Document.prototype.getNodeAttribute = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***



xrx.node.Document.prototype.getNodeFollowing = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***



xrx.node.Document.prototype.getNodeFollowingSibling = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***



xrx.node.Document.prototype.getNodeParent = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***



xrx.node.Document.prototype.getNodePreceding = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***



xrx.node.Document.prototype.getNodePrecedingSibling = function(test) {
  return new xrx.xpath.NodeSet();
***REMOVED***
