***REMOVED***
***REMOVED*** @fileoverview A node implementation for streaming XPath evaluation.
***REMOVED***

goog.provide('xrx.node.Streaming');



goog.require('xrx.node');
goog.require('xrx.node.Node');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.node.Streaming = function(type, instance, token) {
  goog.base(this, type, instance);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.token}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.token_ = token;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {enum}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.impl_ = {
    Document: 'DocumentS',
    Element: 'ElementS',
    Attribute: 'AttributeS',
    Text: 'TextS'
 ***REMOVED*****REMOVED***
***REMOVED***
goog.inherits(xrx.node.Streaming, xrx.node.Node);



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Streaming.prototype.getToken = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Streaming.prototype.getLabel = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Streaming.prototype.getOffset = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.node.Streaming.prototype.getLength = goog.abstractMethod;

