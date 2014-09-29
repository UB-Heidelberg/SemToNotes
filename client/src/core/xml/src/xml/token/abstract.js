/**
 * @fileoverview An abstract class representing a token of a XML
 * instance.
 */

goog.provide('xrx.token.Abstract');



goog.require('xrx.label');



/**
 * Base class to construct a new token.
 * This constructor should never be called directly, but
 * by one of the inherited token classes.
 *
 * @constructor
 * @param {!number} type The type of the token.
 * @param {?xrx.label} label The label attached to the token.
 * @param {?number} offset The offset relative to the start of 
 *     the XML stream.
 * @param {?number} length The number of characters occupied 
 *     in the XML stream.
 */
xrx.token.Abstract = function(type, opt_label, opt_offset, opt_length) {



  /**
   * @private
   */
  this.type_ = type;



  /**
   * @private
   */
  this.label_ = opt_label;



  /**
   * @private
   */
  this.offset_ = opt_offset;



  /**
   * @private
   */
  this.length_ = opt_length;
};



/**
 * Compares the generic type of two tokens.
 *
 * @param {!number} type The type to check against.
 * @return {!boolean}
 */
xrx.token.Abstract.prototype.typeOf = function(type) {
  return this.type_ === type;
};



/**
 * Checks if two tokens are the same. 
 * Note that two tokens are considered as 'the same' 
 * if the types and the labels of the two tokens are 
 * identical. Offset and length do not play any role 
 * for 'sameness'. 
 *
 * @param {!xrx.token} token The token to check against.
 * @return {!boolean}
 */
xrx.token.Abstract.prototype.sameAs = function(token) {
  return this.typeOf(token.type()) && this.label_.sameAs(token.label());
};



/**
 * See function xrx.token.sameAs(token), but overloading 
 * the type and the label separately.
 *
 * @param {!type} type The type to check against.
 * @param {!label} label The label to check against.
 * @return {!boolean}
 */
xrx.token.Abstract.prototype.compare = function(type, label) {
  return this.typeOf(type) && this.label_.sameAs(label);
};



/**
 * Indicates whether the token appears before the overloaded
 * token in document-order.
 * 
 * @param {!xrx.token} token The token to compare.
 * @return {!boolean} 
 */
xrx.token.Abstract.prototype.isBefore = function(token) {
  return this.label_.isBefore(token.label()) || 
      (this.label_.sameAs(token.label()) && this.type_ < token.type());
};



/**
 * Indicates whether the token appears after the overloaded
 * token in document-order.
 * 
 * @param {!xrx.token} token The token to compare.
 * @return {!boolean} 
 */
xrx.token.Abstract.prototype.isAfter = function(token) {
  return this.label_.isAfter(token.label()) || 
      (this.label_.sameAs(token.label()) && this.type_ > token.type());
};



/**
 * A cumulative setter function for all private members.
 *
 * @param {!number} type The type of the token.
 * @param {!xrx.label} label The label attached to the token.
 * @param {?number} offset The offset relative to the start of the XML stream.
 * @param {?number} length The number of characters in the XML stream.
 */
xrx.token.Abstract.prototype.set = function(type, label, offset, length) {

  this.type_ = type;
  this.label_ = label;
  this.offset_ = offset;
  this.length_ = length;
};



/**
 * A combined setter and getter function. Optionally sets the
 * type. Returns the type or the new type.
 * 
 * @param {?number} opt_type The value to be set (optional).
 * @return {!number}
 */
xrx.token.Abstract.prototype.type = function(opt_type) {
  opt_type !== undefined ? this.type_ = opt_type : null;
  return this.type_;
};



/**
 * A combined setter and getter function. Optionally sets the
 * label. Returns the label or the new label.
 * 
 * @param {?number} opt_label The value to be set (optional).
 * @return {!number}
 */
xrx.token.Abstract.prototype.label = function(opt_label) {
  opt_label !== undefined ? this.label_ = opt_label : null;
  return this.label_;
};



/**
 * A combined setter and getter function. Optionally sets the
 * offset. Returns the offset or the new offset.
 * 
 * @param {?number} opt_offset The value to be set (optional).
 * @return {!number}
 */
xrx.token.Abstract.prototype.offset = function(opt_offset) {
  opt_offset !== undefined ? this.offset_ = opt_offset : null;
  return this.offset_;
};



/**
 * A combined setter and getter function. Optionally sets the
 * length. Returns the length or the new length.
 * 
 * @param {?number} opt_length The value to be set (optional).
 * @return {!number}
 */
xrx.token.Abstract.prototype.length = function(opt_length) {
  opt_length !== undefined ? this.length_ = opt_length : null;
  return this.length_;
};



/**
 * Returns the XML string of a token in a XML stream.
 * 
 * @param {!string} stream A XML stream.
 * @return {!string} The token string.
 */
xrx.token.Abstract.prototype.xml = function(stream) {
  return stream.substr(this.offset_, this.length_);
};

