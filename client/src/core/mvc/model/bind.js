/**
 * @fileoverview Class implements data binding for the
 * model-view-controller.
 */

goog.provide('xrx.bind');


goog.require('xrx.model');
goog.require('xrx.xpath');



/**
 * @constructor
 */
xrx.bind = function(element) {
  goog.base(this, element);



  this.node_;



  this.recalculate()
};
goog.inherits(xrx.bind, xrx.model);



/**
 * (Re)calculates the XPath expression defined in attribute
 * data-xrx-ref.
 * 
 * @override
 */
xrx.bind.prototype.recalculate = function() {
  var result = xrx.xpath.evaluate(this.getRefExpression(), xrx.model.getInstanceDefault(), null, 
      xrx.xpath.XPathResultType.ANY_TYPE);
  this.node_ = [];
  var node;

  while(node = result.iterateNext()) {
    this.node_.push(node);
  };
};

