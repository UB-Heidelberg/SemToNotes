***REMOVED***
***REMOVED*** @fileoverview Class implements an output control.
***REMOVED***

goog.provide('xrx.output');



goog.require('goog.dom');
goog.require('xrx.mvc.Mvc');



xrx.output = function(element) {



***REMOVED***
***REMOVED***
goog.inherits(xrx.output, xrx.mvc.ComponentView);



xrx.output.prototype.createDom = function() {***REMOVED***



xrx.output.prototype.eventBeforeChange = function() {***REMOVED***



xrx.output.prototype.eventFocus = function() {***REMOVED***



xrx.output.prototype.getValue = function() {***REMOVED***



xrx.output.prototype.setFocus = function() {***REMOVED***



xrx.output.prototype.setValue = function(value) {

  goog.dom.setTextContent(this.getElement(), value);
***REMOVED***



xrx.output.prototype.refresh = function() {
  var value = this.getNode().getStringValue();

  this.setValue(value);
***REMOVED***
