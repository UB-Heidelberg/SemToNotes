/**
 * @fileoverview
 */

goog.provide('xrx.html5.Select');



goog.require('goog.dom.DomHelper');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('xrx.mvc.ComponentView');



xrx.html5.Select = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.html5.Select, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-select', xrx.html5.Select);



xrx.html5.Select.prototype.createDom = function() {
  this.registerEvent(goog.events.EventType.CHANGE);
};



xrx.html5.Select.prototype.mvcRefresh = function() {
  var value;
  var node = this.getNode();
  var optgroup = xrx.mvc.getModelComponent(this.getDataset('xrxOptgroup'));
  node ? value = node.getValueAsString() : node = null;
  var i = 0;
  var option;
  goog.dom.removeChildren(this.element_);
  while(option = optgroup.getOption(i)) {
    if (option.value === value) option.setAttribute('selected', 'selected');
    goog.dom.appendChild(this.element_, option);
    i++;
  };
};



xrx.html5.Select.prototype.mvcRemove = function() {
  goog.dom.removeChildren(this.element_);
};



xrx.html5.Select.prototype.mvcModelUpdateData = function() {
  xrx.mvc.Controller.updateNode(this, this.getNode(),
      goog.dom.forms.getValue(this.element_));
};
