***REMOVED***
***REMOVED*** @fileoverview A class representing a string reader.
***REMOVED***

goog.provide('xrx.xml.Reader');



***REMOVED***
***REMOVED*** A class representing a string reader.
***REMOVED*** @param {string} input The input string.
***REMOVED***
***REMOVED***
xrx.xml.Reader = function(input) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The XML string.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.input_ = input || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cursor position.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pos_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Length of the XML string.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.length_ = input.length;
***REMOVED***



***REMOVED***
***REMOVED*** Sets or returns the input string.
***REMOVED*** @param {string} opt_input The new input string.
***REMOVED*** @return {string} The input string of the reader.
***REMOVED***
xrx.xml.Reader.prototype.input = function(opt_input) {
  if (opt_input) this.input_ = opt_input;
  return this.input_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the current cursor position.
***REMOVED*** @return {number} The cursor position.
***REMOVED***
xrx.xml.Reader.prototype.pos = function() {
  return this.pos_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the length of the reader's input string.
***REMOVED*** @return {number} The length.
***REMOVED***
xrx.xml.Reader.prototype.length = function() {
  return this.length_;
***REMOVED***



***REMOVED***
***REMOVED*** Put the cursor at first position.
***REMOVED***
xrx.xml.Reader.prototype.first = function() {
  this.pos_ = 0;
***REMOVED***



***REMOVED***
***REMOVED*** Put the cursor at last position.
***REMOVED***
xrx.xml.Reader.prototype.last = function() {
  this.pos_ = this.length_ - 1;
***REMOVED***



***REMOVED***
***REMOVED*** Put the cursor at a position.
***REMOVED*** @param {number} The position.
***REMOVED***
xrx.xml.Reader.prototype.set = function(pos) {
  this.pos_ = pos || 0;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the current symbol.
***REMOVED*** @return {string} The current symbol.
***REMOVED***
xrx.xml.Reader.prototype.get = function() {
  return this.input_.charAt(this.pos_);
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader reached the end of the input string.
***REMOVED*** @return {boolean} At end or not.
***REMOVED***
xrx.xml.Reader.prototype.finished = function() {
  return this.pos_ < 0 || this.pos_ > this.length_ ? true : false;
***REMOVED***



***REMOVED***
***REMOVED*** Puts the cursor one symbol forward and returns the new symbol.
***REMOVED*** @return {string} The symbol.
***REMOVED***
xrx.xml.Reader.prototype.next = function() {
  return this.input_.charAt(this.pos_++);
***REMOVED***



***REMOVED***
***REMOVED*** Puts the cursor one symbol backward and returns the new symbol.
***REMOVED*** @return {string} The symbol.
***REMOVED***
xrx.xml.Reader.prototype.previous = function() {
  return this.input_.charAt(this.pos_--);
***REMOVED***



***REMOVED***
***REMOVED*** Peeks a symbol at a position relative to the current cursor
***REMOVED*** position without moving the cursor and returns the symbol.
***REMOVED*** @param {number} i The position relative to the cursor. May be
***REMOVED***    a positive or negative integer.
***REMOVED*** @return {string} The peeked symbol.
***REMOVED***
xrx.xml.Reader.prototype.peek = function(i) {
  return this.input_.charAt(this.pos_ + (i || 0));
***REMOVED***



***REMOVED***
***REMOVED*** Moves the cursor n steps forward.
***REMOVED*** @param {number} The number of steps. A positive integer only.
***REMOVED***
xrx.xml.Reader.prototype.forward = function(i) {
  this.pos_ += (i || 0);
***REMOVED***



***REMOVED***
***REMOVED*** Moves the cursor n steps backward.
***REMOVED*** @param {number} The number of steps. A positive integer only.
***REMOVED***
xrx.xml.Reader.prototype.backward = function(i) {
  this.pos_ -= (i || 0);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.xml.Reader.prototype.forwardInclusive = function(ch) {
  var i;
  for (i = 0;; i++) {
    if (this.peek(i) === ch) break;
  }
  this.forward(++i);
***REMOVED***



xrx.xml.Reader.prototype.forwardExclusive = function(ch) {
  var i;
  for (i = 0;; i++) {
    if (this.peek(i) === ch) break;
  }
  this.forward(i);
***REMOVED***



xrx.xml.Reader.prototype.backwardInclusive = function(ch) {
  var i;
  for (i = 0;; i++) {
    if (this.peek(-i) === ch) break;
  }
  this.backward(i);
***REMOVED***



xrx.xml.Reader.prototype.backwardExclusive = function(ch) {
  var i;
  for (i = 0;; i++) {
    if (this.peek(-i) === ch) break;
  }
  this.backward(--i);
***REMOVED***
