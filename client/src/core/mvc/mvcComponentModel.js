***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.mvc.ComponentModel');



goog.require('xrx.mvc.Component');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.ComponentModel = function(element, uidl) {

  goog.base(this, element, uidl);

  xrx.mvc.addModelComponent(this.getId(), this);

  this.mvcRecalculate();
***REMOVED***
goog.inherits(xrx.mvc.ComponentModel, xrx.mvc.Component);
