/**
 * @fileoverview 
 */

goog.provide('xrx.mvc.ComponentClasses');



goog.require('xrx.mvc.ChildComponent');



xrx.mvc.ComponentClasses = function(component) {

  goog.base(this, component);
};
goog.inherits(xrx.mvc.ComponentClasses, xrx.mvc.ChildComponent);



xrx.mvc.ComponentClasses.prototype.getRefExpression = function() {
};



xrx.mvc.ComponentClasses.prototype.getBindId = function() {
};
