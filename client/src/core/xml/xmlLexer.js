***REMOVED***
***REMOVED*** @fileoverview Lexical helper class for xrx.xml.Stream.
***REMOVED***

goog.provide('xrx.xml.Lexer');



xrx.xml.Lexer = function() {***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at a CDATA start token.
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atCDStart = function(reader) {
  return reader.peek(1) === '!' && reader.peek(2) === '[' &&
      reader.peek(3) === 'C' && reader.peek(4) === 'D' &&
      reader.peek(5) === 'A' && reader.peek(6) === 'T' &&
      reader.peek(7) === 'A' && reader.peek(2) === '[';
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at a CDATA end token.
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atCDEnd = function(reader) {
  return reader.peek(1) === ']' && reader.peek(2) === '>';
***REMOVED***



***REMOVED***
***REMOVED*** Whether the reader is located at a comment token.
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atComment = function(reader) {
  return reader.peek(1) === '!' && reader.peek(2) === '-' &&
      reader.peek(3) === '-';
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
***REMOVED*** Whether the reader is located at a processing instruction token.
***REMOVED*** @param {xrx.xml.Reader} reader The XML reader.
***REMOVED*** @return {boolean} Located or not.
***REMOVED***
xrx.xml.Lexer.atPI = function(reader) {
  return reader.peek(1) === '?';
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
