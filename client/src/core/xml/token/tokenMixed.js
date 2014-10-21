***REMOVED***
***REMOVED*** @fileoverview A class representing the mixed token.
***REMOVED***

goog.provide('xrx.token.Mixed');



goog.require('xrx.token');
goog.require('xrx.token.Token');



***REMOVED***
***REMOVED*** Constructs a new mixed token.
***REMOVED***
***REMOVED***
***REMOVED*** @extends xrx.token.Token
***REMOVED***
xrx.token.Mixed = function(firstToken, opt_secondToken, opt_firstOffset,
      opt_secondOffset) {

  goog.base(this, xrx.token.MIXED);

  this.firstToken_ = firstToken;

  this.secondToken_ = opt_secondToken;

  this.firstOffset_ = opt_firstOffset || 0;

  this.secondOffset_ = opt_secondOffset || 0;
***REMOVED***
goog.inherits(xrx.token.Mixed, xrx.token.Token);



***REMOVED***
***REMOVED*** Returns the first token of the mixed token.
***REMOVED*** @return {xrx.token.Token} The token.
***REMOVED***
xrx.token.Mixed.prototype.firstToken = function() {
  return this.firstToken_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the second token of the mixed token.
***REMOVED*** @return {xrx.token.Token} The token.
***REMOVED***
xrx.token.Mixed.prototype.secondToken = function() {
  return this.secondToken_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the offset of the first token of the fragment.
***REMOVED*** @return {number} The offset.
***REMOVED***
xrx.token.Mixed.prototype.firstOffset = function() {
  return this.firstOffset_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the offset of the second token of the fragment.
***REMOVED*** @return {number} The offset.
***REMOVED***
xrx.token.Mixed.prototype.secondOffset = function() {
  return this.secondOffset_;
***REMOVED***



***REMOVED***
***REMOVED*** Whether two tokens are the same.
***REMOVED***
***REMOVED*** @param {!xrx.token} token The token to check against.
***REMOVED*** @return {!boolean}
***REMOVED***
xrx.token.Mixed.prototype.sameAs = function(token) {
  return token.type() === xrx.token.MIXED &&
      this.firstToken_.sameAs(token.firstToken()) &&
      this.secondToken_.sameAs(token.secondToken()) &&
      this.firstOffset_ === token.firstOffset() &&
      this.secondOffset_ === token.secondOffset();
***REMOVED***



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.token.Mixed.prototype.compare = undefined;



***REMOVED***
***REMOVED*** Indicates whether the token appears before the overloaded
***REMOVED*** token in document-order.
***REMOVED*** 
***REMOVED*** @param {!xrx.token} token The token to compare.
***REMOVED*** @return {!boolean} 
***REMOVED***
xrx.token.Mixed.prototype.isBefore = function(token) {
  return this.firstToken_.label().isBefore(token.label()) || 
      (this.firstToken_.label().sameAs(token.label()) &&
          this.firstToken_.type() < token.type());
***REMOVED***



***REMOVED***
***REMOVED*** Indicates whether the token appears after the overloaded
***REMOVED*** token in document-order.
***REMOVED*** 
***REMOVED*** @param {!xrx.token} token The token to compare.
***REMOVED*** @return {!boolean} 
***REMOVED***
xrx.token.Mixed.prototype.isAfter = function(token) {
  return this.firstToken_.label().isAfter(token.label()) || 
      (this.firstToken_.label().sameAs(token.label()) &&
          this.firstToken_.type() > token.type());
***REMOVED***



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.token.Mixed.prototype.set = undefined;



***REMOVED***
***REMOVED*** A combined setter and getter function. Optionally sets the
***REMOVED*** type. Returns the type or the new type.
***REMOVED*** 
***REMOVED*** @param {?number} opt_type The value to be set (optional).
***REMOVED*** @return {!number}
***REMOVED*** @override
***REMOVED***
xrx.token.Mixed.prototype.type = function(opt_type) {
  if (opt_type) this.type_ = opt_type;
  return this.type_;
***REMOVED***



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.token.Mixed.prototype.label = undefined;



***REMOVED***
***REMOVED*** Returns the offset of the mixed token.
***REMOVED*** 
***REMOVED*** @return {!number} The offset.
***REMOVED*** @override
***REMOVED***
xrx.token.Mixed.prototype.offset = function() {
  return this.firstToken_.offset() + this.firstOffset_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the length of the mixed token.
***REMOVED*** 
***REMOVED*** @return {!number} The length.
***REMOVED*** @override
***REMOVED***
xrx.token.Mixed.prototype.length = function() {
  return !this.secondToken_ ? this.firstToken_.length() - this.firstOffset_: 
    this.secondToken_.offset() + this.secondToken_.length() - this.secondOffset_ -
    this.firstToken_.offset() + this.firstOffset_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the XML string of a token in an XML stream.
***REMOVED*** 
***REMOVED*** @param {!string} stream An XML stream.
***REMOVED*** @return {!string} The token string.
***REMOVED***
xrx.token.Mixed.prototype.xml = function(stream) {
  return stream.substr(this.offset(), this.length());
***REMOVED***
