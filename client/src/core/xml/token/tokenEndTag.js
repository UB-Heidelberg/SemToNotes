***REMOVED***
***REMOVED*** @fileoverview Class represents the end-tag token.
***REMOVED***

goog.provide('xrx.token.EndTag');



goog.require('xrx.token');
goog.require('xrx.token.Token');



***REMOVED***
***REMOVED*** Constructs a new end tag token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.EndTag = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.END_TAG, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.EndTag, xrx.token.Token);



***REMOVED***
***REMOVED*** Compares the generic type of two tokens.
***REMOVED***
***REMOVED*** @param {!number} type The type to check against.
***REMOVED*** @return {!boolean}
***REMOVED***
xrx.token.EndTag.prototype.typeOf = function(type) {
  return this.type_ === type || xrx.token.TAG === type;
***REMOVED***
