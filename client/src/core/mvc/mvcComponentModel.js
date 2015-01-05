/**
 * @fileoverview
 */

goog.provide('xrx.mvc.ComponentModel');



goog.require('xrx.mvc.Component');



/**
 * @constructor
 */
xrx.mvc.ComponentModel = function(element, uidl) {

  goog.base(this, element, uidl);

  xrx.mvc.addModelComponent(this.getId(), this);

  this.mvcRecalculate();
};
goog.inherits(xrx.mvc.ComponentModel, xrx.mvc.Component);
