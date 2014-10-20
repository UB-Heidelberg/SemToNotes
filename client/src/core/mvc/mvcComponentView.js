/**
 * @fileoverview Abstract class which represents a
 * control of the model-view-controller.
 */

goog.provide('xrx.mvc.ComponentView');



goog.require('xrx.mvc.Component');
goog.require('xrx.mvc');



/**
 * @constructor
 */
xrx.mvc.ComponentView = function(element) {

  goog.base(this, element);

  xrx.mvc.addViewComponent(this.getId(), this);

  this.createDom();

  this.mvcRefresh();
};
goog.inherits(xrx.mvc.ComponentView, xrx.mvc.Component);
