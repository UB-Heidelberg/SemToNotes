/**
 * @fileoverview Class implements data binding for the
 *     model-view-controller.
 */

goog.provide('xrx.mvc.Bind');



goog.require('xrx.mvc.ComponentModel');
goog.require('xrx.xpath');



/**
 * @constructor
 */
xrx.mvc.Bind = function(element) {

  this.node_ = [];

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Bind, xrx.mvc.ComponentModel);



xrx.mvc.Bind.prototype.getNodes = function() {
  return this.node_;
};



/**
 *
 */
xrx.mvc.Bind.prototype.getNode = function(num) {
  return this.node_[num];
};



/**
 * @override
 */
xrx.mvc.Bind.prototype.mvcRemove = function() {
  this.node_ = [];
};



/**
 * (Re)calculates the component's node-set.
 * @override
 */
xrx.mvc.Bind.prototype.mvcRecalculate = function() {
  var result = xrx.xpath.evaluate(this.getRefExpression(), undefined, null, 
      xrx.xpath.XPathResultType.ANY_TYPE);
  this.node_ = [];
  var node;
  while(node = result.iterateNext()) {
    this.node_.push(node);
  };
};
