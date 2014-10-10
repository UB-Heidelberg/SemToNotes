***REMOVED***
***REMOVED*** @fileoverview Class represents the namespace token.
***REMOVED***

goog.provide('xrx.token.Namespace');



goog.require('xrx.token');
goog.require('xrx.token.Token');



***REMOVED***
***REMOVED*** Constructs a new namespace token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.Namespace = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.NAMESPACE, label, opt_offset, opt_length);  
***REMOVED***
goog.inherits(xrx.token.Namespace, xrx.token.Token);
