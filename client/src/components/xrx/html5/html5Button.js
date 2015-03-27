/**
 * @fileoverview 
 */

goog.provide('xrx.html5.Button');



goog.require('goog.events.EventType');
goog.require('xrx.mvc.Component');



xrx.html5.Button = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.html5.Button, xrx.mvc.Component);
xrx.mvc.registerComponent('xrx-button', xrx.html5.Button);



xrx.html5.Button.prototype.createDom = function() {
  this.registerEvent(goog.events.EventType.CLICK);
};
