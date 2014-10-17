***REMOVED***
***REMOVED*** @fileoverview A node implementation based on a binary
***REMOVED*** XML model.
***REMOVED***

goog.provide('xrx.node.Binary');


goog.require('xrx.node');
goog.require('xrx.node.Node');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



***REMOVED***
***REMOVED*** Base class to construct a binary node.
***REMOVED***
***REMOVED***
xrx.node.Binary = function(type, document, key) {

  goog.base(this, type, document);

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
goog.inherits(xrx.node.Binary, xrx.node.Node);



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Binary.prototype.getToken = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Binary.prototype.getLabel = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Binary.prototype.getOffset = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Binary.prototype.getLength = goog.abstractMethod;



***REMOVED***
***REMOVED*** @return {!integer}
***REMOVED***
xrx.node.Binary.prototype.getKey = function() {
  return this.key_;
***REMOVED***



***REMOVED***
***REMOVED*** @return {!xrx.index}
***REMOVED***
xrx.node.Binary.prototype.getIndex = function() {
  return this.document_.getInstance().getIndex();
***REMOVED***


***REMOVED***
***REMOVED*** @return {!xrx.index.Row}
***REMOVED***
xrx.node.Binary.prototype.getRow = function() {
  return this.getIndex().getRowByKey(this.key_);
***REMOVED***

