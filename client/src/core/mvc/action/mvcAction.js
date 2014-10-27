***REMOVED***
***REMOVED*** @fileoverview A class representing an action.
***REMOVED***

goog.provide('xrx.mvc.Action');



goog.require('goog.array');
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Action = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Action, xrx.mvc.ComponentModel);



xrx.mvc.Action.prototype.mvcRecalculate = function() {***REMOVED***



xrx.mvc.Action.prototype.execute = function() {
  var children = goog.dom.getChildren(this.element_);
  goog.array.forEach(children, function(e, i, a) {
    xrx.mvc.getModelComponent(e.id).execute();
  });
***REMOVED***
