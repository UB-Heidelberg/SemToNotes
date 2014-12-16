/**
 * @fileoverview 
 */

goog.provide('xrx.html5.Input');



goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');



xrx.html5.Input = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.html5.Input, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-input', xrx.html5.Input);



xrx.html5.Input.prototype.createDom = function() {
  goog.events.listen(this.element_, goog.events.EventType.INPUT, function(e) {
    e.preventDefault();
    this.mvcModelUpdateData();
  }, false, this);
};



xrx.html5.Input.prototype.mvcRefresh = function() {
  var node = this.getNode();
  var xml = node ? node.getXml() : undefined;
  if (xml) goog.dom.forms.setValue(this.element_, xml);
};



xrx.html5.Input.prototype.mvcRemove = function() {
  goog.dom.forms.setValue(this.element_, '');
};



xrx.html5.Input.prototype.mvcModelUpdateData = function() {
  xrx.mvc.Controller.updateNode(this, this.getNode(),
      goog.dom.forms.getValue(this.element_));
};
