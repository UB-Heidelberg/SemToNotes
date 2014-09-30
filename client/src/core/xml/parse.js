***REMOVED***
***REMOVED*** @fileoverview A class to parse and normalize 
***REMOVED*** stringified XML documents.
***REMOVED***

goog.provide('xrx.parse');



goog.require('goog.string');
goog.require('xrx.serialize');



***REMOVED***
***REMOVED*** A class to parse and normalize stringified XML
***REMOVED*** documents
***REMOVED***
xrx.parse = function() {



  this.contentHandler;



  this.saxParser;



  this.initSax();
***REMOVED***



xrx.parse.prototype.initSax = function() {

  this.contentHandler = new DefaultHandler2();
  this.saxParser = XMLReaderFactory.createXMLReader();
  this.saxParser.setHandler(this.contentHandler);
***REMOVED***



xrx.parse.prototype.normalize = function(xml) {
***REMOVED***
  var idx = -2;
  var namespaces = [];
  var normalized = '';
  var lastToken;


  var completeStartTag = function() {
    if (lastToken === xrx.token.START_TAG) normalized += '>';
 ***REMOVED*****REMOVED***


  this.contentHandler.characters = function(ch, start, length) {

    completeStartTag();

    normalized += goog.string.trim(ch.split('\n').join(''));
    idx = -2;

    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler.endDocument = function() {

 ***REMOVED*****REMOVED***

  this.contentHandler.endElement = function(uri, localName, qName) {

    if (self.saxParser.saxScanner.reader.reader.nextIdx === idx) {
      normalized += '/>';
      lastToken = xrx.token.EMPTY_TAG;
    } else if (lastToken === xrx.token.START_TAG) {
      normalized += '>' + xrx.serialize.endTag(qName);
      lastToken = xrx.token.END_TAG;
    } else {
      normalized += xrx.serialize.endTag(qName);
    }
 ***REMOVED*****REMOVED***

  this.contentHandler.endPrefixMapping = function(prefix) {

 ***REMOVED*****REMOVED***

  this.contentHandler.ignorableWhitespace = function(ch, start, length) {

    completeStartTag();

    idx = -2;

    lastToken = xrx.token.NOT_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler.processingInstruction = function(target, data) {

 ***REMOVED*****REMOVED***

  this.contentHandler.skippedEntity = function(name) {

 ***REMOVED*****REMOVED***

  this.contentHandler.startDocument = function() {

 ***REMOVED*****REMOVED***

  this.contentHandler.startElement = function(uri, localName, qName, atts) {
    var n = "";
    var a = "";
    var arr = atts.attsArray;

    completeStartTag();

    idx = self.saxParser.saxScanner.reader.reader.nextIdx;
    for (var nn in namespaces) {
      var prefix = namespaces[nn].prefix;
      prefix === '' ? prefix += 'xmlns' : prefix = 'xmlns:' + prefix;
      n += xrx.serialize.namespace(prefix, namespaces[nn].uri);
   ***REMOVED*****REMOVED***
    namespaces = [];
    for (var aa in atts.attsArray) {
      a += xrx.serialize.attribute(arr[aa].qName, arr[aa].value);
   ***REMOVED*****REMOVED***

    normalized += xrx.serialize.startEmptyTag(qName, n, a);
    lastToken = xrx.token.START_TAG;
 ***REMOVED*****REMOVED***

  this.contentHandler.startPrefixMapping = function(prefix, uri) {

    namespaces.push({ prefix: prefix, uri: uri });
 ***REMOVED*****REMOVED***

  this.saxParser.parseString(xml);

  return normalized;
***REMOVED***
