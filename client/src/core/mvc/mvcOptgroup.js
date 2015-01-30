/**
 * @fileoverview
 */

goog.provide('xrx.mvc.Optgroup');



goog.require('goog.dom.DomHelper');
goog.require('xrx.mvc.ComponentModel');
goog.require('xrx.xpath');



xrx.mvc.Optgroup = function(element) {

  goog.base(this, element);

  this.options_;

  this.valueExpr_;

  this.labelExpr_;
};
goog.inherits(xrx.mvc.Optgroup, xrx.mvc.ComponentModel);



xrx.mvc.Optgroup.prototype.createDom = function() {
  var xrxOption = goog.dom.getElementByClass('xrx-option', this.element_);
  this.valueExpr_ = this.getDataset('xrxValue', xrxOption);
  this.labelExpr_ = this.getDataset('xrxLabel', xrxOption);
};



xrx.mvc.Optgroup.prototype.getOption = function(num) {
  var option = this.options_[num];
  return option ? option.cloneNode(true) : undefined;
};



xrx.mvc.Optgroup.prototype.mvcRecalculate = function() {
  var node;
  var value;
  var label;
  var option;
  var i = 0;
  this.options_ = [];
  while(node = this.getResult().getNode(i)) {
    value = xrx.xpath.evaluate(this.valueExpr_, node, null,
        xrx.xpath.XPathResultType.STRING_TYPE).stringValue;
    label = xrx.xpath.evaluate(this.labelExpr_, node, null,
        xrx.xpath.XPathResultType.STRING_TYPE).stringValue;
    option = goog.dom.createDom('option', {value: value})
    goog.dom.setTextContent(option, label);
    this.options_.push(option);
    i++;
  };
};
