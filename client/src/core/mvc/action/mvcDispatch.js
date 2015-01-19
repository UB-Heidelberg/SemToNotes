/**
 * @fileoverview
 */

goog.provide('xrx.mvc.Dispatch');



goog.require('goog.dom.dataset');
goog.require('xrx.mvc');
goog.require('xrx.mvc.AbstractAction');



/**
 * @constructor
 */
xrx.mvc.Dispatch = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Dispatch, xrx.mvc.AbstractAction);



xrx.mvc.Dispatch.prototype.execute_ = function() {
  var action = this.getDataset('xrxAction');
  xrx.mvc.getComponent(action).execute();
};
