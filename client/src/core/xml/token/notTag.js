***REMOVED***
***REMOVED*** @fileoverview Class represents a generic token called not-tag.
***REMOVED***

goog.provide('xrx.token.NotTag');



goog.require('xrx.token');
goog.require('xrx.token.Abstract');



***REMOVED***
***REMOVED*** Constructs a new not-tag token.
***REMOVED*** xrx.token.NotTag is a container token for all tokens which
***REMOVED*** are no tags and not part of a tag (attribute, namespace), 
***REMOVED*** i.e. text, comment, processing instruction.
***REMOVED***  
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.NotTag = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.NOT_TAG, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.NotTag, xrx.token.Abstract);
