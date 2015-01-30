/**
 * @fileoverview Class implements an output control.
 */

goog.provide('xrx.widget.Output');



goog.require('goog.dom.DomHelper');
goog.require('xrx.mvc');



/**
 * @constructor
 */
xrx.widget.Output = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.Output, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-output', xrx.widget.Output);



xrx.widget.Output.prototype.createDom = function() {};



xrx.widget.Output.prototype.mvcRemove = function() {
  goog.dom.setTextContent(this.element_, '');
};



xrx.widget.Output.prototype.mvcRefresh = function() {
  var value = this.getResult().castAsString();
  goog.dom.setTextContent(this.getElement(), value);
};
