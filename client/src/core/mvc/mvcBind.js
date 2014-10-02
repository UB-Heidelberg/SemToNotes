/**
 * @fileoverview Class implements data binding for the
 * model-view-controller.
 */

goog.provide('xrx.mvc.Bind');



goog.require('xrx.model');
goog.require('xrx.xpath');



/**
 * @constructor
 */
xrx.mvc.Bind = function(element) {

  goog.base(this, element);



  this.node_;



  this.recalculate()
};
goog.inherits(xrx.mvc.Bind, xrx.model);



/**
 * (Re)calculates the XPath expression defined in attribute
 * data-xrx-ref.
 * 
 * @override
 */
xrx.mvc.Bind.prototype.recalculate = function() {
  var result = xrx.xpath.evaluate(this.getRefExpression(), xrx.model.getInstanceDefault(), null, 
      xrx.xpath.XPathResultType.ANY_TYPE);
  this.node_ = [];
  var node;

  while(node = result.iterateNext()) {
    this.node_.push(node);
  };
};

