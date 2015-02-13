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
  var option;
  var map = xrx.mvc.getModelComponent(this.getDataset('xrxMap')).getMap();
  var value = this.getResult().castAsString();
  goog.dom.removeChildren(this.element_);
  map.forEach(function(label, key) {
    option = goog.dom.createDom('option', {value: key});
    goog.dom.setTextContent(option, label);
    if (value === key) option.setAttribute('selected', 'selected');
    goog.dom.appendChild(this.element_, option);
  }, this);
};



xrx.html5.Select.prototype.mvcRemove = function() {
  goog.dom.removeChildren(this.element_);
};



xrx.html5.Select.prototype.mvcModelUpdateData = function() {
  xrx.mvc.Controller.updateNode(this, this.getResult().getNode(0),
      goog.dom.forms.getValue(this.element_));
};
