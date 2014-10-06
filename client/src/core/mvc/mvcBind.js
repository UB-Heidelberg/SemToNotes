/**
 * @fileoverview Class implements data binding for the
 * model-view-controller.
 */

goog.provide('xrx.mvc.Bind');



goog.require('xrx.mvc.ComponentModel');
goog.require('xrx.xpath');



/**
 * @constructor
 */
xrx.mvc.Bind = function(element) {

  goog.base(this, element);



  this.node_;



  this.recalculate()
};
goog.inherits(xrx.mvc.Bind, xrx.mvc.ComponentModel);



/**
 * (Re)calculates the XPath expression defined in attribute
 * data-xrx-ref.
 * 
 * @override
 */
xrx.mvc.Bind.prototype.recalculate = function() {
  var result = xrx.xpath.evaluate(this.getRefExpression(), xrx.mvc.Mvc.getInstanceDefault(), null, 
      xrx.xpath.XPathResultType.ANY_TYPE);
  this.node_ = [];
  var node;

  while(node = result.iterateNext()) {
    this.node_.push(node);
  };
};

