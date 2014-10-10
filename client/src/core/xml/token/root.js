***REMOVED***
***REMOVED*** @fileoverview Class represents the root token.
***REMOVED***

goog.provide('xrx.token.Root');



goog.require('xrx.token.Abstract');



***REMOVED***
***REMOVED*** Constructs a new root token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.Root = function() {
  goog.base(this, xrx.token.ROOT, new xrx.xml.Label(), 0, 0);
***REMOVED***
goog.inherits(xrx.token.Root, xrx.token.Abstract);
