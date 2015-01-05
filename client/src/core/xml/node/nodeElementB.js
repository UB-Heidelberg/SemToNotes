/**
 * @fileoverview A class representing a element node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.ElementB');



goog.require('xrx.node');
goog.require('xrx.node.Element');
goog.require('xrx.node.Binary');
goog.require('xrx.token');
goog.require('xrx.token.EndTag');
goog.require('xrx.xpath.NodeSet');



/**
 * Creates a binary element node.
 *
 * @param {!xrx.node.Document}
 * @param {!integer} 
 * @constructor
 */
xrx.node.ElementB = function(document, key) {

  goog.base(this, xrx.node.ELEMENT, document, key);
};
goog.inherits(xrx.node.ElementB, xrx.node.Binary);



/**
 * 
 */
xrx.node.ElementB.prototype.getToken = function() {
  return this.getIndex().getTag(this.key_);
};



/**
 * 
 */
xrx.node.ElementB.prototype.getLabel = function() {
  return this.getIndex().getLabel(this.key_);
};



/**
 * 
 */
xrx.node.ElementB.prototype.getOffset = function() {
  return this.getRow().getOffset();
};



/**
 * 
 */
xrx.node.ElementB.prototype.getLength = function() {
  return this.getRow().getLength1();
};



/**
 *
 */
xrx.node.ElementB.prototype.isSameAs = xrx.node.Element.prototype.isSameAs;



/**
 *
 */
xrx.node.ElementB.prototype.isBefore = xrx.node.Element.prototype.isBefore;



/**
 *
 */
xrx.node.ElementB.prototype.isAfter = xrx.node.Element.prototype.isAfter;



/**
 *
 */
xrx.node.ElementB.prototype.isAncestorOf = xrx.node.Element.prototype.isAncestorOf;



/**
 *
 */
xrx.node.ElementB.prototype.isAttributeOf = xrx.node.Element.prototype.isAttributeOf;



/**
 *
 */
xrx.node.ElementB.prototype.isChildOf = xrx.node.Element.prototype.isChildOf;



/**
 *
 */
xrx.node.ElementB.prototype.isDescendantOf = xrx.node.Element.prototype.isDescendantOf;



/**
 *
 */
xrx.node.ElementB.prototype.isFollowingOf = xrx.node.Element.prototype.isFollowingOf;



/**
 *
 */
xrx.node.ElementB.prototype.isFollowingSiblingOf = xrx.node.Element.prototype.isFollowingSiblingOf;



/**
 *
 */
xrx.node.ElementB.prototype.isParentOf = function(node) {
  if (node.getType() === xrx.node.ELEMENT) {
    return this.getKey() === node.getRow().getParent() && node.getKey() !== 0;
  } else {
    return this.getLabel().isParentOf(node.getLabel());
  }
};



/**
 *
 */
xrx.node.ElementB.prototype.isPrecedingOf = xrx.node.Element.prototype.isPrecedingOf;



/**
 *
 */
xrx.node.ElementB.prototype.isPrecedingSiblingOf = xrx.node.Element.prototype.isPrecedingSiblingOf;



/**
 *
 */
xrx.node.ElementB.prototype.getName = function() {
  var inst = this.getDocument().getInstance();
  var tag = inst.getIndex().getTag(this.key_);
  var loc = inst.getStream().tagName(tag.xml(inst.xml()));
  loc.offset += tag.offset();

  return loc.xml(inst.xml());
};



/**
 * 
 */
xrx.node.ElementB.prototype.getNamespaceUri = function(prefix) {
  var inst = this.getDocument().getInstance();
  var ns = inst.getIndex().getNamespace(this.getToken(), prefix);

  return ns ? ns.uri : '';
};



/**
 * 
 */
xrx.node.ElementB.prototype.getStringValue = function() {
  if (this.getRow().getType() === xrx.token.EMPTY_TAG) return '';

  var string = '';
  var xml = this.getDocument().getInstance().xml();
  var row;
  var selfLabel = this.getLabel();

  for(var key = this.getKey(); key <= this.getIndex().getLastKey(); key++) {
    row = this.getIndex().getRowByKey(key);
    if (row.getType() === xrx.token.END_TAG && 
        this.getIndex().getLabel(key).sameAs(selfLabel)) break;
    string += xml.substr(row.getOffset() + row.getLength1(),
        row.getLength2() - row.getLength1());
  };

  return string;
};



/**
 * 
 */
xrx.node.ElementB.prototype.getXml = function() {

  if (this.getRow().getType() === xrx.token.EMPTY_TAG) {

    return this.getDocument().getInstance().xml().substr(this.getOffset(), this.getLength());
  } else {
    var row = this.getIndex().getRowByTag(new xrx.token.EndTag(
        this.getLabel()), this.getKey());

    return this.getDocument().getInstance().xml().substring(this.getOffset(), row.getOffset() +
        row.getLength1());
  }
};



/**
 * 
 */
xrx.node.ElementB.prototype.getNodeAncestor = xrx.node.Element.prototype.getNodeAncestor;



/**
 * 
 */
xrx.node.ElementB.prototype.getAttributes = xrx.node.Element.prototype.getAttributes;



/**
 * 
 */
xrx.node.ElementB.prototype.getNodeAttribute = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  var row = this.getRow();
  var xml = this.getDocument().getInstance().xml().substr(row.getOffset(), row.getLength2());
  var locs = this.getDocument().getInstance().getStream().attributes(xml);
  var i = 0;
  var a;
  var attr;
  for(var l in locs) {
    a = locs[l];
    attr = new xrx.node.AttributeB(parseInt(l), this);
    if (test.matches(attr)) nodeset.add(attr);
  };
  return nodeset;
};



/**
 * 
 */
xrx.node.ElementB.prototype.getNodeChild = xrx.node.Element.prototype.getNodeChild;



/**
 * 
 */
xrx.node.ElementB.prototype.getNodeDescendant = xrx.node.Element.prototype.getNodeDescendant;



/**
 * 
 */
xrx.node.ElementB.prototype.getNodeFollowing = xrx.node.Element.prototype.getNodeFollowing;



/**
 * 
 */
xrx.node.ElementB.prototype.getNodeFollowingSibling = xrx.node.Element.prototype.getNodeFollowingSibling;



/**
 * 
 */
xrx.node.ElementB.prototype.getNodeParent = xrx.node.Element.prototype.getNodeParent;



/**
 * 
 */
xrx.node.ElementB.prototype.getNodePreceding = xrx.node.Element.prototype.getNodePreceding;



/**
 * 
 */
xrx.node.ElementB.prototype.getNodePrecedingSibling = xrx.node.Element.prototype.getNodePrecedingSibling;



/**
 * @param {!xrx.xml.Label}
 */
xrx.node.ElementB.prototype.forward = function(stop, needTextNode) {
  var self = this;
  var index = this.getDocument().getInstance().getIndex();
  index.iterSetKey(this.key_);
  var row = index.iterGetRow();
  var type;

  do {
    type = row.getType();

    switch(type) {
    case xrx.token.START_TAG:
      self.eventNode(new xrx.node.ElementB(self.getDocument(), index.iterGetKey()));
      break;
    case xrx.token.EMPTY_TAG:
      self.eventNode(new xrx.node.ElementB(self.getDocument(), index.iterGetKey()));
      break;
    default:
      break;
    };

    if (needTextNode && row.getLength1() !== row.getLength2()) {
      self.eventNode(new xrx.node.TextB(self.getDocument(), index.iterGetKey()));
    }

    if (type === xrx.token.END_TAG &&
        self.getIndex().getLabel(index.iterGetKey()).sameAs(stop)) break;

  } while (row = index.iterNext());
};



/**
 * @param {!xrx.xml.Label}
 */
xrx.node.ElementB.prototype.backward = function(stop, needTextNode) {
  var self = this;
  var index = this.getIndex();
  index.iterSetKey(this.key_);
  var row = index.iterGetRow();
  var type;

  do {
    type = row.getType();

    if (needTextNode && row.getLength1() !== row.getLength2()) {
      self.eventNode(new xrx.node.TextB(self.getDocument(), index.iterGetKey()));
    }

    switch(type) {
    case xrx.token.START_TAG:
      self.eventNode(new xrx.node.ElementB(self.getDocument(), index.iterGetKey()));
      break;
    case xrx.token.EMPTY_TAG:
      self.eventNode(new xrx.node.ElementB(self.getDocument(), index.iterGetKey()));
      break;
    default:
      break;
    };

    if (type === xrx.token.END_TAG &&
        self.getIndex().getLabel(index.iterGetKey()).sameAs(stop)) break;

  } while (row = index.iterPrevious());
};



/**
 * 
 */
xrx.node.ElementB.prototype.find = xrx.node.Node.prototype.find;
