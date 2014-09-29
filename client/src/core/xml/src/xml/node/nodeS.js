/**
 * @fileoverview A node implementation for streaming XPath evaluation.
 */

goog.provide('xrx.nodeS');



goog.require('xrx.node');



/**
 * @constructor
 */
xrx.nodeS = function(type, instance, token) {
  goog.base(this, type, instance);

  /**
   * @type {xrx.token}
   * @private
   */
  this.token_ = token;

  /**
   * @type {enum}
   * @private
   */
  this.impl_ = {
    Document: 'DocumentS',
    Element: 'ElementS',
    Attribute: 'AttributeS',
    Text: 'TextS'
  };
};
goog.inherits(xrx.nodeS, xrx.node);



/**
 * 
 */
xrx.nodeS.prototype.getToken = goog.abstractMethod;



/**
 * 
 */
xrx.nodeS.prototype.getLabel = goog.abstractMethod;



/**
 * 
 */
xrx.nodeS.prototype.getOffset = goog.abstractMethod;



/**
 * 
 */
xrx.nodeS.prototype.getLength = goog.abstractMethod;

