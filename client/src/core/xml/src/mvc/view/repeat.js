***REMOVED***
***REMOVED*** @fileoverview Class implements a repeat control.
***REMOVED***

goog.provide('xrx.repeat');



goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('xrx.view');



xrx.repeat = function(element) {
***REMOVED***
***REMOVED***
goog.inherits(xrx.repeat, xrx.view);



xrx.component.prototype.createDom = function() {
  var child = goog.dom.getFirstElementChild(this.element_);
  var n = 0;
  var node;

  while(node = this.getNode(n)) {
    if (n === 0) {

      goog.dom.setProperties(child, {'data-xrx-repeat-index': n});
      goog.dom.classes.add(child, 'xrx-repeat-item');
    } else {
      var newElement = child.cloneNode(true);

      goog.dom.setProperties(newElement, {'data-xrx-repeat-index': n});
      goog.dom.classes.add(newElement, 'xrx-repeat-item');
      goog.dom.appendChild(this.element_, newElement);
    }
    n++;
  }
***REMOVED***



xrx.repeat.prototype.eventBeforeChange = function() {***REMOVED***



xrx.repeat.prototype.eventFocus = function() {***REMOVED***



xrx.repeat.prototype.getValue = function() {***REMOVED***



xrx.repeat.prototype.setFocus = function() {***REMOVED***



xrx.repeat.prototype.refresh = function() {***REMOVED***

