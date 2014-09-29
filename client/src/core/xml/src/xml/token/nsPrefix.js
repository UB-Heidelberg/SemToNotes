***REMOVED***
***REMOVED*** @fileoverview Class represents the namespace prefix token.
***REMOVED***

goog.provide('xrx.token.NsPrefix');



goog.require('xrx.token.Abstract');



***REMOVED***
***REMOVED*** Constructs a new namespace prefix token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.NsPrefix = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.NS_PREFIX, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.NsPrefix, xrx.token.Abstract);
