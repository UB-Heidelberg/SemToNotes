***REMOVED***
***REMOVED*** @fileoverview Class represents the attribute-name token.
***REMOVED***

goog.provide('xrx.token.AttrName');



goog.require('xrx.token');
goog.require('xrx.token.Abstract');
goog.require('xrx.token.Attribute');



***REMOVED***
***REMOVED*** Constructs a new attribute-name token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.AttrName = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.ATTR_NAME, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.AttrName, xrx.token.Abstract);



***REMOVED***
***REMOVED*** Returns the tag to which the attribute-name belongs.
***REMOVED*** @return {!xrx.token.StartEmptyTag}
***REMOVED***
xrx.token.AttrName.prototype.tag = xrx.token.Attribute.prototype.tag;
