***REMOVED***
***REMOVED*** @fileoverview A class to parse and normalize 
***REMOVED***     stringified XML documents.
***REMOVED***

goog.provide('xrx.xml.Parser');



goog.require('goog.string');
goog.require('xrx.xml.Serialize');



***REMOVED***
***REMOVED*** A class to parse and normalize stringified XML
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
***REMOVED*** Normalize a stringified XML document.
***REMOVED*** @return {string} The normalized XML document string.
***REMOVED***
xrx.xml.Parser.prototype.normalize = function(xml) {
***REMOVED***
  var idx = -2;
  var namespaces = [];
  var normalized = '';
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
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.endCDATA = function() {
    normalized += ']]>';
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.endDocument = function() {***REMOVED*** // do nothing

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

  this.contentHandler_.endPrefixMapping = function(prefix) {***REMOVED*** // do nothing

  this.contentHandler_.ignorableWhitespace = function(ch, start, length) {
    completeStartTag();
    idx = -2;
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.processingInstruction = function(target, data) {
    completeStartTag();
    normalized += xrx.xml.Serialize.processingInstruction(target, data);
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.skippedEntity = function(name) {***REMOVED*** // do nothing

  this.contentHandler_.startCDATA = function() {
    completeStartTag();
    normalized += '<![CDATA[';
    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler_.startDocument = function() {***REMOVED*** // do nothing

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

  this.contentHandler_.startPrefixMapping = function(prefix, uri) {
    namespaces.push({ prefix: prefix, uri: uri });
 ***REMOVED*****REMOVED***

  this.saxParser_.parseString(xml);

  return normalized;
***REMOVED***