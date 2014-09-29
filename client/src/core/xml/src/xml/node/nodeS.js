***REMOVED***
***REMOVED*** @fileoverview A node implementation for streaming XPath evaluation.
***REMOVED***

goog.provide('xrx.nodeS');



goog.require('xrx.node');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.nodeS = function(type, instance, token) {
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
goog.inherits(xrx.nodeS, xrx.node);



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.nodeS.prototype.getToken = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.nodeS.prototype.getLabel = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.nodeS.prototype.getOffset = goog.abstractMethod;



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.nodeS.prototype.getLength = goog.abstractMethod;

