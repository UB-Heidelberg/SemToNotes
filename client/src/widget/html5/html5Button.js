/**
 * @fileoverview 
 */

goog.provide('xrx.html5.Button');



goog.require('xrx.html5.Component');



xrx.html5.Button = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.html5.Button, xrx.html5.Component);
xrx.mvc.registerComponent('xrx-button', xrx.html5.Button);



xrx.html5.Button.prototype.createDom = function() {};



xrx.html5.Button.prototype.mvcRefresh = function() {};



xrx.html5.Button.prototype.mvcRemove = function() {};
