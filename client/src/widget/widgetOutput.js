/**
 * @fileoverview Class implements an output control.
 */

goog.provide('xrx.output');



goog.require('goog.dom');
goog.require('xrx.mvc.Mvc');



xrx.output = function(element) {



  goog.base(this, element);
};
goog.inherits(xrx.output, xrx.mvc.ComponentView);



xrx.output.prototype.createDom = function() {};



xrx.output.prototype.eventBeforeChange = function() {};



xrx.output.prototype.eventFocus = function() {};



xrx.output.prototype.getValue = function() {};



xrx.output.prototype.setFocus = function() {};



xrx.output.prototype.setValue = function(value) {

  goog.dom.setTextContent(this.getElement(), value);
};



xrx.output.prototype.refresh = function() {
  var value = this.getNode().getStringValue();

  this.setValue(value);
};
