/**
 * @fileoverview 
 */

goog.provide('xrx.component.Text');



goog.require('xrx.mvc.Component');



/**
 * @constructor
 */
xrx.component.Text = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.component.Text, xrx.mvc.Component);
xrx.mvc.registerComponent('xrx-text', xrx.component.Text);



xrx.component.Text.prototype.highlight_ = function(target) {
  this.highlighted_ = target;
};



xrx.component.Text.prototype.unhighlight_ = function() {
  this.highlighted_ = null;
};



xrx.component.Text.prototype.createDom = function() {
  this.registerEvent(xrx.event.Type.IN);
  this.registerEvent(xrx.event.Type.OUT);
};
