***REMOVED***
***REMOVED*** @fileoverview Class implements data binding for the
***REMOVED*** model-view-controller.
***REMOVED***

goog.provide('xrx.mvc.Bind');



***REMOVED***
goog.require('xrx.xpath');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Bind = function(element) {

***REMOVED***

  this.node_;

  this.recalculate()
***REMOVED***
goog.inherits(xrx.mvc.Bind, xrx.mvc.ComponentModel);



xrx.mvc.Bind.prototype.getNode = function(num) {
  return this.node_[num];
***REMOVED***



***REMOVED***
***REMOVED*** (Re)calculates the XPath expression defined in attribute
***REMOVED*** data-xrx-ref.
***REMOVED*** 
***REMOVED*** @override
***REMOVED***
xrx.mvc.Bind.prototype.recalculate = function() {
  var result = xrx.xpath.evaluate(this.getRefExpression(), xrx.mvc.Mvc.getInstanceDefault(), null, 
      xrx.xpath.XPathResultType.ANY_TYPE);
  this.node_ = [];
  var node;
  while(node = result.iterateNext()) {
    this.node_.push(node);
 ***REMOVED*****REMOVED***
***REMOVED***
