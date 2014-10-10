***REMOVED***
***REMOVED*** @fileoverview A class implementing the text node
***REMOVED*** type for streaming XPath evaluation.
***REMOVED***

goog.provide('xrx.node.TextS');


goog.require('xrx.node');
goog.require('xrx.node.Text');
goog.require('xrx.nodeS');
goog.require('xrx.token');
goog.require('xrx.token.NotTag');



***REMOVED***
***REMOVED*** Constructs a new streaming text node.
***REMOVED***
***REMOVED*** @param {!xrx.mvc.Instance} instance
***REMOVED*** @param {!xrx.token} tag
***REMOVED*** @param {!integer} length
***REMOVED***
***REMOVED***
xrx.node.TextS = function(instance, tag, length) {
  goog.base(this, xrx.node.TEXT, instance, null);



  this.tag_ = tag;



  this.length_ = length;
***REMOVED***
goog.inherits(xrx.node.TextS, xrx.nodeS);



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getToken = function() {
  return new xrx.token.NotTag(this.getLabel(), this.getOffset(),
      this.getLength());
***REMOVED***




***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getLabel = function() {
  var label = this.tag_.label().clone();
  if (this.tag_.type() === xrx.token.START_TAG) {
    label.push0();
  } else if (this.tag_.type() === xrx.token.END_TAG) {
    var tmp = label.pop();
    label.push(tmp + .5);
  } else {***REMOVED***

  return label;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getOffset = function() {
  return this.tag_.offset() + this.tag_.length();
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getLength = function() {
  return this.length_;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isSameAs = xrx.node.Text.prototype.isSameAs;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isBefore = xrx.node.Text.prototype.isBefore;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isAfter = xrx.node.Text.prototype.isAfter;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isAncestorOf = xrx.node.Text.prototype.isAncestorOf;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isAttributeOf = xrx.node.Text.prototype.isAttributeOf;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isChildOf = xrx.node.Text.prototype.isChildOf;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isDescendantOf = xrx.node.Text.prototype.isDescendantOf;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isFollowingOf = xrx.node.Text.prototype.isFollowingOf;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isFollowingSiblingOf = xrx.node.Text.prototype.isFollowingSiblingOf;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isParentOf = xrx.node.Text.prototype.isParentOf;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isPrecedingOf = xrx.node.Text.prototype.isPrecedingOf;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.isPrecedingSiblingOf = xrx.node.Text.prototype.isPrecedingSiblingOf;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getName = xrx.node.Text.prototype.getName;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNamespaceUri = xrx.node.Text.prototype.getNamespaceUri;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getStringValue = xrx.node.Text.prototype.getStringValue;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getXml = xrx.node.Text.prototype.getXml;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNodeAncestor = xrx.node.Text.prototype.getNodeAncestor;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNodeAttribute = xrx.node.Text.prototype.getNodeAttribute;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNodeChild = xrx.node.Text.prototype.getNodeChild;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNodeDescendant = xrx.node.Text.prototype.getNodeDescendant;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNodeFollowing = xrx.node.Text.prototype.getNodeFollowing;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNodeFollowingSibling = function(test) {
  var stop = this.tag_.label().clone();
  stop.parent();

  return this.find(test, xrx.node[this.impl_.Text].prototype.isPrecedingSiblingOf,
      false, stop);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNodeParent = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  var element = new xrx.node.ElementS(this.getInstance(), this.tag_);

  if (test.matches(element)) nodeset.add(element);

  return nodeset;
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNodePreceding = xrx.node.Text.prototype.getNodePreceding;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.TextS.prototype.getNodePrecedingSibling = xrx.node.Text.prototype.getNodePrecedingSibling;




***REMOVED***
***REMOVED*** @param {!xrx.xml.Label}
***REMOVED***
xrx.node.TextS.prototype.forward = function(stop) {
***REMOVED***
  var traverse = new xrx.xml.Traverse(this.instance_.xml());
  var token;

  traverse.rowStartTag = function(label, offset, length1, length2) {
    var tag = new xrx.token.StartTag(label.clone(), offset, length1);
    self.eventNode(new xrx.node.ElementS(self.instance_, tag));
    if (length1 !== length2) {
      self.eventNode(new xrx.node.TextS(self.instance_, tag, length2 - length1));
    }
 ***REMOVED*****REMOVED***

  traverse.rowEmptyTag = function(label, offset, length1, length2) {
    var tag = new xrx.token.EmptyTag(label.clone(), offset, length1);

    self.eventNode(new xrx.node.ElementS(self.instance_, tag));
    if (length1 !== length2) {
      self.eventNode(new xrx.node.TextS(self.instance_, tag, length2 - length1));
    }
 ***REMOVED*****REMOVED***

  traverse.rowEndTag = function(label, offset, length1, length2) {
    var tag = new xrx.token.EndTag(label.clone(), offset, length1);

    if (length1 !== length2) {
      self.eventNode(new xrx.node.TextS(self.instance_, tag, length2 - length1));
    }
    if (label.sameAs(stop)) traverse.stop();
 ***REMOVED*****REMOVED***

  traverse.forward(self.tag_);
***REMOVED***



***REMOVED***
***REMOVED*** @param {!xrx.xml.Label}
***REMOVED***
xrx.node.TextS.prototype.backward = function(stop) {
***REMOVED***
  var traverse = new xrx.xml.Traverse(this.instance_.xml());
  var token;

  traverse.rowStartTag = function(label, offset, length1, length2) {
    var tag = new xrx.token.StartTag(label.clone(), offset, length1);

    if (length1 !== length2) {
      //self.eventNode(new xrx.node.TextS(self.instance_, tag, length2 - length1));
    }
    self.eventNode(new xrx.node.ElementS(self.instance_, tag));
    if (label.sameAs(stop)) traverse.stop();
 ***REMOVED*****REMOVED***

  traverse.rowEmptyTag = function(label, offset, length1, length2) {
    var tag = new xrx.token.EmptyTag(label.clone(), offset, length1);

    if (length1 !== length2) {
      //self.eventNode(new xrx.node.TextS(self.instance_, tag, length2 - length1));
    }
    self.eventNode(new xrx.node.ElementS(self.instance_, tag));
    if (label.sameAs(stop)) traverse.stop();
 ***REMOVED*****REMOVED***

  traverse.rowEndTag = function(label, offset, length1, length2) {
    var tag = new xrx.token.EndTag(label.clone(), offset, length1);

    if (length1 !== length2) {
      //self.eventNode(new xrx.node.TextS(self.instance_, tag, length2 - length1));
    }
 ***REMOVED*****REMOVED***
  traverse.backward(self.tag_);
***REMOVED***

