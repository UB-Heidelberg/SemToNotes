/**
 * @fileoverview
 */

goog.provide('xrx.html5.Checkbox');



goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('xrx.mvc.ComponentView');



xrx.html5.Checkbox = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.html5.Checkbox, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-checkbox', xrx.html5.Checkbox);



xrx.html5.Checkbox.prototype.createDom = function() {
  var self = this;
  this.registerEvent(goog.events.EventType.CHANGE);
  goog.events.listen(self.element_, goog.events.EventType.CHANGE, function(e) {
    !!e.target.checked ? self.dispatch('xrx-event-checked') :
        self.dispatch('xrx-event-unchecked');
  });
};



xrx.html5.Checkbox.prototype.mvcRefresh = function() {
  var node = this.getResult().getNode(0);
  if (!node) return;
  var checked = node.getValueAsString().toLowerCase() === 'true';
  checked ? this.element_.setAttribute('checked', 'checked') :
      this.element_.removeAttribute('checked');
};



xrx.html5.Checkbox.prototype.mvcRemove = function() {};



xrx.html5.Checkbox.prototype.mvcModelUpdateData = function() {
  var node = this.getResult().getNode(0);
  if (!node) return;
  var checked = !!this.element_.checked;
  xrx.mvc.Controller.updateNode(this, node, checked.toString());
};
