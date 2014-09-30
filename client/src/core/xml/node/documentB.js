/**
 * @fileoverview A class representing a document node
 * implementation working on a binary XML model.
 */

goog.provide('xrx.node.DocumentB');



goog.require('xrx.index');
goog.require('xrx.label');
goog.require('xrx.node');
goog.require('xrx.nodeB');
goog.require('xrx.node.Document');
goog.require('xrx.node.ElementB');
goog.require('xrx.node.TextB');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



/**
 * Creates a binary document node.
 *
 * @param {!xrx.instance}
 * @constructor
 */
xrx.node.DocumentB = function(instance) {
  goog.base(this, xrx.node.DOCUMENT, instance);
};
goog.inherits(xrx.node.DocumentB, xrx.nodeB);



xrx.node.DocumentB.prototype.getToken = xrx.node.Document.prototype.getToken;



xrx.node.DocumentB.prototype.getLabel = xrx.node.Document.prototype.getLabel;



xrx.node.DocumentB.prototype.getOffset = xrx.node.Document.prototype.getOffset;



xrx.node.DocumentB.prototype.getLength = xrx.node.Document.prototype.getLength;



xrx.node.DocumentB.prototype.isSameAs = xrx.node.Document.prototype.isSameAs;



xrx.node.DocumentB.prototype.isBefore = xrx.node.Document.prototype.isBefore;



xrx.node.DocumentB.prototype.isAfter = xrx.node.Document.prototype.isAfter;



xrx.node.DocumentB.prototype.isAncestorOf = xrx.node.Document.prototype.isAncestorOf;



xrx.node.DocumentB.prototype.isAttributeOf = xrx.node.Document.prototype.isAttributeOf;



xrx.node.DocumentB.prototype.isChildOf = xrx.node.Document.prototype.isChildOf;



xrx.node.DocumentB.prototype.isDescendantOf = xrx.node.Document.prototype.isDescendantOf;



xrx.node.DocumentB.prototype.isFollowingOf = xrx.node.Document.prototype.isFollowingOf;



xrx.node.DocumentB.prototype.isFollowingSiblingOf = xrx.node.Document.prototype.isFollowingSiblingOf;



xrx.node.DocumentB.prototype.isParentOf = xrx.node.Document.prototype.isParentOf;



xrx.node.DocumentB.prototype.isPrecedingOf = xrx.node.Document.prototype.isPrecedingOf;



xrx.node.DocumentB.prototype.isPrecedingSiblingOf = xrx.node.Document.prototype.isPrecedingSiblingOf;



xrx.node.DocumentB.prototype.getName = xrx.node.Document.prototype.getName;



xrx.node.DocumentB.prototype.getNamespaceUri = xrx.node.Document.prototype.getNamespaceUri;



xrx.node.DocumentB.prototype.getStringValue = function() {
  var string = '';
  var xml = this.instance_.xml();
  var row;

  for(var key = 0; key <= this.getIndex().getLastKey(); key++) {
    row = this.getIndex().getRowByKey(key);
    string += xml.substr(row.getOffset() + row.getLength1(),
        row.getLength2() - row.getLength1());
  };

  return string;
};



xrx.node.DocumentB.prototype.getXml = xrx.node.Document.prototype.getXml;



xrx.node.DocumentB.prototype.getNodeAncestor = xrx.node.Document.prototype.getNodeAncestor;



xrx.node.DocumentB.prototype.getNodeAttribute = xrx.node.Document.prototype.getNodeAttribute;



xrx.node.DocumentB.prototype.getNodeChild = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  var element = new xrx.node.ElementB(this.instance_, 0);

  if (test.matches(element)) nodeset.add(element);

  return nodeset;
};



xrx.node.DocumentB.prototype.getNodeDescendant = function(test) {
  var nodeset = new xrx.xpath.NodeSet();
  var index = this.instance_.getIndex();
  index.iterSetKey(0);
  var row = index.iterGetRow();
  var element;
  var text;
  var needTextNode = test.needsTextNode();

  do {

    if (row.getType() !== xrx.token.END_TAG) {
      element = new xrx.node.ElementB(this.instance_, index.iterGetKey());
      if (test.matches(element)) {
        nodeset.add(element);
      }
    }

    if (needTextNode && row.getLength1() !== row.getLength2()) {
      text = new xrx.node.TextB(this.instance_, index.iterGetKey());
      if (test.matches(text)) {
        nodeset.add(text);
      }
    }
 
  } while(row = index.iterNext());

  return nodeset;
};



xrx.node.DocumentB.prototype.getNodeFollowing = xrx.node.Document.prototype.getNodeFollowing;



xrx.node.DocumentB.prototype.getNodeFollowingSibling = xrx.node.Document.prototype.getNodeFollowingSibling;



xrx.node.DocumentB.prototype.getNodeParent = xrx.node.Document.prototype.getNodeParent;



xrx.node.DocumentB.prototype.getNodePreceding = xrx.node.Document.prototype.getNodePreceding;



xrx.node.DocumentB.prototype.getNodePrecedingSibling = xrx.node.Document.prototype.getNodePrecedingSibling;

