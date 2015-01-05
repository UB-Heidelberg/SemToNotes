/**
 * @fileoverview A class representing an insert action.
 */

goog.provide('xrx.mvc.Insert');



goog.require('xrx.mvc.ComponentModel');
goog.require('xrx.mvc.Controller');



/**
 * @constructor
 */
xrx.mvc.Insert = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Insert, xrx.mvc.ComponentModel);



xrx.mvc.Insert.prototype.mvcRecalculate = function() {};



xrx.mvc.Insert.prototype.getNode = function(opt_num, opt_dataset) {
  var dataset = opt_dataset || 'xrxTarget';
  return goog.base(this, 'getNode', opt_num, dataset);
};


xrx.mvc.Insert.prototype.execute = function() {
  var origin = this.getNode(0, 'xrxOrigin');
  var target = this.getNode();
  xrx.mvc.Controller.insertNode(this, target, origin);
};
