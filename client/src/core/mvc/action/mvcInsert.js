***REMOVED***
***REMOVED*** @fileoverview A class representing an insert action.
***REMOVED***

goog.provide('xrx.mvc.Insert');



***REMOVED***
goog.require('xrx.mvc.Controller');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Insert = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Insert, xrx.mvc.ComponentModel);



xrx.mvc.Insert.prototype.mvcRecalculate = function() {***REMOVED***



xrx.mvc.Insert.prototype.getNode = function(opt_num, opt_dataset) {
  var dataset = opt_dataset || 'xrxTarget';
  return goog.base(this, 'getNode', opt_num, dataset);
***REMOVED***


xrx.mvc.Insert.prototype.execute = function() {
  var origin = this.getNode(0, 'xrxOrigin');
  var target = this.getNode();
  xrx.mvc.Controller.insertNode(this, target, origin);
***REMOVED***
