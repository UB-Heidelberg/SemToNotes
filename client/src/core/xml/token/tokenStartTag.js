***REMOVED***
***REMOVED*** @fileoverview Class represents the start-tag token.
***REMOVED***

goog.provide('xrx.token.StartTag');



goog.require('xrx.token');
goog.require('xrx.token.Token');



***REMOVED***
***REMOVED*** Constructs a new start tag token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.StartTag = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.START_TAG, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.StartTag, xrx.token.Token);



***REMOVED***
***REMOVED*** Compares the generic type of two tokens.
***REMOVED***
***REMOVED*** @param {!number} type The type to check against.
***REMOVED*** @return {!boolean}
***REMOVED***
xrx.token.StartTag.prototype.typeOf = function(type) {
  return this.type_ === type || xrx.token.START_EMPTY_TAG === type || 
      xrx.token.TAG === type;
***REMOVED***
