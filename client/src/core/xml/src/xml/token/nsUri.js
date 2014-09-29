***REMOVED***
***REMOVED*** @fileoverview Class represents the namespace URI token.
***REMOVED***

goog.provide('xrx.token.NsUri');



goog.require('xrx.token.Abstract');



***REMOVED***
***REMOVED*** Constructs a new namespace URI token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.NsUri = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.NS_URI, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.NsUri, xrx.token.Abstract);
