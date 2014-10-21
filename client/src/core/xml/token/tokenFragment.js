***REMOVED***
***REMOVED*** @fileoverview A class representing the fragment token.
***REMOVED***

goog.provide('xrx.token.Fragment');



goog.require('xrx.token');
goog.require('xrx.token.Token');



***REMOVED***
***REMOVED*** Constructs a new fragment token.
***REMOVED***
***REMOVED***
***REMOVED*** @extends xrx.token.Token
***REMOVED***
xrx.token.Fragment = function(firstTag, opt_secondTag) {

  goog.base(this, xrx.token.FRAGMENT);

  this.firstTag_ = firstTag;

  this.secondTag_ = opt_secondTag;
***REMOVED***
goog.inherits(xrx.token.Fragment, xrx.token.Token);



***REMOVED***
***REMOVED*** Returns the first tag of the fragment token.
***REMOVED*** @return {(xrx.token.StartTag|xrx.token.EmptyTag)} The tag.
***REMOVED***
xrx.token.Fragment.prototype.firstTag = function() {
  return this.firstTag_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the second tag of the fragment token.
***REMOVED*** @return {?xrx.token.EndTag} The end-tag token.
***REMOVED***
xrx.token.Fragment.prototype.secondTag = function() {
  return this.secondTag_;
***REMOVED***



***REMOVED***
***REMOVED*** Whether two tokens are the same.
***REMOVED***
***REMOVED*** @param {!xrx.token} token The token to check against.
***REMOVED*** @return {!boolean}
***REMOVED*** @override
***REMOVED***
xrx.token.Fragment.prototype.sameAs = function(token) {
  return token.type() === xrx.token.FRAGMENT &&
      this.firstTag_.sameAs(token.firstTag()) &&
      this.secondTag_.sameAs(token.secondTag());
***REMOVED***



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.token.Fragment.prototype.compare = undefined;



***REMOVED***
***REMOVED*** Indicates whether the token appears before the overloaded
***REMOVED*** token in document-order.
***REMOVED*** 
***REMOVED*** @param {!xrx.token} token The token to compare.
***REMOVED*** @return {!boolean}
***REMOVED*** @override
***REMOVED***
xrx.token.Fragment.prototype.isBefore = function(token) {
  return this.firstTag_.label().isBefore(token.label()) || 
      (this.firstTag_.label().sameAs(token.label()) &&
           this.firstTag_.type() < token.type());
***REMOVED***



***REMOVED***
***REMOVED*** Indicates whether the token appears after the overloaded
***REMOVED*** token in document-order.
***REMOVED*** 
***REMOVED*** @param {!xrx.token} token The token to compare.
***REMOVED*** @return {!boolean}
***REMOVED*** @override
***REMOVED***
xrx.token.Fragment.prototype.isAfter = function(token) {
  return this.firstTag_.label().isAfter(token.label()) || 
      (this.firstTag_.label().sameAs(token.label()) &&
          this.firstTag_.type() > token.type());
***REMOVED***



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.token.Fragment.prototype.set = undefined;



***REMOVED***
***REMOVED*** A combined setter and getter function. Optionally sets the
***REMOVED*** type. Returns the type or the new type.
***REMOVED*** 
***REMOVED*** @param {?number} opt_type The value to be set (optional).
***REMOVED*** @return {!number}
***REMOVED*** @override
***REMOVED***
xrx.token.Fragment.prototype.type = function(opt_type) {
  if (opt_type) this.type_ = opt_type;
  return this.type_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the label of the fragment token.
***REMOVED*** 
***REMOVED*** @return {!number}
***REMOVED*** @override
***REMOVED***
xrx.token.Fragment.prototype.label = function() {
  return this.firstTag_.label();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the offset of the fragment token.
***REMOVED*** 
***REMOVED*** @return {!number}
***REMOVED*** @override
***REMOVED***
xrx.token.Fragment.prototype.offset = function() {
  return this.firstTag_.offset();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the length of the fragment token.
***REMOVED*** 
***REMOVED*** @return {!number}
***REMOVED*** @override
***REMOVED***
xrx.token.Fragment.prototype.length = function() {
  return !this.secondTag_ ? this.firstTag_.length() : 
    this.secondTag_.offset() + this.secondTag_.length() - this.firstTag_.offset();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the XML string of a token in an XML stream.
***REMOVED*** 
***REMOVED*** @param {!string} stream An XML stream.
***REMOVED*** @return {!string} The token string.
***REMOVED***
xrx.token.Fragment.prototype.xml = function(stream) {
  return stream.substr(this.offset(), this.length());
***REMOVED***
