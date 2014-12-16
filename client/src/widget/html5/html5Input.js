***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.html5.Input');



goog.require('goog.dom.forms');
***REMOVED***
***REMOVED***
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');



xrx.html5.Input = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.html5.Input, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-input', xrx.html5.Input);



xrx.html5.Input.prototype.createDom = function() {
***REMOVED***this.element_, goog.events.EventType.INPUT, function(e) {
    e.preventDefault();
    this.mvcModelUpdateData();
  }, false, this);
***REMOVED***



xrx.html5.Input.prototype.mvcRefresh = function() {
  var node = this.getNode();
  var xml = node ? node.getStringValue() : undefined;
  if (xml) goog.dom.forms.setValue(this.element_, xml);
***REMOVED***



xrx.html5.Input.prototype.mvcRemove = function() {
  goog.dom.forms.setValue(this.element_, '');
***REMOVED***



xrx.html5.Input.prototype.mvcModelUpdateData = function() {
  xrx.mvc.Controller.updateNode(this, this.getNode(),
      goog.dom.forms.getValue(this.element_));
***REMOVED***
