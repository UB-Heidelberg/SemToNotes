/**
 * @fileoverview A node implementation based on a binary
 * XML model.
 */

goog.provide('xrx.nodeB');


goog.require('xrx.node');
goog.require('xrx.token');
goog.require('xrx.xpath.NodeSet');



/**
 * Base class to construct a binary node.
 * @constructor
 */
xrx.nodeB = function(type, instance, key) {
  goog.base(this, type, instance);

  /**
   * @type {integer}
   * @private
   */
  this.key_ = key;

  /**
   * @type {enum}
   * @private
   */
  this.impl_ = {
    Document: 'DocumentB',
    Element: 'ElementB',
    Attribute: 'AttributeB',
    Text: 'TextB'
  };
};
goog.inherits(xrx.nodeB, xrx.node);



/**
 * 
 */
xrx.nodeB.prototype.getToken = goog.abstractMethod;



/**
 * 
 */
xrx.nodeB.prototype.getLabel = goog.abstractMethod;



/**
 * 
 */
xrx.nodeB.prototype.getOffset = goog.abstractMethod;



/**
 * 
 */
xrx.nodeB.prototype.getLength = goog.abstractMethod;



/**
 * @return {!integer}
 */
xrx.nodeB.prototype.getKey = function() {
  return this.key_;
};



/**
 * @return {!xrx.index}
 */
xrx.nodeB.prototype.getIndex = function() {
  return this.instance_.getIndex();
};


/**
 * @return {!xrx.index.row}
 */
xrx.nodeB.prototype.getRow = function() {
  return this.getIndex().getRowByKey(this.key_);
};

