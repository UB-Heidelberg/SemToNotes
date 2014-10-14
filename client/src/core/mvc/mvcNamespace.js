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
  var prefix = goog.dom.dataset.get(this.element_, 'xrxPrefix');
  var uri = goog.dom.dataset.get(this.element_, 'xrxUri');
  xrx.xpath.declareNamespace(prefix, uri);
};
