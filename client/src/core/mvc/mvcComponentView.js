***REMOVED***
***REMOVED*** @fileoverview Abstract class which represents a
***REMOVED*** control of the model-view-controller.
***REMOVED***

goog.provide('xrx.mvc.ComponentView');



***REMOVED***
goog.require('goog.dom.dataset');
goog.require('xrx.mvc.Component');
goog.require('xrx.mvc');
goog.require('xrx.node.ElementS');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.ComponentView = function(element) {

***REMOVED***

  xrx.mvc.addViewComponent(this.getId(), this);

  this.createDom();

  this.mvcRefresh();
***REMOVED***
goog.inherits(xrx.mvc.ComponentView, xrx.mvc.Component);
