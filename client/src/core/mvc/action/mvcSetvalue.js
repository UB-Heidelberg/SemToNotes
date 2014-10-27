/**
 * @fileoverview A class representing a set-value action.
 */

goog.provide('xrx.mvc.Setvalue');



goog.require('xrx.mvc.ComponentModel');



/**
 * @constructor
 */
xrx.mvc.Setvalue = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Setvalue, xrx.mvc.ComponentModel);



xrx.mvc.Setvalue.prototype.mvcRecalculate = function() {};



xrx.mvc.Setvalue.prototype.execute = function() {
  xrx.mvc.Controller.updateNode(this, target, origin);
};
