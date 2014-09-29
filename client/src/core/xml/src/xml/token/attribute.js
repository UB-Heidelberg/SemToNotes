***REMOVED***
***REMOVED*** @fileoverview Class represents the attribute token.
***REMOVED***

goog.provide('xrx.token.Attribute');



goog.require('xrx.token');
goog.require('xrx.token.Abstract');



***REMOVED***
***REMOVED*** Constructs a new attribute token.
***REMOVED***
***REMOVED*** @extends xrx.token
***REMOVED***
xrx.token.Attribute = function(label, opt_offset, opt_length) {
  goog.base(this, xrx.token.ATTRIBUTE, label, opt_offset, opt_length);
***REMOVED***
goog.inherits(xrx.token.Attribute, xrx.token.Abstract);



***REMOVED***
***REMOVED*** Returns the tag to which the attribute belongs.
***REMOVED*** @return {!xrx.token.StartEmptyTag}
***REMOVED***
xrx.token.Attribute.prototype.tag = function() {
  var label = this.label().clone();
  label.parent();

  return new xrx.token.StartEmptyTag(label);
***REMOVED***
