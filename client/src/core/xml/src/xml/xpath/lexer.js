***REMOVED***
***REMOVED*** @fileoverview The lexer class for tokenizing xpath expressions.
***REMOVED***

goog.provide('xrx.xpath.Lexer');



***REMOVED***
***REMOVED*** Constructs a lexer.
***REMOVED***
***REMOVED*** @param {!Array.<string>} tokens Tokens to iterate over.
***REMOVED***
***REMOVED***
xrx.xpath.Lexer = function(tokens) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tokens_ = tokens;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.index_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Tokenizes a source string into an array of tokens.
***REMOVED***
***REMOVED*** @param {string} source Source string to tokenize.
***REMOVED*** @return {!xrx.xpath.Lexer} Essentially an iterator over the tokens.
***REMOVED***
xrx.xpath.Lexer.tokenize = function(source) {
  var tokens = source.match(xrx.xpath.Lexer.TOKEN_);

  // Removes tokens starting with whitespace from the array.
  for (var i = 0; i < tokens.length; i++) {
    if (xrx.xpath.Lexer.LEADING_WHITESPACE_.test(tokens[i])) {
      tokens.splice(i, 1);
    }
  }
  return new xrx.xpath.Lexer(tokens);
***REMOVED***


***REMOVED***
***REMOVED*** Regular expressions to match XPath productions.
***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {!RegExp}
***REMOVED*** @private
***REMOVED***
xrx.xpath.Lexer.TOKEN_ = new RegExp(
    '\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+' +
        // Nodename (possibly with namespace) or variable.
    '|\\/\\/' + // Double slash.
    '|\\.\\.' + // Double dot.
    '|::' + // Double colon.
    '|\\d+(?:\\.\\d*)?' + // Number starting with digit.
    '|\\.\\d+' + // Number starting with decimal point.
    '|"[^"]*"' + // Double quoted string.
    '|\'[^\']*\'' + // Single quoted string.
    '|[!<>]=' + // Operators
    '|\\s+' + // Whitespaces.
    '|.', // Any single character.
    'g');


***REMOVED***
***REMOVED*** Regex to check if a string starts with a whitespace character.
***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {!RegExp}
***REMOVED*** @private
***REMOVED***
xrx.xpath.Lexer.LEADING_WHITESPACE_ = /^\s/;


***REMOVED***
***REMOVED*** Peeks at the lexer. An optional index can be
***REMOVED*** used to specify the token peek at.
***REMOVED***
***REMOVED*** @param {number=} opt_i Index to peek at. Defaults to zero.
***REMOVED*** @return {string} Token peeked.
***REMOVED***
xrx.xpath.Lexer.prototype.peek = function(opt_i) {
  return this.tokens_[this.index_ + (opt_i || 0)];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the next token from the lexer and increments the index.
***REMOVED***
***REMOVED*** @return {string} The next token.
***REMOVED***
xrx.xpath.Lexer.prototype.next = function() {
  return this.tokens_[this.index_++];
***REMOVED***


***REMOVED***
***REMOVED*** Decrements the index by one.
***REMOVED***
xrx.xpath.Lexer.prototype.back = function() {
  this.index_--;
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the lexer is empty.
***REMOVED***
***REMOVED*** @return {boolean} Whether the lexer is empty.
***REMOVED***
xrx.xpath.Lexer.prototype.empty = function() {
  return this.tokens_.length <= this.index_;
***REMOVED***
