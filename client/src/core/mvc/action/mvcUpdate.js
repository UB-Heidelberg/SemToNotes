/**
 * @fileoverview A class representing a set-value action.
 */

goog.provide('xrx.mvc.Update');



goog.require('xrx.mvc.ComponentModel');



/**
 * @constructor
 */
xrx.mvc.Update = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Update, xrx.mvc.ComponentModel);



xrx.mvc.Update.prototype.createDom = function() {};



xrx.mvc.Update.prototype.mvcRecalculate = function() {};



xrx.mvc.Update.prototype.execute = function() {
  xrx.mvc.Controller.updateNode(this, this.getNode(0), this.getValue());
};
