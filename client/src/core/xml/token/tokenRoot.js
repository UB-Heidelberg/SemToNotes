/**
 * @fileoverview Class represents the root token.
 */

goog.provide('xrx.token.Root');



goog.require('xrx.token.Token');



/**
 * Constructs a new root token.
 * @constructor
 * @extends xrx.token
 */
xrx.token.Root = function() {
  goog.base(this, xrx.token.ROOT, new xrx.xml.Label(), 0, 0);
};
goog.inherits(xrx.token.Root, xrx.token.Token);
