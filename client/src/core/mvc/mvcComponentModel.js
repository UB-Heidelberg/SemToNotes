***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.mvc.ComponentModel');



goog.require('xrx.mvc.Component');
goog.require('xrx.mvc.Mvc');



xrx.mvc.ComponentModel = function(element) {

***REMOVED***

  xrx.mvc.Mvc.addModelComponent(this.getId(), this);
***REMOVED***
goog.inherits(xrx.mvc.ComponentModel, xrx.mvc.Component);
