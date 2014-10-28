***REMOVED***
***REMOVED*** @fileoverview A class representing a set-value action.
***REMOVED***

goog.provide('xrx.mvc.Update');



***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Update = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Update, xrx.mvc.ComponentModel);



xrx.mvc.Update.prototype.mvcRecalculate = function() {***REMOVED***



xrx.mvc.Update.prototype.execute = function() {
  xrx.mvc.Controller.updateNode(this, this.getNode(0), this.getValue());
***REMOVED***
