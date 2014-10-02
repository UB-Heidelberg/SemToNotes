***REMOVED***
***REMOVED*** @fileoverview A node implementation based on a binary
***REMOVED*** XML model.
***REMOVED***

goog.provide('xrx.nodeB');


goog.require('xrx.node');
goog.require('xrx.node.Node');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



***REMOVED***
***REMOVED*** Base class to construct a binary node.
***REMOVED***
***REMOVED***
xrx.nodeB = function(type, instance, key) {
  goog.base(this, type, instance);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {integer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.key_ = key;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {enum}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.impl_ = {
    Document: 'DocumentB',
    Element: 'ElementB',
    Attribute: 'AttributeB',
    Text: 'TextB'
 ***REMOVED*****REMOVED***
***REMOVED***
goog.inherits(xrx.nodeB, xrx.node.Node);



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.nodeB.prototype.getToken = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.nodeB.prototype.getLabel = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.nodeB.prototype.getOffset = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.nodeB.prototype.getLength = goog.abstractMethod;



***REMOVED***
***REMOVED*** @return {!integer}
***REMOVED***
xrx.nodeB.prototype.getKey = function() {
  return this.key_;
***REMOVED***



***REMOVED***
***REMOVED*** @return {!xrx.index}
***REMOVED***
xrx.nodeB.prototype.getIndex = function() {
  return this.instance_.getIndex();
***REMOVED***


***REMOVED***
***REMOVED*** @return {!xrx.index.row}
***REMOVED***
xrx.nodeB.prototype.getRow = function() {
  return this.getIndex().getRowByKey(this.key_);
***REMOVED***

