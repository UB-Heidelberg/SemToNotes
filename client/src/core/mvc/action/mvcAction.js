/**
 * @fileoverview A class representing an action.
 */

goog.provide('xrx.mvc.Action');



goog.require('goog.array');
goog.require('goog.dom.DomHelper');
goog.require('xrx.mvc.ComponentModel');



/**
 * @constructor
 */
xrx.mvc.Action = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Action, xrx.mvc.ComponentModel);



xrx.mvc.Action.prototype.mvcRecalculate = function() {};



xrx.mvc.Action.prototype.execute = function() {
  var children = goog.dom.getChildren(this.element_);
  goog.array.forEach(children, function(e, i, a) {
    xrx.mvc.getModelComponent(e.id).execute();
  });
};
