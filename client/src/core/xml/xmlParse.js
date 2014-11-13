***REMOVED***
***REMOVED*** @fileoverview A static class to parse and normalize 
***REMOVED***     stringified XML documents.
***REMOVED***

goog.provide('xrx.xml.Parser');



goog.require('goog.string');
goog.require('xrx.xml.Serialize');



***REMOVED***
***REMOVED*** A static class to parse and normalize stringified XML
***REMOVED*** documents.
***REMOVED***
***REMOVED***
xrx.xml.Parser = function() {


 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {DefaultHandler2}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.contentHandler_;



 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {XMLReader}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.saxParser_;

  this.initSax_();
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.xml.Parser.prototype.initSax_ = function() {
  this.contentHandler_ = new DefaultHandler2();
  this.saxParser_ = XMLReaderFactory.createXMLReader();
  this.saxParser_.setHandler(this.contentHandler_);
***REMOVED***



***REMOVED***
***REMOVED*** Normalize a stringified XML document. Whitespace and Document
***REMOVED*** Type Declarations (DTD) are removed.
***REMOVED*** @return {string} The normalized XML document string.
***REMOVED***
xrx.xml.Parser.prototype.normalize = function(xml) {
***REMOVED***
  var idx = -2;
  var namespaces = [];
  var normalized = '';
  var reader;
  var lastToken;

  var completeStartTag = function() {
    if (lastToken === xrx.token.START_TAG) normalized += '>';
 ***REMOVED*****REMOVED***

  this.contentHandler_.characters = function(ch, start, length) {
    completeStartTag();
    normalized += ch;
    idx = -2;
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.comment = function(ch, start, length) {
    completeStartTag();
    normalized += xrx.xml.Serialize.comment(ch);
    idx = -2;
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.endCDATA = function() {
    normalized += ']]>';
    idx = -2;
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.endDocument = function() {***REMOVED*** // do nothing

  this.contentHandler_.endDTD = function() { // do nothing
    /*
    var str = '';
    reader = self.saxParser_.saxScanner.reader.reader;
    str = reader.s.substring(0, reader.nextIdx - 1);
    str = str.substr(str.indexOf('<!DOCTYPE'));
    normalized += str;
  ***REMOVED*****REMOVED***
 ***REMOVED*****REMOVED***

  this.contentHandler_.endElement = function(uri, localName, qName) {
    if (self.saxParser_.saxScanner.reader.reader.nextIdx === idx) {
      normalized += '/>';
      lastToken = xrx.token.EMPTY_TAG;
    } else if (lastToken === xrx.token.START_TAG) {
      normalized += '>' + xrx.xml.Serialize.endTag(qName);
      lastToken = xrx.token.END_TAG;
    } else {
      normalized += xrx.xml.Serialize.endTag(qName);
    }
 ***REMOVED*****REMOVED***

  this.contentHandler_.endEntity = function() {***REMOVED*** // do nothing

  this.contentHandler_.endPrefixMapping = function(prefix) {***REMOVED*** // do nothing

  this.contentHandler_.ignorableWhitespace = function(ch, start, length) {
    completeStartTag();
    idx = -2;
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.processingInstruction = function(target, data) {
    completeStartTag();
    normalized += xrx.xml.Serialize.processingInstruction(target, data);
    idx = -2;
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.skippedEntity = function(name) {***REMOVED*** // do nothing

  this.contentHandler_.startCDATA = function() {
    completeStartTag();
    normalized += '<![CDATA[';
    idx = -2;
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.startDocument = function() {
    reader = self.saxParser_.saxScanner.reader.reader;
    if (reader.s[0] === '<' &&
        reader.s[1] === '?' &&
        reader.s[2] === 'x' &&
        reader.s[3] === 'm' &&
        reader.s[4] === 'l' &&
        reader.s[5] === ' ') {
      normalized += reader.s.substring(0, reader.s.indexOf('?>') + 2);
    }
 ***REMOVED*****REMOVED***

  this.contentHandler_.startDTD = function(name, publicId, systemId) {***REMOVED*** // do nothing

  this.contentHandler_.startElement = function(uri, localName, qName, atts) {
    var n = "";
    var a = "";
    var arr = atts.attsArray;

    completeStartTag();

    idx = self.saxParser_.saxScanner.reader.reader.nextIdx;
    for (var i = 0; i < namespaces.length; i++) {
      var prefix = namespaces[i].prefix;
      prefix === '' ? prefix += 'xmlns' : prefix = 'xmlns:' + prefix;
      n += xrx.xml.Serialize.namespace(prefix, namespaces[i].uri);
   ***REMOVED*****REMOVED***
    namespaces = [];
    for (var i = 0; i < arr.length; i++) {
      a += xrx.xml.Serialize.attribute(arr[i].qName, arr[i].value);
   ***REMOVED*****REMOVED***

    normalized += xrx.xml.Serialize.startEmptyTag(qName, n, a);
    lastToken = xrx.token.START_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.startEntity = function() {***REMOVED*** // do nothing

  this.contentHandler_.startPrefixMapping = function(prefix, uri) {
    namespaces.push({ prefix: prefix, uri: uri });
 ***REMOVED*****REMOVED***

  this.saxParser_.parseString(xml);

  return normalized;
***REMOVED***
