***REMOVED***
***REMOVED*** @fileoverview An abstract class representing a token of a XML
***REMOVED*** instance.
***REMOVED***

goog.provide('xrx.token.Token');



goog.require('xrx.xml.Label');



***REMOVED***
***REMOVED*** Base class to construct a new token.
***REMOVED***
***REMOVED*** @param {!number} type The type of the token.
***REMOVED*** @param {?xrx.xml.Label} label The label attached to the token.
***REMOVED*** @param {?number} offset The offset relative to the start of 
***REMOVED***     the XML stream.
***REMOVED*** @param {?number} length The number of characters occupied 
***REMOVED***     in the XML stream.
***REMOVED***
***REMOVED***
xrx.token.Token = function(type, opt_label, opt_offset, opt_length) {



 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.type_ = type;



 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.label_ = opt_label;



 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.offset_ = opt_offset;



 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.length_ = opt_length;
***REMOVED***



***REMOVED***
***REMOVED*** Compares the generic type of two tokens.
***REMOVED***
***REMOVED*** @param {!number} type The type to check against.
***REMOVED*** @return {!boolean}
***REMOVED***
xrx.token.Token.prototype.typeOf = function(type) {
  return this.type_ === type;
***REMOVED***



***REMOVED***
***REMOVED*** Checks if two tokens are the same. 
***REMOVED*** Two tokens are 'the same' if the types and the labels are 
***REMOVED*** identical. Offset and length do not play any role. 
***REMOVED***
***REMOVED*** @param {!xrx.token} token The token to check against.
***REMOVED*** @return {!boolean}
***REMOVED***
xrx.token.Token.prototype.sameAs = function(token) {
  return this.typeOf(token.type()) && this.label_.sameAs(token.label());
***REMOVED***



***REMOVED***
***REMOVED*** See function xrx.token.sameAs(token), but overloading 
***REMOVED*** the type and the label separately.
***REMOVED***
***REMOVED*** @param {!type} type The type to check against.
***REMOVED*** @param {!label} label The label to check against.
***REMOVED*** @return {!boolean}
***REMOVED***
xrx.token.Token.prototype.compare = function(type, label) {
  return this.typeOf(type) && this.label_.sameAs(label);
***REMOVED***



***REMOVED***
***REMOVED*** Indicates whether the token appears before the overloaded
***REMOVED*** token in document-order.
***REMOVED*** 
***REMOVED*** @param {!xrx.token} token The token to compare.
***REMOVED*** @return {!boolean} 
***REMOVED***
xrx.token.Token.prototype.isBefore = function(token) {
  return this.label_.isBefore(token.label()) || 
      (this.label_.sameAs(token.label()) && this.type_ < token.type());
***REMOVED***



***REMOVED***
***REMOVED*** Indicates whether the token appears after the overloaded
***REMOVED*** token in document-order.
***REMOVED*** 
***REMOVED*** @param {!xrx.token} token The token to compare.
***REMOVED*** @return {!boolean} 
***REMOVED***
xrx.token.Token.prototype.isAfter = function(token) {
  return this.label_.isAfter(token.label()) || 
      (this.label_.sameAs(token.label()) && this.type_ > token.type());
***REMOVED***



***REMOVED***
***REMOVED*** A cumulative setter function for all private members.
***REMOVED***
***REMOVED*** @param {!number} type The type of the token.
***REMOVED*** @param {!xrx.xml.Label} label The label attached to the token.
***REMOVED*** @param {?number} offset The offset relative to the start of the XML stream.
***REMOVED*** @param {?number} length The number of characters in the XML stream.
***REMOVED***
xrx.token.Token.prototype.set = function(type, label, offset, length) {
  this.type_ = type;
  this.label_ = label;
  this.offset_ = offset;
  this.length_ = length;
***REMOVED***



***REMOVED***
***REMOVED*** A combined setter and getter function. Optionally sets the
***REMOVED*** type. Returns the type or the new type.
***REMOVED*** 
***REMOVED*** @param {?number} opt_type The value to be set (optional).
***REMOVED*** @return {!number}
***REMOVED***
xrx.token.Token.prototype.type = function(opt_type) {
  opt_type !== undefined ? this.type_ = opt_type : null;
  return this.type_;
***REMOVED***



***REMOVED***
***REMOVED*** A combined setter and getter function. Optionally sets the
***REMOVED*** label. Returns the label or the new label.
***REMOVED*** 
***REMOVED*** @param {?number} opt_label The value to be set (optional).
***REMOVED*** @return {!number}
***REMOVED***
xrx.token.Token.prototype.label = function(opt_label) {
  opt_label !== undefined ? this.label_ = opt_label : null;
  return this.label_;
***REMOVED***



***REMOVED***
***REMOVED*** A combined setter and getter function. Optionally sets the
***REMOVED*** offset. Returns the offset or the new offset.
***REMOVED*** 
***REMOVED*** @param {?number} opt_offset The value to be set (optional).
***REMOVED*** @return {!number}
***REMOVED***
xrx.token.Token.prototype.offset = function(opt_offset) {
  opt_offset !== undefined ? this.offset_ = opt_offset : null;
  return this.offset_;
***REMOVED***



***REMOVED***
***REMOVED*** A combined setter and getter function. Optionally sets the
***REMOVED*** length. Returns the length or the new length.
***REMOVED*** 
***REMOVED*** @param {?number} opt_length The value to be set (optional).
***REMOVED*** @return {!number}
***REMOVED***
xrx.token.Token.prototype.length = function(opt_length) {
  opt_length !== undefined ? this.length_ = opt_length : null;
  return this.length_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the XML string of a token in a XML stream.
***REMOVED*** 
***REMOVED*** @param {!string} stream A XML stream.
***REMOVED*** @return {!string} The token string.
***REMOVED***
xrx.token.Token.prototype.xml = function(stream) {
  return stream.substr(this.offset_, this.length_);
***REMOVED***
