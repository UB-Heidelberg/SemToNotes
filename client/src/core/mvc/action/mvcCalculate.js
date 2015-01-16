/**
 * @fileoverview
 */

goog.provide('xrx.mvc.Calculate');



goog.require('xrx.mvc.AbstractAction');



xrx.mvc.Calculate = function(element) {

  goog.base(this, element);

  this.result_;
};
goog.inherits(xrx.mvc.Calculate, xrx.mvc.AbstractAction);



xrx.mvc.Calculate.prototype.getResultAsBoolean = function() {
  if (this.result_.stringValue) {
    return !!this.result_.stringValue;
  } else if (this.result_.numberValue) {
    return !!this.result_.numberValue;
  } else if (this.result_.booleanValue) {
    return this.result_.booleanValue;
  } else {
    return this.snapshotLength > 0;
  }
  return false;
};



xrx.mvc.Calculate.prototype.execute_ = function() {
  this.result_ = xrx.xpath.evaluate(this.getRefExpression(), undefined, null, 
      xrx.xpath.XPathResultType.ANY_TYPE);
};
