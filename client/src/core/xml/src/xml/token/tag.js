***REMOVED***
***REMOVED*** @fileoverview Class represents a generic token for tags of
***REMOVED*** any kind.
***REMOVED***

goog.provide('xrx.token.Tag');



goog.require('xrx.token');
goog.require('xrx.token.Abstract');



***REMOVED***
***REMOVED*** Constructs a new tag token. The tag token is a generic 
***REMOVED*** container token for all kinds of native tag tokens as 
***REMOVED*** well as all generic tag tokens.
***REMOVED*** 
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.Tag = function(label) {
  goog.base(this, xrx.token.TAG, label);
***REMOVED***
goog.inherits(xrx.token.Tag, xrx.token.Abstract);



***REMOVED***
***REMOVED*** Compares the generic type of two tokens.
***REMOVED***
***REMOVED*** @param {!number} type The type to check against.
***REMOVED*** @return {!boolean}
***REMOVED***
xrx.token.Tag.prototype.typeOf = function(type) {
  return this.type_ === type || xrx.token.START_TAG === type
      || xrx.token.END_TAG === type || xrx.token.EMPTY_TAG === type || 
      xrx.token.START_EMPTY_TAG === type;
***REMOVED***
