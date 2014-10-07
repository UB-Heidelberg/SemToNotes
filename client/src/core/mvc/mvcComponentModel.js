/**
 * @fileoverview
 */

goog.provide('xrx.mvc.ComponentModel');



goog.require('xrx.mvc.Component');
goog.require('xrx.mvc.Mvc');



/**
 * @constructor
 */
xrx.mvc.ComponentModel = function(element) {

  goog.base(this, element);

  xrx.mvc.Mvc.addModelComponent(this.getId(), this);
};
goog.inherits(xrx.mvc.ComponentModel, xrx.mvc.Component);
