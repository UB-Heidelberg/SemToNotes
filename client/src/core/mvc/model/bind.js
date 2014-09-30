***REMOVED***
***REMOVED*** @fileoverview Class implements data binding for the
***REMOVED*** model-view-controller.
***REMOVED***

goog.provide('xrx.bind');


goog.require('xrx.model');
goog.require('xrx.xpath');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.bind = function(element) {
***REMOVED***



  this.node_;



  this.recalculate()
***REMOVED***
goog.inherits(xrx.bind, xrx.model);



***REMOVED***
***REMOVED*** (Re)calculates the XPath expression defined in attribute
***REMOVED*** data-xrx-ref.
***REMOVED*** 
***REMOVED*** @override
***REMOVED***
xrx.bind.prototype.recalculate = function() {
  var result = xrx.xpath.evaluate(this.getRefExpression(), xrx.model.getInstanceDefault(), null, 
      xrx.xpath.XPathResultType.ANY_TYPE);
  this.node_ = [];
  var node;

  while(node = result.iterateNext()) {
    this.node_.push(node);
 ***REMOVED*****REMOVED***
***REMOVED***

