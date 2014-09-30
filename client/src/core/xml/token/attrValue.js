***REMOVED***
***REMOVED*** @fileoverview Class represents the attribute-value token.
***REMOVED***

goog.provide('xrx.token.AttrValue');



goog.require('xrx.token');
goog.require('xrx.token.Abstract');
goog.require('xrx.token.Attribute');



***REMOVED***
***REMOVED*** Constructs a new attribute-value token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.AttrValue = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.ATTR_VALUE, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.AttrValue, xrx.token.Abstract);



***REMOVED***
***REMOVED*** Returns the tag to which the attribute value belongs.
***REMOVED*** @return {!xrx.token.StartEmptyTag}
***REMOVED***
xrx.token.AttrValue.prototype.tag = xrx.token.Attribute.prototype.tag;
