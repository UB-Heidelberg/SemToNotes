/**
 * @fileoverview A class representing an XML insert action.
 */

goog.provide('xrx.mvc.Insert');



goog.require('xrx.mvc.AbstractAction');
goog.require('xrx.mvc.Controller');



/**
 * @constructor
 */
xrx.mvc.Insert = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Insert, xrx.mvc.AbstractAction);



/**
 * @private
 */
xrx.mvc.Insert.prototype.execute_ = function() {
  var origin = this.getNode(0, 'xrxOrigin');
  var target = this.getNode();
  xrx.mvc.Controller.insertNode(this, target, origin);
};