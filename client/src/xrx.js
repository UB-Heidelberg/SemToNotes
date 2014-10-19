/**
 * @fileoverview The XRX++ main class.
 */

goog.provide('xrx');



goog.require('xrx.mvc.Mvc');



xrx.install = function() {
  xrx.mvc.Mvc.install();
};
