***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.mvc.Namespace');



***REMOVED***
goog.require('xrx.xpath');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Namespace = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Namespace, xrx.mvc.ComponentModel);



xrx.mvc.Namespace.prototype.mvcRecalculate = function() {
  var prefix = this.getDataset('xrxPrefix');
  var uri = this.getDataset('xrxUri');
  xrx.xpath.declareNamespace(prefix, uri);
***REMOVED***
