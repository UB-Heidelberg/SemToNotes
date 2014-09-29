***REMOVED***
***REMOVED*** @fileoverview Class represents the empty tag token.
***REMOVED***

goog.provide('xrx.token.EmptyTag');



goog.require('xrx.token');
goog.require('xrx.token.Abstract');


***REMOVED***
***REMOVED*** Constructs a new empty tag token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.EmptyTag = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.EMPTY_TAG, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.EmptyTag, xrx.token.Abstract);



***REMOVED***
***REMOVED*** Compares the generic type of two tokens.
***REMOVED***
***REMOVED*** @param {!number} type The type to check against.
***REMOVED*** @return {!boolean}
***REMOVED***
xrx.token.EmptyTag.prototype.typeOf = function(type) {
  return this.type_ === type || xrx.token.START_EMPTY_TAG === type || 
      xrx.token.TAG === type;
***REMOVED***
