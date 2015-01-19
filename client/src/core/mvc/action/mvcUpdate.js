/**
 * @fileoverview A class representing an XML set-value action.
 */

goog.provide('xrx.mvc.Update');



goog.require('xrx.mvc.AbstractAction');
goog.require('xrx.mvc.Controller');



/**
 * @constructor
 */
xrx.mvc.Update = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Update, xrx.mvc.AbstractAction);



/**
 * @private
 */
xrx.mvc.Update.prototype.execute_ = function() {
  xrx.mvc.Controller.updateNode(this, this.getNode(0), this.getValue());
};
