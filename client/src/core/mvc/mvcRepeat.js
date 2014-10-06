***REMOVED***
***REMOVED*** @fileoverview Class implements a repeat control.
***REMOVED***

goog.provide('xrx.mvc.Repeat');



goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('xrx.mvc.ComponentView');



xrx.mvc.Repeat = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Repeat, xrx.mvc.ComponentView);



xrx.mvc.Repeat.prototype.createDom = function() {
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



xrx.mvc.Repeat.prototype.eventBeforeChange = function() {***REMOVED***



xrx.mvc.Repeat.prototype.eventFocus = function() {***REMOVED***



xrx.mvc.Repeat.prototype.getValue = function() {***REMOVED***



xrx.mvc.Repeat.prototype.setFocus = function() {***REMOVED***



xrx.mvc.Repeat.prototype.refresh = function() {***REMOVED***

