***REMOVED***
***REMOVED*** @fileoverview A class representing a element node
***REMOVED*** implementation working on a binary XML model.
***REMOVED***

goog.provide('xrx.node.ElementB');



goog.require('xrx.node');
goog.require('xrx.node.AttributeB');
goog.require('xrx.node.DocumentB');
goog.require('xrx.node.Element');
goog.require('xrx.node.TextB');
goog.require('xrx.nodeB');
goog.require('xrx.token');
goog.require('xrx.token.EndTag');
goog.require('xrx.xpath.NodeSet');



***REMOVED***
***REMOVED*** Creates a binary element node.
***REMOVED***
***REMOVED*** @param {!xrx.instance}
***REMOVED*** @param {!integer} 
***REMOVED***
***REMOVED***
xrx.node.ElementB = function(instance, key) {
  goog.base(this, xrx.node.ELEMENT, instance, key);

***REMOVED***
goog.inherits(xrx.node.ElementB, xrx.nodeB);



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getToken = function() {
  return this.getIndex().getTag(this.key_);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getLabel = function() {
  return this.getIndex().getLabel(this.key_);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getOffset = function() {
  return this.getRow().getOffset();
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getLength = function() {
  return this.getRow().getLength1();
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isSameAs = xrx.node.Element.prototype.isSameAs;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isBefore = xrx.node.Element.prototype.isBefore;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isAfter = xrx.node.Element.prototype.isAfter;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isAncestorOf = xrx.node.Element.prototype.isAncestorOf;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isAttributeOf = xrx.node.Element.prototype.isAttributeOf;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isChildOf = xrx.node.Element.prototype.isChildOf;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isDescendantOf = xrx.node.Element.prototype.isDescendantOf;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isFollowingOf = xrx.node.Element.prototype.isFollowingOf;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isFollowingSiblingOf = xrx.node.Element.prototype.isFollowingSiblingOf;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isParentOf = function(node) {
  if (node.getType() === xrx.node.ELEMENT) {
    return this.getKey() === node.getRow().getParent() && node.getKey() !== 0;
  } else {
    return this.getLabel().isParentOf(node.getLabel());
  }
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isPrecedingOf = xrx.node.Element.prototype.isPrecedingOf;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.isPrecedingSiblingOf = xrx.node.Element.prototype.isPrecedingSiblingOf;



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.ElementB.prototype.getName = function() {
  var inst = this.instance_;
  var tag = inst.getIndex().getTag(this.key_);
  var loc = inst.getStream().tagName(tag.xml(inst.xml()));
  loc.offset += tag.offset();

  return loc.xml(inst.xml());
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNamespaceUri = function(prefix) {
  var inst = this.instance_;
  var ns = inst.getIndex().getNamespace(this.getToken(), prefix);

  return ns ? ns.uri : '';
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getStringValue = function() {
  if (this.getRow().getType() === xrx.token.EMPTY_TAG) return '';

  var string = '';
  var xml = this.instance_.xml();
  var row;
  var selfLabel = this.getLabel();

  for(var key = this.getKey(); key <= this.getIndex().getLastKey(); key++) {
    row = this.getIndex().getRowByKey(key);
    if (row.getType() === xrx.token.END_TAG && 
        this.getIndex().getLabel(key).sameAs(selfLabel)) break;
    string += xml.substr(row.getOffset() + row.getLength1(),
        row.getLength2() - row.getLength1());
 ***REMOVED*****REMOVED***

  return string;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getXml = function() {

  if (this.getRow().getType() === xrx.token.EMPTY_TAG) {

    return this.instance_.xml().substr(this.getOffset(), this.getLength());
  } else {
    var row = this.getIndex().getRowByTag(new xrx.token.EndTag(
        this.getLabel()), this.getKey());

    return this.instance_.xml().substring(this.getOffset(), row.getOffset() +
        row.getLength1());
  }
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNodeAncestor = xrx.node.Element.prototype.getNodeAncestor;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNodeAttribute = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  var row = this.getRow();
  var xml = this.instance_.xml().substr(row.getOffset(), row.getLength2());
  var locs = this.instance_.getStream().attributes(xml);
  var i = 0;

  for(var l in locs) {
    var a = locs[l];
    var attr = new xrx.node.AttributeB(parseInt(l), this);
    nodeset.add(attr);
 ***REMOVED*****REMOVED***

  return nodeset;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNodeChild = xrx.node.Element.prototype.getNodeChild;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNodeDescendant = xrx.node.Element.prototype.getNodeDescendant;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNodeFollowing = xrx.node.Element.prototype.getNodeFollowing;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNodeFollowingSibling = xrx.node.Element.prototype.getNodeFollowingSibling;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNodeParent = xrx.node.Element.prototype.getNodeParent;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNodePreceding = xrx.node.Element.prototype.getNodePreceding;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.getNodePrecedingSibling = xrx.node.Element.prototype.getNodePrecedingSibling;



***REMOVED***
***REMOVED*** @param {!xrx.label}
***REMOVED***
xrx.node.ElementB.prototype.forward = function(stop, needTextNode) {
***REMOVED***
  var index = this.instance_.getIndex();
  index.iterSetKey(this.key_);
  var row = index.iterGetRow();
  var type;

  do {
    type = row.getType();

    switch(type) {
    case xrx.token.START_TAG:
      self.eventNode(new xrx.node.ElementB(self.instance_, index.iterGetKey()));
      break;
    case xrx.token.EMPTY_TAG:
      self.eventNode(new xrx.node.ElementB(self.instance_, index.iterGetKey()));
      break;
    default:
      break;
   ***REMOVED*****REMOVED***

    if (needTextNode && row.getLength1() !== row.getLength2()) {
      self.eventNode(new xrx.node.TextB(self.instance_, index.iterGetKey()));
    }

    if (type === xrx.token.END_TAG &&
        self.getIndex().getLabel(index.iterGetKey()).sameAs(stop)) break;

  } while (row = index.iterNext());
***REMOVED***



***REMOVED***
***REMOVED*** @param {!xrx.label}
***REMOVED***
xrx.node.ElementB.prototype.backward = function(stop, needTextNode) {
***REMOVED***
  var index = this.getIndex();
  index.iterSetKey(this.key_);
  var row = index.iterGetRow();
  var type;

  do {
    type = row.getType();

    if (needTextNode && row.getLength1() !== row.getLength2()) {
      self.eventNode(new xrx.node.TextB(self.instance_, index.iterGetKey()));
    }

    switch(type) {
    case xrx.token.START_TAG:
      self.eventNode(new xrx.node.ElementB(self.instance_, index.iterGetKey()));
      break;
    case xrx.token.EMPTY_TAG:
      self.eventNode(new xrx.node.ElementB(self.instance_, index.iterGetKey()));
      break;
    default:
      break;
   ***REMOVED*****REMOVED***

    if (type === xrx.token.END_TAG &&
        self.getIndex().getLabel(index.iterGetKey()).sameAs(stop)) break;

  } while (row = index.iterPrevious());
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.ElementB.prototype.find = xrx.node.prototype.find;

