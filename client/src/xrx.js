/**
 * @fileoverview The XRX++ main class.
 */

goog.provide('xrx');



goog.require('xrx.mvc');



xrx = function() {};



xrx.install = function() {
  xrx.mvc.install();
};
