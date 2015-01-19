/**
 * @fileoverview A class representing an XML remove action.
 */

goog.provide('xrx.mvc.Remove');



goog.require('xrx.mvc.AbstractAction');
goog.require('xrx.mvc.Controller');



/**
 * @constructor
 */
xrx.mvc.Remove = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Remove, xrx.mvc.AbstractAction);



/**
 * @private
 */
xrx.mvc.Remove.prototype.execute_ = function() {
  xrx.mvc.Controller.removeNode(this, this.getNode(0));
};
