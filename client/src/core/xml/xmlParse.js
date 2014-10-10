/**
 * @fileoverview A class to parse and normalize 
 * stringified XML documents.
 */

goog.provide('xrx.xml.Parser');



goog.require('goog.string');
goog.require('xrx.xml.Serialize');



/**
 * A class to parse and normalize stringified XML
 * documents
 */
xrx.xml.Parser = function() {



  this.contentHandler;



  this.saxParser;



  this.initSax();
};



xrx.xml.Parser.prototype.initSax = function() {

  this.contentHandler = new DefaultHandler2();
  this.saxParser = XMLReaderFactory.createXMLReader();
  this.saxParser.setHandler(this.contentHandler);
};



xrx.xml.Parser.prototype.normalize = function(xml) {
  var self = this;
  var idx = -2;
  var namespaces = [];
  var normalized = '';
  var lastToken;


  var completeStartTag = function() {
    if (lastToken === xrx.token.START_TAG) normalized += '>';
  };


  this.contentHandler.characters = function(ch, start, length) {

    completeStartTag();

    normalized += goog.string.trim(ch.split('\n').join(''));
    idx = -2;

    lastToken = xrx.token.NOT_TAG;
  };

  this.contentHandler.endDocument = function() {

  };

  this.contentHandler.endElement = function(uri, localName, qName) {

    if (self.saxParser.saxScanner.reader.reader.nextIdx === idx) {
      normalized += '/>';
      lastToken = xrx.token.EMPTY_TAG;
    } else if (lastToken === xrx.token.START_TAG) {
      normalized += '>' + xrx.xml.Serialize.endTag(qName);
      lastToken = xrx.token.END_TAG;
    } else {
      normalized += xrx.xml.Serialize.endTag(qName);
    }
  };

  this.contentHandler.endPrefixMapping = function(prefix) {

  };

  this.contentHandler.ignorableWhitespace = function(ch, start, length) {

    completeStartTag();

    idx = -2;

    lastToken = xrx.token.NOT_TAG;
  };

  this.contentHandler.processingInstruction = function(target, data) {

  };

  this.contentHandler.skippedEntity = function(name) {

  };

  this.contentHandler.startDocument = function() {

  };

  this.contentHandler.startElement = function(uri, localName, qName, atts) {
    var n = "";
    var a = "";
    var arr = atts.attsArray;

    completeStartTag();

    idx = self.saxParser.saxScanner.reader.reader.nextIdx;
    for (var nn in namespaces) {
      var prefix = namespaces[nn].prefix;
      prefix === '' ? prefix += 'xmlns' : prefix = 'xmlns:' + prefix;
      n += xrx.xml.Serialize.namespace(prefix, namespaces[nn].uri);
    };
    namespaces = [];
    for (var aa in atts.attsArray) {
      a += xrx.xml.Serialize.attribute(arr[aa].qName, arr[aa].value);
    };

    normalized += xrx.xml.Serialize.startEmptyTag(qName, n, a);
    lastToken = xrx.token.START_TAG;
  };

  this.contentHandler.startPrefixMapping = function(prefix, uri) {

    namespaces.push({ prefix: prefix, uri: uri });
  };

  this.saxParser.parseString(xml);

  return normalized;
};
