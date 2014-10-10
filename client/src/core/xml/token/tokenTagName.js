***REMOVED***
***REMOVED*** @fileoverview Class represents the tag-name token.
***REMOVED***

goog.provide('xrx.token.TagName');



goog.require('xrx.token');
goog.require('xrx.token.Token');



***REMOVED***
***REMOVED*** Constructs a new tag name token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.TagName = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.TAG_NAME, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.TagName, xrx.token.Token);
