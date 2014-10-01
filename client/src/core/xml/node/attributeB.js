***REMOVED***
***REMOVED*** @fileoverview A class representing a attribute node
***REMOVED*** implementation working on a binary XML model.
***REMOVED***

goog.provide('xrx.node.AttributeB');


goog.require('xrx.node');
goog.require('xrx.node.Attribute');
goog.require('xrx.nodeB');
goog.require('xrx.xpath.NodeSet');


***REMOVED***
***REMOVED*** Creates a binary attribute node.
***REMOVED***
***REMOVED*** @param {!integer}
***REMOVED*** @param {!xrx.node.ElementB}
***REMOVED***
***REMOVED***
xrx.node.AttributeB = function(num, parent) {
  goog.base(this, xrx.node.ATTRIBUTE);


  this.num_ = num;



  this.parent_ = parent;
***REMOVED***
goog.inherits(xrx.node.AttributeB, xrx.nodeB);



xrx.node.AttributeB.prototype.getStream = xrx.node.Attribute.prototype.getStream;



xrx.node.AttributeB.prototype.getInstance = xrx.node.Attribute.prototype.getInstance;



xrx.node.AttributeB.prototype.getToken = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength1());
  var loc = this.getStream().attribute(xml, this.num_);
  
  return new xrx.token.Attribute(this.getLabel(), loc.offset, loc.length);
***REMOVED***



xrx.node.AttributeB.prototype.getLabel = function() {
  var label = this.parent_.getLabel();
  label.push(this.num_);

  return label;
***REMOVED***



xrx.node.AttributeB.prototype.getOffset = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attribute(xml, this.num_);

  return loc.offset;
***REMOVED***



xrx.node.AttributeB.prototype.getLength = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attribute(xml, this.num_);

  return loc.length;
***REMOVED***



xrx.node.AttributeB.prototype.isSameAs = xrx.node.Attribute.prototype.isSameAs;



xrx.node.AttributeB.prototype.isBefore = xrx.node.Attribute.prototype.isBefore;



xrx.node.AttributeB.prototype.isAfter = xrx.node.Attribute.prototype.isAfter;



xrx.node.AttributeB.prototype.isAncestorOf = xrx.node.Attribute.prototype.isAncestorOf;



xrx.node.AttributeB.prototype.isAttributeOf = xrx.node.Attribute.prototype.isAttributeOf;



xrx.node.AttributeB.prototype.isChildOf = xrx.node.Attribute.prototype.isChildOf;



xrx.node.AttributeB.prototype.isDescendantOf = xrx.node.Attribute.prototype.isDescendantOf;



xrx.node.AttributeB.prototype.isFollowingOf = xrx.node.Attribute.prototype.isFollowingOf;



xrx.node.AttributeB.prototype.isFollowingSiblingOf = xrx.node.Attribute.prototype.isFollowingSiblingOf;



xrx.node.AttributeB.prototype.isParentOf = xrx.node.Attribute.prototype.isParentOf;



xrx.node.AttributeB.prototype.isPrecedingOf = xrx.node.Attribute.prototype.isPrecedingOf;



xrx.node.AttributeB.prototype.isPrecedingSiblingOf = xrx.node.Attribute.prototype.isPrecedingSiblingOf;



xrx.node.AttributeB.prototype.getName = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attrName(xml, this.num_);

  return loc.xml(xml);
***REMOVED***



xrx.node.AttributeB.prototype.getNamespaceUri = function(prefix) {
  var ns = this.getInstance().getIndex().getNamespace(
      this.parent_.getToken(), prefix);

  return ns ? ns.uri : '';
***REMOVED***



xrx.node.AttributeB.prototype.getStringValue = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attrValue(xml, this.num_);

  return loc.xml(xml);
***REMOVED***



xrx.node.AttributeB.prototype.getXml = function() {
  var xml = this.getInstance().xml().substr(this.parent_.getRow().getOffset(),
      this.parent_.getRow().getLength2());
  var loc = this.getStream().attribute(xml, this.num_);

  return loc.xml(xml);
***REMOVED***



xrx.node.AttributeB.prototype.getNodeAncestor = xrx.node.Attribute.prototype.getNodeAncestor;



xrx.node.AttributeB.prototype.getNodeAttribute = xrx.node.Attribute.prototype.getNodeAttribute;



xrx.node.AttributeB.prototype.getNodeChild = xrx.node.Attribute.prototype.getNodeChild;



xrx.node.AttributeB.prototype.getNodeDescendant = xrx.node.Attribute.prototype.getNodeDescendant;



xrx.node.AttributeB.prototype.getNodeFollowing = xrx.node.Attribute.prototype.getNodeFollowing;



xrx.node.AttributeB.prototype.getNodeFollowingSibling = xrx.node.Attribute.prototype.getNodeFollowingSibling;



xrx.node.AttributeB.prototype.getNodeParent = xrx.node.Attribute.prototype.getNodeParent;



xrx.node.AttributeB.prototype.getNodePreceding = xrx.node.Attribute.prototype.getNodePreceding;



xrx.node.AttributeB.prototype.getNodePrecedingSibling = xrx.node.Attribute.prototype.getNodePrecedingSibling;
