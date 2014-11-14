***REMOVED***
***REMOVED*** @fileoverview A static class providing functions for lexical tests.
***REMOVED***

goog.provide('xrx.xml.Lexer');



***REMOVED***
***REMOVED*** A static class providing functions for lexical tests according to the
***REMOVED*** <a href="http://www.w3.org/TR/REC-xml/">Extensible Markup Language (XML)</a>.
***REMOVED*** Like the {@link xrx.xml.Stream} class, this class assumes a well-formed and
***REMOVED*** normalized XML input. Make sure that the XML input is parsed
***REMOVED*** with {@link xrx.xml.Parser} beforehand.
***REMOVED***
***REMOVED***
xrx.xml.Lexer = function() {***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at a CDStart token.
***REMOVED*** <br>[19] CDStart ::= '&lt;![CDATA['
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @param {boolean} opt_reverse Whether to test in forward direction
***REMOVED***     (false|undefined) or in backward direction (true).
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atCDStart = function(reader, opt_reverse) {
  return opt_reverse ?
      reader.peek(-1) === 'A' && reader.peek(-2) === 'T' &&
      reader.peek(-3) === 'A' && reader.peek(-4) === 'D' &&
      reader.peek(-5) === 'C' && reader.peek(-6) === '[' &&
      reader.peek(-7) === '!' && reader.peek(-8) === '<' :
      reader.peek(1) === '!' && reader.peek(2) === '[' &&
      reader.peek(3) === 'C' && reader.peek(4) === 'D' &&
      reader.peek(5) === 'A' && reader.peek(6) === 'T' &&
      reader.peek(7) === 'A' && reader.peek(8) === '[';
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at a CDEnd token.
***REMOVED*** <li>[21] CDEnd   ::= ']]'&gt;
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @param {boolean} opt_reverse Whether to test in forward direction
***REMOVED***     (false|undefined) or in backward direction (true).
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atCDEnd = function(reader, opt_reverse) {
  return opt_reverse ? reader.peek(-1) === ']' && reader.peek(-2) === ']' :
      reader.peek(1) === ']' && reader.peek(2) === '>';
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at the start of a comment token.
***REMOVED*** <br>[15] Comment ::= '&lt;!--' ((Char - '-') | ('-' (Char - '-')))* '--'&gt;
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @param {boolean} opt_reverse Whether to test in forward direction
***REMOVED***     (false|undefined) or in backward direction (true).
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atCommentStart = function(reader, opt_reverse) {
  return opt_reverse ? reader.peek(-1) === '-' : reader.peek(1) === '!' &&
      reader.peek(2) === '-' && reader.peek(3) === '-';
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at the end of a comment token.
***REMOVED*** <br>[15] Comment ::= '&lt;!--' ((Char - '-') | ('-' (Char - '-')))* '--'&gt;
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @param {boolean} opt_reverse Whether to test in forward direction
***REMOVED***     (false|undefined) or in backward direction (true).
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atCommentEnd = function(reader, opt_reverse) {
  return opt_reverse ? reader.peek(-1) === '-' : reader.peek(1) === '-';
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at an end-tag token.
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atEndTag = function(reader) {
  return reader.peek(1) === '/';
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at the start of a processing instruction
***REMOVED*** token.
***REMOVED*** <br>[16] PI ::= '<?' PITarget (S (Char* - (Char* '?>' Char*)))? '?>'
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @param {boolean} opt_reverse Whether to test in forward direction
***REMOVED***     (false|undefined) or in backward direction (true).
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atPIStart = function(reader, opt_reverse) {
  return opt_reverse ? reader.peek(-1) === '<' : reader.peek(1) === '?';
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at the end of a processing instruction
***REMOVED*** token.
***REMOVED*** <br>[16] PI ::= '<?' PITarget (S (Char* - (Char* '?>' Char*)))? '?>'
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @param {boolean} opt_reverse Whether to test in forward direction
***REMOVED***     (false|undefined) or in backward direction (true).
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atPIEnd = function(reader, opt_reverse) {
  return opt_reverse ? reader.peek(-1) === '?' : reader.peek(1) === '>';
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at an XML declaration token.
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atXmlDecl = function(reader) {
  return reader.peek(1) === '?' && reader.peek(2) === 'x' &&
      reader.peek(3) === 'm' && reader.peek(4) === 'l' &&
      reader.peek(5) === ' ';
***REMOVED***
