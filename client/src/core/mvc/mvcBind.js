***REMOVED***
***REMOVED*** @fileoverview Class implements data binding for the
***REMOVED***     model-view-controller.
***REMOVED***

goog.provide('xrx.mvc.Bind');



***REMOVED***
goog.require('xrx.xpath');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Bind = function(element) {

  this.node_ = [];

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Bind, xrx.mvc.ComponentModel);



xrx.mvc.Bind.prototype.getNodes = function() {
  return this.node_;
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Bind.prototype.getNode = function(num) {
  return this.node_[num];
***REMOVED***



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.mvc.Bind.prototype.mvcRemove = function() {
  this.node_ = [];
***REMOVED***



***REMOVED***
***REMOVED*** (Re)calculates the component's node-set.
***REMOVED*** @override
***REMOVED***
xrx.mvc.Bind.prototype.mvcRecalculate = function() {
  var result = xrx.xpath.evaluate(this.getRefExpression(), undefined, null, 
      xrx.xpath.XPathResultType.ANY_TYPE);
  this.node_ = [];
  var node;
  while(node = result.iterateNext()) {
    this.node_.push(node);
 ***REMOVED*****REMOVED***
***REMOVED***
