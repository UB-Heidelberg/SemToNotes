/**
 * @fileoverview Abstract class which represents a
 * control of the model-view-controller.
 */

goog.provide('xrx.mvc.ComponentView');



goog.require('xrx.mvc.Component');



/**
 * @constructor
 */
xrx.mvc.ComponentView = function(element, uidl) {

  goog.base(this, element, uidl);

  xrx.mvc.addViewComponent(this.getId(), this);

  this.createDom();

  this.mvcRefresh();
};
goog.inherits(xrx.mvc.ComponentView, xrx.mvc.Component);
