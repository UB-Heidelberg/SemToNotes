/**
 * @fileoverview 
 */

goog.provide('xrx.html5.Input');



goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.node');
goog.require('xrx.token');
goog.require('xrx.token.NotTag');



xrx.html5.Input = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.html5.Input, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-input', xrx.html5.Input);



xrx.html5.Input.prototype.createDom = function() {
  this.registerEvent(goog.events.EventType.INPUT);
};



xrx.html5.Input.prototype.mvcRefresh = function() {
  var node = this.getResult().getNode(0);
  if (node) {
    goog.dom.forms.setValue(this.element_, node.getStringValue());
    goog.dom.forms.setDisabled(this.element_, false);
  } else {
    goog.dom.forms.setValue(this.element_, '');
    goog.dom.forms.setDisabled(this.element_, true);
  }
};



xrx.html5.Input.prototype.mvcRemove = function() {
  goog.dom.forms.setValue(this.element_, '');
};



xrx.html5.Input.prototype.mvcModelUpdateData = function() {
  xrx.mvc.Controller.updateNode(this, this.getResult().getNode(0),
      goog.dom.forms.getValue(this.element_));
};
