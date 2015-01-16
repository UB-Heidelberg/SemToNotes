/**
 * @fileoverview A class representing a set-value action.
 */

goog.provide('xrx.mvc.Update');



goog.require('xrx.mvc.AbstractAction');



/**
 * @constructor
 */
xrx.mvc.Update = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Update, xrx.mvc.AbstractAction);



xrx.mvc.Update.prototype.execute_ = function() {
  xrx.mvc.Controller.updateNode(this, this.getNode(0), this.getValue());
};
