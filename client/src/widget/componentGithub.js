/**
 * @fileoverview 
 */

goog.provide('xrx.c.Github');



goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentModel');



/**
 * @constructor
 */
xrx.c.Github = function(element) {

  goog.base(this, element);

  this.client_;

  this.init_();
};
goog.inherits(xrx.c.Github, xrx.mvc.ComponentModel);




xrx.c.Github.USER = '';



xrx.c.Github.PASSWORD = '';



xrx.c.Github.prototype.mvcRecalculate = function() {};



xrx.c.Github.prototype.init_ = function() {
};
