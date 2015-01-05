/**
 * @fileoverview 
 */

goog.provide('xrx.mvc.Namespace');



goog.require('xrx.mvc.ComponentModel');
goog.require('xrx.xpath');



/**
 * @constructor
 */
xrx.mvc.Namespace = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Namespace, xrx.mvc.ComponentModel);



xrx.mvc.Namespace.prototype.mvcRecalculate = function() {
  var prefix = this.getDataset('xrxPrefix');
  var uri = this.getDataset('xrxUri');
  xrx.xpath.declareNamespace(prefix, uri);
};
