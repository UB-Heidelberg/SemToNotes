***REMOVED***
***REMOVED*** @fileoverview A class implementing the insert action.
***REMOVED***

goog.provide('xrx.mvc.Insert');



goog.require('xrx.mvc.Controller');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Insert = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Insert, xrx.mvc.ComponentModel);



xrx.mvc.Insert.prototype.mvcRecalculate = function() {***REMOVED***



xrx.mvc.Insert.prototype.execute = function() {
  var origin = this.getNode(0, 'xrxOrigin');
  var target = this.getNode(0, 'xrxTarget');
  xrx.mvc.Controller.insertNode(this, target, origin);
***REMOVED***
