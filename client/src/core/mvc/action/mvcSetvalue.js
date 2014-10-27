***REMOVED***
***REMOVED*** @fileoverview A class representing a set-value action.
***REMOVED***

goog.provide('xrx.mvc.Setvalue');



***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Setvalue = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Setvalue, xrx.mvc.ComponentModel);



xrx.mvc.Setvalue.prototype.mvcRecalculate = function() {***REMOVED***



xrx.mvc.Setvalue.prototype.execute = function() {
  xrx.mvc.Controller.updateNode(this, target, origin);
***REMOVED***
